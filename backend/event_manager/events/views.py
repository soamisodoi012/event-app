from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Event, Booking
from .serializers import (
    EventSerializer, EventListSerializer, BookingSerializer,
    CreateBookingSerializer, UserSerializer, UserRegisterSerializer
)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        return EventSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        # Get query parameters for filtering
        show_past = self.request.query_params.get('show_past', 'false').lower() == 'true'
        status_filter = self.request.query_params.get('status', None)
        
        queryset = Event.objects.all()
        
        # Filter by status
        if status_filter == 'upcoming':
            queryset = queryset.filter(date__gte=timezone.now())
        elif status_filter == 'past':
            queryset = queryset.filter(date__lt=timezone.now())
        elif not show_past:
            # Default: show only upcoming events
            queryset = queryset.filter(date__gte=timezone.now())
            
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'book_ticket']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def book_ticket(self, request, pk=None):
        event = self.get_object()
        
        # Check if event is in the past
        if event.is_past():
            return Response(
                {'error': 'Cannot book tickets for past events'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = CreateBookingSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        tickets_count = serializer.validated_data['tickets_count']
        
        try:
            with transaction.atomic():
                # Check if user already booked this event
                existing_booking = Booking.objects.filter(
                    user=request.user, 
                    event=event
                ).first()
                
                if existing_booking:
                    return Response(
                        {'error': 'You have already booked this event'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Check ticket availability
                if event.tickets_available < tickets_count:
                    return Response(
                        {'error': f'Only {event.tickets_available} tickets available'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create booking
                booking = Booking.objects.create(
                    user=request.user,
                    event=event,
                    tickets_count=tickets_count
                )
                
                # Update available tickets
                event.tickets_available -= tickets_count
                event.save()
                
                return Response({
                    'message': f'Successfully booked {tickets_count} ticket(s)!',
                    'tickets_available': event.tickets_available,
                    'booking_id': booking.id
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            print(f"Booking error: {str(e)}")
            return Response(
                {'error': 'Booking failed. Please try again.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.GET.get('q', '')
        location = request.GET.get('location', '')
        show_past = request.GET.get('show_past', 'false').lower() == 'true'
        status_filter = request.GET.get('status', None)
        
        events = Event.objects.all()
        
        # Apply filters
        if query:
            events = events.filter(title__icontains=query)
        if location:
            events = events.filter(location__icontains=location)
            
        # Filter by status
        if status_filter == 'upcoming':
            events = events.filter(date__gte=timezone.now())
        elif status_filter == 'past':
            events = events.filter(date__lt=timezone.now())
        elif not show_past:
            # Default: show only upcoming events
            events = events.filter(date__gte=timezone.now())
            
        # Get the page for pagination
        page = self.paginate_queryset(events)
        if page is not None:
            serializer = EventListSerializer(
                page, 
                many=True, 
                context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
            
        serializer = EventListSerializer(
            events, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)

    # New action to get past events
    @action(detail=False, methods=['get'])
    def past_events(self, request):
        past_events = Event.objects.filter(date__lt=timezone.now())
        
        page = self.paginate_queryset(past_events)
        if page is not None:
            serializer = EventListSerializer(
                page, 
                many=True, 
                context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
            
        serializer = EventListSerializer(
            past_events, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)

    # New action to get upcoming events
    @action(detail=False, methods=['get'])
    def upcoming_events(self, request):
        upcoming_events = Event.objects.filter(date__gte=timezone.now())
        
        page = self.paginate_queryset(upcoming_events)
        if page is not None:
            serializer = EventListSerializer(
                page, 
                many=True, 
                context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
            
        serializer = EventListSerializer(
            upcoming_events, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related('event')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            booking = self.get_object()
            
            # Don't allow cancellation for past events (optional)
            if booking.event.is_past():
                return Response(
                    {'error': 'Cannot cancel booking for past events'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                # Restore tickets
                event = booking.event
                event.tickets_available += booking.tickets_count
                event.save()
                
                # Delete booking
                booking.delete()
                
            return Response(
                {'message': 'Booking cancelled successfully'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"Cancellation error: {str(e)}")
            return Response(
                {'error': 'Failed to cancel booking'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    try:
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return Response(
            {'error': 'Registration failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)