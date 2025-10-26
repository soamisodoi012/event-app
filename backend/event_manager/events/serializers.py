from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Event, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class EventSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    is_past = serializers.SerializerMethodField()
    is_upcoming = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    can_book = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return f"http://localhost:8000{obj.thumbnail.url}"
        return None

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://localhost:8000{obj.thumbnail.url}"
        return None

    def get_is_past(self, obj):
        return obj.is_past()

    def get_is_upcoming(self, obj):
        return obj.is_upcoming()

    def get_status(self, obj):
        return obj.get_status()

    def get_can_book(self, obj):
        return obj.can_book()

class EventListSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    is_past = serializers.SerializerMethodField()
    is_upcoming = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    can_book = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'date', 'location', 'thumbnail_url', 'tickets_available', 'is_past', 'is_upcoming', 'status', 'can_book']

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return f"http://localhost:8000{obj.thumbnail.url}"
        return None

    def get_is_past(self, obj):
        return obj.is_past()

    def get_is_upcoming(self, obj):
        return obj.is_upcoming()

    def get_status(self, obj):
        return obj.get_status()

    def get_can_book(self, obj):
        return obj.can_book()

class BookingSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateTimeField(source='event.date', read_only=True)
    event_location = serializers.CharField(source='event.location', read_only=True)
    event_image = serializers.SerializerMethodField()
    event_is_past = serializers.BooleanField(source='event.is_past', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'event', 'event_title', 'event_date', 'event_location', 'event_image', 'event_is_past', 'booked_at', 'tickets_count']

    def get_event_image(self, obj):
        if obj.event.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.event.thumbnail.url)
            return f"http://localhost:8000{obj.event.thumbnail.url}"
        return None

class CreateBookingSerializer(serializers.Serializer):
    tickets_count = serializers.IntegerField(default=1, min_value=1)

    def validate_tickets_count(self, value):
        if value <= 0:
            raise serializers.ValidationError("Number of tickets must be at least 1")
        return value