# Exploro_Travel - Travel Booking Platform

A full-stack web application that revolutionizes travel planning and booking. Exploro serves as a comprehensive platform connecting travelers with expert trip organizers. Whether you're seeking spiritual journeys to religious destinations, adventurous mountain expeditions, serene beach getaways, or cultural explorations, our platform provides a seamless experience for discovering, booking, and managing travel experiences.

The platform offers dual interfaces:
- For travelers: Easy trip discovery, secure booking, and comprehensive trip management
- For organizers: Powerful tools to create, manage, and sell their unique travel experiences

With features like real-time availability tracking, flexible cancellation policies, and secure payment processing, Exploro makes travel planning and management effortless for both travelers and organizers.
## Github Link
https://github.com/AtulGarg2204/exploro_travel

## Prerequisites
* Node.js (v16.0.0 or later)

* npm (v8.0.0 or later)

* A modern web browser

## Setup and Installation

Use the package manager npm to install Travel Website.

## 1. Clone the Repository

bash
git clone https://github.com/AtulGarg2204/exploro_travel.git
cd exploro_travel


## 2. Install Dependencies of backend and run backend
  Now open new terminal and run these command one by one

bash
cd server
npm install
npm run dev


## 3. Install Dependencies of frontend and run frontend
  Now open new terminal and run these command one by one
bash
cd client
npm install
npm start

## Screenshots

### Landing Page
![Landing Page](https://i.postimg.cc/3NR523H9/Screenshot-2024-12-22-234817.png)
*Browse and search available trips*

### User Dashboard
![User Dashboard](https://i.postimg.cc/zXXLdQNg/Screenshot-2024-12-22-234942.png)
*Manage bookings and Cart history*

### Organizer Dashboard
![Organizer Dashboard](https://i.postimg.cc/8zx7wBTQ/Screenshot-2024-12-22-234533.png)
*Create,edit and delete trip listings*

### Checkout Process
![Checkout](https://i.postimg.cc/1zTHZYwW/Screenshot-2024-12-22-235013.png)
*Secure payment processing*

## Features

### For Travelers
- **Trip Browsing & Search**
 - Browse upcoming trips
 - Search functionality
 - View trip details, prices, and availability

- **Booking Management**
 - Shopping cart system
 - Secure checkout process
 - Booking history
 - Real-time status updates

### For Organizers
- **Trip Management**
 - Create and list new trips
 - Edit trip details
 - Manage available slots
 - Set pricing and dates

### Payment & Cancellation
- Secure payment processing
- Flexible cancellation policies:
 - Full refund: 15+ days before trip
 - 50% refund: 7-14 days before trip
 - No refund: Less than 7 days before trip

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Context API for state management
- React Router for navigation

### Backend
- Node.js & Express.js
- MongoDB
- JWT Authentication
- RESTful API

## API Endpoints

### Auth Routes
```javascript
POST /api/auth/register
// Register new user
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user" | "organizer"
}

POST /api/auth/login
// Login user
{
  "email": "string",
  "password": "string"
}
GET /api/trips
// Get all trips

GET /api/trips/:id
// Get single trip details

POST /api/trips 
// Create new trip (Organizer only)
{
  "name": "string",
  "description": "string",
  "location": "string",
  "dates": "string",
  "price": "number",
  "availableSlots": "number"
}

PUT /api/trips/:id
// Update trip (Organizer only)

DELETE /api/trips/:id 
// Delete trip (Organizer only)

POST /api/bookings
// Create new booking
{
  "tripId": "string",
  "quantity": "number",
  "totalPrice": "number",
  "paymentId": "string"
}

GET /api/bookings/my
// Get user's bookings

PUT /api/bookings/:id/cancel
// Cancel booking

POST /api/payments/process
{
  "amount": "number",
  "paymentMethod": "string"
}
Contributors
Atul Garg
License
ISC
