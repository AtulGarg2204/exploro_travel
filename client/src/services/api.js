// src/services/api.js
const BASE_URL= process.env.REACT_APP_BACKEND_URI;

export const authService = {
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  register: async (userData) => {
    console.log("INSIDE AUTH SERVICE REGISTER");
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  }
};

export const tripService = {
  getTrips: async () => {
    const res = await fetch(`${BASE_URL}/trips`);
    return res.json();
  },

  getTripById: async (id) => {
    const res = await fetch(`${BASE_URL}/trips/${id}`);
    return res.json();
  },
  updateTrip: async (id, tripData, token) => {
    const res = await fetch(`${BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(tripData)
    });
    return res.json();
  },
  deleteTrip: async (id, token) => {
    try {
      const res = await fetch(`${BASE_URL}/trips/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to delete trip');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  createTrip: async (tripData, token) => {
    const res = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(tripData)
    });
    return res.json();
  }
};

// src/services/api.js
export const bookingService = {
  createBooking: async (bookingData, token) => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  getMyBookings: async (token) => {
    const res = await fetch(`${BASE_URL}/bookings/my`, {
      headers: {
        'x-auth-token': token
      }
    });
    return res.json();
  },

  cancelBooking: async (bookingId, token) => {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'x-auth-token': token
      }
    });
    return res.json();
  }
};
// src/services/api.js
export const paymentService = {
  processPayment: async (paymentData, token) => {
    try {
      const res = await fetch(`${BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg || 'Payment processing failed');
      }
      
      return res.json();
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }
};