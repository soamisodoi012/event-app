import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/api';
import { authService } from '../../services/auth';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [eventFilter, setEventFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const navigate = useNavigate();

  useEffect(() => {
    checkBackendStatus();
    fetchEvents();
  }, [eventFilter]);

  const checkBackendStatus = async () => {
    try {
      const isHealthy = await authService.checkBackendHealth();
      setBackendStatus(isHealthy ? 'healthy' : 'unhealthy');
    } catch (error) {
      setBackendStatus('unhealthy');
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (eventFilter === 'past') {
        // Use the past events endpoint
        response = await eventService.getAllEvents(1, 'past');
      } else if (eventFilter === 'all') {
        // Show all events including past
        response = await eventService.getAllEvents(1, 'all');
      } else {
        // Default: upcoming events
        response = await eventService.getAllEvents(1, 'upcoming');
      }
      
      const eventsData = response.data.results || response.data;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setBackendStatus('healthy');
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events. Please try again.');
      setBackendStatus('unhealthy');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await eventService.searchEvents(searchQuery, locationQuery, 1, eventFilter);
      const eventsData = response.data.results || response.data;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setLocationQuery('');
    fetchEvents();
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleRetry = () => {
    fetchEvents();
  };

  const handleFilterChange = (filter) => {
    setEventFilter(filter);
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

  // Backend status indicator
  const BackendStatusIndicator = () => {
    if (backendStatus === 'checking') {
      return (
        <div className="warning" style={{ marginBottom: '20px' }}>
          🔍 Checking backend connection...
        </div>
      );
    }
    
    if (backendStatus === 'unhealthy') {
      return (
        <div className="error" style={{ marginBottom: '20px' }}>
          ⚠️ Backend server is not running. Please start the Django server:
          <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
            <code style={{ background: '#f8f9fa', padding: '5px 10px', borderRadius: '4px' }}>
              cd backend && python manage.py runserver
            </code>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Event statistics
  const eventStats = {
    total: events.length,
    upcoming: events.filter(event => event.is_upcoming).length,
    past: events.filter(event => event.is_past).length,
    today: events.filter(event => event.status === 'today').length
  };

  if (loading && backendStatus === 'checking') {
    return (
      <div className="loading">
        <div>🎭 Loading amazing events...</div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          Checking backend connection...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="search-section">
        <h1 className="search-title">Discover Amazing Events 🎉</h1>
        
        <BackendStatusIndicator />
        
        {/* Event Filter Tabs */}
        <div className="event-filter-tabs" style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => handleFilterChange('upcoming')}
            className={`filter-tab ${eventFilter === 'upcoming' ? 'active' : ''}`}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '25px',
              background: eventFilter === 'upcoming' ? '#667eea' : '#f8f9fa',
              color: eventFilter === 'upcoming' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            📅 Upcoming ({eventStats.upcoming})
          </button>
          <button
            onClick={() => handleFilterChange('past')}
            className={`filter-tab ${eventFilter === 'past' ? 'active' : ''}`}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '25px',
              background: eventFilter === 'past' ? '#6c757d' : '#f8f9fa',
              color: eventFilter === 'past' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            ⏰ Past Events ({eventStats.past})
          </button>
          <button
            onClick={() => handleFilterChange('all')}
            className={`filter-tab ${eventFilter === 'all' ? 'active' : ''}`}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '25px',
              background: eventFilter === 'all' ? '#17a2b8' : '#f8f9fa',
              color: eventFilter === 'all' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            🔄 All Events ({eventStats.total})
          </button>
        </div>

        {/* Event Statistics */}
        {events.length > 0 && (
          <div className="event-stats" style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                {eventStats.total}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Total Events</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                {eventStats.upcoming}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Upcoming</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6c757d' }}>
                {eventStats.past}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Past</div>
            </div>
            {eventStats.today > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                  {eventStats.today}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Today</div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSearch} className="search-bar">
          <div className="search-group">
            <label className="search-label">Search Events</label>
            <input
              type="text"
              placeholder="Enter event name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              disabled={backendStatus === 'unhealthy'}
            />
          </div>
          
          <div className="search-group">
            <label className="search-label">Filter by Location</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="search-input"
              disabled={backendStatus === 'unhealthy'}
            />
          </div>
          
          <button 
            type="submit" 
            className="search-button"
            disabled={backendStatus === 'unhealthy' || loading}
          >
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
          
          <button 
            type="button" 
            onClick={handleClearSearch} 
            className="clear-button"
            disabled={backendStatus === 'unhealthy'}
          >
            🗑️ Clear
          </button>
        </form>
      </div>

      {error && (
        <div className="error">
          <div style={{ marginBottom: '10px' }}>{error}</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleRetry} className="search-button">
              🔄 Retry
            </button>
            <button 
              onClick={handleClearSearch} 
              className="clear-button"
            >
              🗑️ Clear Search
            </button>
            {backendStatus === 'unhealthy' && (
              <button 
                onClick={() => window.location.reload()} 
                className="search-button"
                style={{ background: '#f39c12' }}
              >
                🔃 Reload Page
              </button>
            )}
          </div>
        </div>
      )}

      {backendStatus === 'unhealthy' && (
        <div className="empty-state">
          <h3>🚫 Backend Server Unavailable</h3>
          <p>We cannot connect to the event server. This usually means:</p>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '20px auto' }}>
            <li>The Django backend server is not running</li>
            <li>The server is running on a different port</li>
            <li>There's a network connectivity issue</li>
          </ul>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
            <h4>To fix this:</h4>
            <ol style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <li>Open a terminal and navigate to the backend folder</li>
              <li>Run: <code>python manage.py runserver</code></li>
              <li>Wait for the server to start (you should see "Starting development server")</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <button onClick={handleRetry} className="search-button">
            🔄 Check Again
          </button>
        </div>
      )}

      {events.length === 0 && !loading && !error && backendStatus === 'healthy' && (
        <div className="empty-state">
          <h3>
            {eventFilter === 'upcoming' ? 'No upcoming events found' : 
             eventFilter === 'past' ? 'No past events found' : 'No events found'}
          </h3>
          <p>
            {eventFilter === 'upcoming' ? 'Check back later for new events or view past events.' : 
             eventFilter === 'past' ? 'All your past events will appear here.' : 
             'Try adjusting your search criteria.'}
          </p>
          {eventFilter !== 'all' && (
            <button 
              onClick={() => handleFilterChange('all')} 
              className="search-button"
              style={{ marginTop: '10px' }}
            >
              🔄 View All Events
            </button>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className="events-grid">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;