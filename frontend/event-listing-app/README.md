# EventFinder - Event Booking App

A full-stack event booking application built with Django REST Framework backend and React frontend that allows users to browse events, view details, and book tickets.

## 🚀 Features

### ✅ Core Requirements Met
- **Event List Page** - Browse all upcoming events with thumbnails, titles, dates, and locations
- **Event Detail Page** - View complete event information including descriptions and full-size images
- **Ticket Booking System** - Book tickets with real-time availability updates
- **My Bookings Page** - Personal booking history with event titles and dates

### ✅ Bonus Features Implemented
- 🔍 **Search & Filter** - Search events by name and filter by location
- 💾 **Persistent Storage** - Bookings persist across app restarts using localStorage
- 🛡️ **Error Handling** - Comprehensive error handling for API calls and user interactions
- 🎨 **Clean Architecture** - Well-structured, maintainable code with separation of concerns
- ⏰ **Event Status Management** - Automatic detection and handling of past events
- 🔐 **User Authentication** - JWT-based registration and login system
- 📱 **Responsive Design** - Mobile-friendly interface that works on all devices

## 🛠️ Tech Stack

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

## 📦 Setup Instructions

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher

### Step 1: Backend Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd event-app/backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt