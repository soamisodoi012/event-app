# EventFinder - Event Booking App

A full-stack event booking application built with Django REST Framework backend and React frontend that allows users to browse events, view details, and book tickets.

##  Features

### Core Requirements Met
- **Event List Page** - Browse all upcoming events with thumbnails, titles, dates, and locations
- **Event Detail Page** - View complete event information including descriptions and full-size images
- **Ticket Booking System** - Book tickets with real-time availability updates
- **My Bookings Page** - Personal booking history with event titles and dates

###  Bonus Features Implemented
-  **Search & Filter** - Search events by name and filter by location
-  **Persistent Storage** - Bookings persist across app restarts using localStorage
-  **Error Handling** - Comprehensive error handling for API calls and user interactions
-  **Clean Architecture** - Well-structured, maintainable code with separation of concerns
-  **Event Status Management** - Automatic detection and handling of past events
-  **User Authentication** - JWT-based registration and login system
-  **Responsive Design** - Mobile-friendly interface that works on all devices

##  Tech Stack

### Backend
- **Python 3.11+** with Django 4.2 and Django REST Framework
- **PostgreSQL** - Robust relational database
- **JWT Authentication** - Secure token-based authentication
- **Pillow** - Image processing and handling
- **django-cors-headers** - CORS management for frontend communication

### Frontend
- **React 18** - Modern React with functional components and hooks
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Context API** - State management for authentication
- **CSS3** - Custom responsive styling with modern features

## Setup Instructions

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher

### Step 1: Backend Setup

```bash
# Clone the repository
git clone https://github.com/soamisodoi012/event-app.git
cd event-app/backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
# Database Configuration
CREATE DATABASE event_db;
# Configure Environment Variables
Create a .env file in the backend directory:
# Backend Initialization
bash
# Run database migrations
python manage.py makemigrations
python manage.py migrate
# Create superuser (follow prompts)
python manage.py createsuperuser
python manage.py runserver
# Frontend Setup
Open a new terminal and navigate to the frontend directory:
cd ../frontend
# Install Node.js dependencies
npm install
# Start the React development server
npm start
# Access the Application
Frontend Application: http://localhost:3000
Backend API: http://localhost:8000/api
Django Admin: http://localhost:8000/admin
 Explanation of Design Decisions
##  Backend Architecture Decisions

1. Django REST Framework Selection
Decision: Chose Django REST Framework over other Python web frameworks
Reasoning:

Built-in authentication system with JWT support

Automatic API documentation with browsable API

Serializer classes for robust data validation and transformation

Excellent Django ORM integration for database operations

Mature ecosystem with extensive community support

2. Database Design
Decision: PostgreSQL with normalized schema design
Reasoning:

Relational integrity - Foreign key constraints prevent orphaned records

Atomic transactions - Ensures ticket booking operations are all-or-nothing

Scalability - PostgreSQL handles concurrent bookings efficiently

Data consistency - Unique constraints prevent duplicate bookings

3. JWT Authentication Implementation
Decision: JSON Web Tokens for user authentication
Reasoning:

Stateless - No server-side session storage required

Scalable - Works seamlessly with multiple frontend clients

Secure - Token-based authentication with expiration

Modern standard - Industry best practice for REST APIs
# Frontend Architecture Decisions
1. React Functional Components
Decision: Used functional components with hooks instead of class components
Reasoning:

Modern React standards - Industry best practice

Cleaner code structure - Less boilerplate, more readable

Better performance - Optimized re-renders with hooks

Easier testing - Simpler component testing approach

2. State Management Approach
Decision: Context API + useState/useEffect instead of Redux
Reasoning:

Reduced complexity - Appropriate for medium-sized application

No external dependencies - Built-in React capabilities

Sufficient for needs - Handles authentication and user state effectively

Performance optimized - Proper context splitting prevents unnecessary re-renders
