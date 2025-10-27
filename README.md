# EventFinder - Event Booking App

A full-stack event booking application built with Django REST Framework backend and React frontend that allows users to browse events, view details, and book tickets.

## Features

### Core Requirements Met
- **Event List Page**: Browse all upcoming events with thumbnails, titles, dates, and locations.
- **Event Detail Page**: View complete event information including descriptions and full-size images.
- **Ticket Booking System**: Book tickets with real-time availability updates.
- **My Bookings Page**: Personal booking history with event titles and dates.

### Bonus Features Implemented
- **Search & Filter**: Search events by name and filter by location.
- **Persistent Storage**: Bookings persist across app restarts using localStorage.
- **Error Handling**: Comprehensive error handling for API calls and user interactions.
- **Clean Architecture**: Well-structured, maintainable code with separation of concerns.
- **Event Status Management**: Automatic detection and handling of past events.
- **User Authentication**: JWT-based registration and login system.
- **Responsive Design**: Mobile-friendly interface that works on all devices.

## Tech Stack

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

### Backend Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/soamisodoi012/event-app.git
    cd event-app/backend
    cd event_manager
    ```

2. **Create and activate virtual environment**:
    ```bash
    python -m venv venv
    ```
    - On Windows:
        ```bash
        venv\Scripts\activate
        cd ..
        ```
    - On Mac/Linux:
        ```bash
        source venv/bin/activate
        ```

3. **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Database Configuration**:
    ```sql
    CREATE DATABASE event_db;
    ```

5. **Configure Environment Variables**:
    Create a `.env` file in the backend directory.
   DB_NAME
   DB_USER
   DB_PASSWORD
   DB_HOST
   DB_PORT
   SECRET_KEY
   DEBUG=True

7. **Backend Initialization**:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser  # Follow prompts
    python manage.py runserver
    ```

### Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
    ```bash
    cd ../../frontend
    cd event-listing-app
    ```

2. **Install Node.js dependencies**:
    ```bash
    npm install
    ```

3. **Start the React development server**:
    ```bash
    npm start
    ```

### Access the Application
- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend **: [http://localhost:8000/api](http://localhost:8000/)
- **Django Admin**: [http://localhost:8000/admin](http://localhost:8000/admin)

## Explanation of Design Decisions

### Backend Architecture Decisions

- **Django REST Framework Selection**:
    - **Reasoning**:
        - Built-in authentication system with JWT support.
        - Automatic API documentation with browsable API.
        - Serializer classes for robust data validation and transformation.
        - Excellent Django ORM integration for database operations.
        - Mature ecosystem with extensive community support.

- **Database Design**:
    - **Reasoning**:
        - Relational integrity with foreign key constraints.
        - Atomic transactions ensure all-or-nothing operations.
        - Scalability for concurrent bookings.
        - Unique constraints to prevent duplicate bookings.

- **JWT Authentication Implementation**:
    - **Reasoning**:
        - Stateless, scalable, and secure.
        - Industry best practice for REST APIs.

### Frontend Architecture Decisions

- **React Functional Components**:
    - **Reasoning**:
        - Modern standards, cleaner code structure, improved performance, and easier testing.

- **State Management Approach**:
    - **Reasoning**:
        - Reduced complexity, no external dependencies, and sufficient for application needs.
