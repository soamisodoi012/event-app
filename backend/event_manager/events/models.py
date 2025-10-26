from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from django.utils import timezone

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    tickets_available = models.IntegerField(validators=[MinValueValidator(0)])
    thumbnail = models.ImageField(
        upload_to='event_thumbnails/',
        blank=True,
        null=True
    )
    image = models.ImageField(
        upload_to='event_images/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_thumbnail_url(self):
        if self.thumbnail:
            return self.thumbnail.url
        return '/static/default-thumbnail.jpg'

    def get_image_url(self):
        if self.image:
            return self.image.url
        return '/static/default-image.jpg'

    # Check if event is in the past
    def is_past(self):
        if not self.date:  # Handle None date
            return False
        return self.date < timezone.now()

    # Check if event is upcoming
    def is_upcoming(self):
        if not self.date:  # Handle None date
            return True  # Consider events without date as upcoming
        return self.date >= timezone.now()

    # Check if event is happening today
    def is_today(self):
        if not self.date:  # Handle None date
            return False
        return self.date.date() == timezone.now().date()

    # Get event status
    def get_status(self):
        if not self.date:  # Handle None date
            return 'unscheduled'
        elif self.is_past():
            return 'past'
        elif self.is_today():
            return 'today'
        else:
            return 'upcoming'

    # Check if booking is allowed (not past and tickets available)
    def can_book(self):
        if not self.date:  # Handle None date
            return self.tickets_available > 0
        return self.is_upcoming() and self.tickets_available > 0

    class Meta:
        ordering = ['date']

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    booked_at = models.DateTimeField(auto_now_add=True)
    tickets_count = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    
    class Meta:
        unique_together = ['user', 'event']
        ordering = ['-booked_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title} ({self.tickets_count})"