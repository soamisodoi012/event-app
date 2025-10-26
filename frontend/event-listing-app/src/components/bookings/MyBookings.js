import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      const bookingsData = response.data.results || response.data;
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch your bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await bookingService.cancelBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
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

  if (loading) {
    return (
      <div className="loading">
        <div>Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>My Bookings 📖</h1>
      
      {error && <div className="error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>You haven't booked any events yet. Start exploring amazing events!</p>
          <button 
            onClick={() => navigate('/')}
            className="search-button"
            style={{ marginTop: '20px' }}
          >
            🎭 Explore Events
          </button>
        </div>
      ) : (
        <div>
          {bookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <div className="booking-header">
                <div style={{ flex: 1 }}>
                  <h3 
                    className="booking-title"
                    onClick={() => handleEventClick(booking.event)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {booking.event_title}
                  </h3>
                </div>
                
                <button 
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={cancellingId === booking.id}
                  className="cancel-button"
                >
                  {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
              
              <div className="booking-info">
                <div className="booking-date">
                  <span>📅</span>
                  <strong>Event Date:</strong>
                  <span>{formatDate(booking.event_date)}</span>
                </div>
                
                <div className="booking-date">
                  <span>📍</span>
                  <strong>Location:</strong>
                  <span>{booking.event_location}</span>
                </div>
                
                <div className="booking-date">
                  <span>🎫</span>
                  <strong>Tickets:</strong>
                  <span>{booking.tickets_count}</span>
                </div>
                
                <div className="booking-date">
                  <span>⏰</span>
                  <strong>Booked On:</strong>
                  <span>{formatDate(booking.booked_at)}</span>
                </div>
              </div>
              
              {booking.event_image && (
                <img 
                  src={booking.event_image}
                  alt={booking.event_title}
                  style={{
                    width: '100px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginTop: '10px'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x60/667eea/ffffff?text=Event';
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;