import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Cart from '../pages/Cart';
const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const data = await bookingService.getMyBookings(token);
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await bookingService.cancelBooking(bookingId, token);
      // Update bookings list after cancellation
      const updatedBookings = bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      setBookings(updatedBookings);
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* User Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Traveler'}!</h1>
        <p className="text-gray-600 mt-2">Manage your trips and bookings</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-3xl font-bold text-primary mt-2">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Upcoming Trips</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            {bookings.filter(b => b.status === 'upcoming').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            ${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
          </p>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['Upcoming', 'Pending', 'Past', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No bookings found</p>
              <button
                onClick={() => navigate('/')}
                className="text-primary hover:text-primary/80"
              >
                Browse Available Trips
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings
                .filter(booking => booking.status === activeTab)
                .map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.trip.name}
                        </h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                          <p>Date: {booking.trip.dates}</p>
                          <p>Participants: {booking.quantity}</p>
                          <p>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p>Total Price: ${booking.totalPrice}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm
                          ${booking.status === 'upcoming' ? 'bg-green-100 text-green-800' : ''}
                          ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${booking.status === 'past' ? 'bg-gray-100 text-gray-800' : ''}
                          ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.status === 'upcoming' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                ))}
            </div>
          )}
          <div className="lg:col-span-1">
          <Cart />
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;