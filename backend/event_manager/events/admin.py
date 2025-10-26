from django.contrib import admin
from .models import Event, Booking

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'location', 'tickets_available', 'is_upcoming_display', 'is_past_display', 'status_display', 'can_book_display', 'created_at']
    list_filter = ['date', 'location', 'created_at']
    search_fields = ['title', 'location', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'description', 'date', 'location')
        }),
        ('Tickets & Media', {
            'fields': ('tickets_available', 'thumbnail', 'image')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def is_upcoming_display(self, obj):
        return obj.is_upcoming()
    is_upcoming_display.boolean = True
    is_upcoming_display.short_description = 'Upcoming'
    
    def is_past_display(self, obj):
        return obj.is_past()
    is_past_display.boolean = True
    is_past_display.short_description = 'Past Event'
    
    def status_display(self, obj):
        status = obj.get_status()
        status_display_map = {
            'unscheduled': '⏳ Unscheduled',
            'past': '⏰ Past',
            'today': '🎉 Today',
            'upcoming': '📅 Upcoming'
        }
        return status_display_map.get(status, status.upper())
    status_display.short_description = 'Status'
    
    def can_book_display(self, obj):
        return obj.can_book()
    can_book_display.boolean = True
    can_book_display.short_description = 'Can Book'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'tickets_count', 'booked_at', 'event_is_past']
    list_filter = ['booked_at', 'event', 'event__date']
    search_fields = ['user__username', 'event__title']
    readonly_fields = ['booked_at']
    
    def event_is_past(self, obj):
        return obj.event.is_past()
    event_is_past.boolean = True
    event_is_past.short_description = 'Event Ended'