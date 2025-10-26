import React from 'react';

const EventCard = ({ event, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Date not scheduled';
    }
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
      return 'Invalid date';
    }
  };

  // Function to get proper image URL for card (use thumbnail)
  const getImageUrl = () => {
    if (!event.thumbnail_url) {
      // Return a data URL for a simple placeholder
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDM1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjY3RWVhIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
    }
    
    return event.thumbnail_url;
  };

  const imageUrl = getImageUrl();
  const isPastEvent = event.is_past;
  const canBook = event.can_book;
  const isUnscheduled = event.status === 'unscheduled';

  return (
    <div 
      className={`event-card ${isPastEvent ? 'past-event' : ''} ${isUnscheduled ? 'unscheduled-event' : ''}`}
      onClick={onClick}
      style={isPastEvent ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
    >
      {/* Event Status Badges */}
      {isUnscheduled && (
        <div className="event-badge unscheduled-badge">⏳ Unscheduled</div>
      )}
      
      {isPastEvent && (
        <div className="event-badge past-badge">⏰ Event Ended</div>
      )}
      
      {!isPastEvent && !isUnscheduled && event.tickets_available < 10 && event.tickets_available > 0 && (
        <div className="event-badge warning-badge">Almost Sold Out!</div>
      )}
      
      {!isPastEvent && !isUnscheduled && event.tickets_available === 0 && (
        <div className="event-badge soldout-badge">Sold Out</div>
      )}
      
      {!isPastEvent && !isUnscheduled && event.status === 'today' && (
        <div className="event-badge today-badge">🎉 Happening Today!</div>
      )}
      
      <img 
        src={imageUrl}
        alt={event.title}
        className="event-thumbnail"
        style={isPastEvent ? { filter: 'grayscale(50%)' } : {}}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      <div 
        className="event-thumbnail-placeholder"
        style={{
          display: 'none',
          width: '100%',
          height: '200px',
          background: isPastEvent 
            ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' 
            : isUnscheduled
            ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}
      >
        {event.title.substring(0, 2).toUpperCase()}
      </div>
      
      <div className="event-card-content">
        <h3 className="event-title" style={isPastEvent ? { color: '#6c757d' } : isUnscheduled ? { color: '#ff9800' } : {}}>
          {event.title}
          {isPastEvent && <span style={{ fontSize: '0.8rem', color: '#dc3545', marginLeft: '8px' }}>(Ended)</span>}
          {isUnscheduled && <span style={{ fontSize: '0.8rem', color: '#ff9800', marginLeft: '8px' }}>(Unscheduled)</span>}
        </h3>
        
        <div className="event-info">
          <span>📅</span>
          <span style={isPastEvent ? { color: '#6c757d', textDecoration: 'line-through' } : isUnscheduled ? { color: '#ff9800' } : {}}>
            {formatDate(event.date)}
          </span>
        </div>
        
        <div className="event-info">
          <span>📍</span>
          <span style={isPastEvent ? { color: '#6c757d' } : isUnscheduled ? { color: '#ff9800' } : {}}>{event.location}</span>
        </div>
        
        <div className="event-info event-tickets">
          <span>🎫</span>
          <span style={isPastEvent ? { color: '#6c757d' } : isUnscheduled ? { color: '#ff9800' } : {}}>
            {isPastEvent 
              ? 'Event Ended' 
              : isUnscheduled
              ? 'Not scheduled'
              : event.tickets_available === 0 
                ? 'Sold Out' 
                : `${event.tickets_available} tickets available`
            }
          </span>
        </div>

        {/* Status indicator */}
        <div className="event-status" style={{ 
          marginTop: '10px', 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: isPastEvent ? '#6c757d' : 
                          isUnscheduled ? '#ffc107' :
                          event.status === 'today' ? '#28a745' : '#17a2b8',
          color: 'white'
        }}>
          {isPastEvent ? 'PAST EVENT' : 
           isUnscheduled ? 'UNSCHEDULED' :
           event.status === 'today' ? 'HAPPENING TODAY' : 'UPCOMING'}
        </div>
      </div>
    </div>
  );
};

export default EventCard;