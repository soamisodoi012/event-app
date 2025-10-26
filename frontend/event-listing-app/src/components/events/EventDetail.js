import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/api';
import { authService } from '../../services/auth';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [ticketsCount, setTicketsCount] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvent(id);
      console.log('Event data:', response.data);
      setEvent(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to fetch event details. Please make sure the event exists.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get proper image URL for detail page (use full image)
  const getImageUrl = () => {
    if (!event) return '';
    
    // Priority: full image > thumbnail > placeholder
    if (event.image_url) {
      return event.image_url;
    }
    
    if (event.thumbnail_url) {
      return event.thumbnail_url;
    }
    
    // Return a data URL for a simple placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNjY3RWVhIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
  };

  const handleBookTicket = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: `/event/${id}` } });
      return;
    }

    // Check if event is past
    if (event.is_past) {
      setError('Cannot book tickets for past events.');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      setSuccess('');
      
      const response = await eventService.bookTicket(id, ticketsCount);
      
      setEvent(prev => ({
        ...prev,
        tickets_available: response.data.tickets_available
      }));

      setSuccess(`🎉 Successfully booked ${ticketsCount} ticket(s)!`);
      setTicketsCount(1);
      
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.detail || 
                          'Failed to book ticket. Please try again.';
      setError(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleImageError = (e) => {
    console.log('Image failed to load, showing placeholder');
    setImageError(true);
    e.target.style.display = 'none';
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const getTimeRemaining = (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      return { ended: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, ended: false };
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error">
        Event not found. Please check the event ID and try again.
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => navigate('/')} className="search-button">
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl();
  const isPastEvent = event.is_past;
  const timeRemaining = getTimeRemaining(event.date);

  return (
    <div>
      <button 
        onClick={() => navigate('/')}
        className="back-button"
      >
        ← Back to Events
      </button>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className={`event-detail ${isPastEvent ? 'past-event-detail' : ''}`}>
        {/* Event Status Banner */}
        <div 
          className={`event-status-banner ${isPastEvent ? 'past' : event.status}`}
          style={{
            padding: '15px 20px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'white',
            backgroundColor: isPastEvent ? '#6c757d' : 
                            event.status === 'today' ? '#28a745' : '#17a2b8'
          }}
        >
          {isPastEvent ? (
            <>⏰ This event has ended</>
          ) : event.status === 'today' ? (
            <>🎉 Happening Today!</>
          ) : (
            <>📅 Upcoming Event</>
          )}
        </div>

        {!imageError ? (
          <img 
            src={imageUrl}
            alt={event.title}
            className="event-image"
            style={isPastEvent ? { filter: 'grayscale(30%)' } : {}}
            onError={handleImageError}
          />
        ) : (
          <div 
            className="event-image-placeholder"
            style={{
              width: '100%',
              height: '400px',
              background: isPastEvent 
                ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {event.title}
          </div>
        )}
        
        <div className="event-detail-content">
          <h1 className="event-detail-title" style={isPastEvent ? { color: '#6c757d' } : {}}>
            {event.title}
            {isPastEvent && <span style={{ fontSize: '1rem', color: '#dc3545', marginLeft: '12px' }}>(Event Ended)</span>}
          </h1>
          
          {/* Countdown Timer for Upcoming Events */}
          {!isPastEvent && !timeRemaining.ended && (
            <div className="countdown-timer" style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              border: '2px solid #17a2b8'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>⏰ Time Until Event</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '1.2rem' }}>
                <div>
                  <strong>{timeRemaining.days}</strong>
                  <div style={{ fontSize: '0.8rem' }}>Days</div>
                </div>
                <div>
                  <strong>{timeRemaining.hours}</strong>
                  <div style={{ fontSize: '0.8rem' }}>Hours</div>
                </div>
                <div>
                  <strong>{timeRemaining.minutes}</strong>
                  <div style={{ fontSize: '0.8rem' }}>Minutes</div>
                </div>
              </div>
            </div>
          )}

          <div className="event-detail-info">
            <span>📅</span>
            <strong>Date & Time:</strong>
            <span style={isPastEvent ? { color: '#6c757d', textDecoration: 'line-through' } : {}}>
              {formatDate(event.date)}
            </span>
          </div>
          
          <div className="event-detail-info">
            <span>📍</span>
            <strong>Location:</strong>
            <span style={isPastEvent ? { color: '#6c757d' } : {}}>{event.location}</span>
          </div>
          
          <div className="event-detail-info">
            <span>🎫</span>
            <strong>Tickets Available:</strong>
            <span style={{ 
              color: isPastEvent ? '#6c757d' : 
                     event.tickets_available === 0 ? '#e74c3c' : 
                     event.tickets_available < 10 ? '#f39c12' : '#27ae60',
              fontWeight: 'bold',
              textDecoration: isPastEvent ? 'line-through' : 'none'
            }}>
              {isPastEvent ? 'Event Ended' : event.tickets_available}
            </span>
          </div>

          <div className="event-description">
            <h3>About This Event</h3>
            <p>{event.description || 'No description available for this event.'}</p>
          </div>

          <div className="booking-section" style={isPastEvent ? { opacity: 0.6 } : {}}>
            <h3>Book Your Tickets</h3>
            
            {isPastEvent ? (
              <div className="past-event-message" style={{
                textAlign: 'center',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                color: '#6c757d'
              }}>
                <h4>⏰ Event Ended</h4>
                <p>This event has already taken place. Ticket booking is no longer available.</p>
              </div>
            ) : authService.isAuthenticated() ? (
              <div>
                <div className="ticket-selector">
                  <label>
                    <strong>Number of Tickets:</strong>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={event.tickets_available}
                    value={ticketsCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setTicketsCount(Math.max(1, Math.min(value, event.tickets_available)));
                    }}
                    className="ticket-input"
                    disabled={event.tickets_available === 0 || bookingLoading}
                  />
                  <span>Max: {event.tickets_available}</span>
                </div>
                
                <button 
                  onClick={handleBookTicket}
                  disabled={event.tickets_available === 0 || ticketsCount > event.tickets_available || bookingLoading}
                  className="book-button"
                >
                  {bookingLoading ? 'Booking...' : 
                   event.tickets_available === 0 ? 'Sold Out' : 
                   `Book ${ticketsCount} Ticket${ticketsCount > 1 ? 's' : ''} 🎟️`}
                </button>
                
                {event.tickets_available > 0 && ticketsCount > event.tickets_available && (
                  <div className="warning" style={{ marginTop: '15px' }}>
                    You cannot book more tickets than available.
                  </div>
                )}
              </div>
            ) : (
              <div className="login-prompt">
                <p>Please log in to book tickets for this event.</p>
                <button 
                  onClick={() => navigate('/login', { state: { from: `/event/${id}` } })}
                  className="book-button"
                  style={{ marginTop: '15px' }}
                >
                  🔑 Login to Book
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;