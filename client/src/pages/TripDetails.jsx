// src/pages/TripDetails.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { tripService, bookingService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PaymentForm from '../components/forms/PaymentForm';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [paymentError, setPaymentError] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!id) {
        setError('Invalid trip ID');
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        const data = await tripService.getTripById(id);
        if (!data) {
          setError('Trip not found');
          return;
        }
        setTrip(data);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to fetch trip details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTripDetails();
  }, [id]);

  const handleBook = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: `/trips/${id}` } });
      return;
    }
    setShowBookingModal(true);
  };
  const totalPrice = quantity * (trip?.price || 0);
  const handlePaymentSuccess = async () => {
    try {
      const bookingData = {
        tripId: trip._id,
        quantity,
        totalPrice,
        paymentId: Math.random().toString(36).slice(2, 11) // temporary
      };
      console.log('Booking data:', bookingData);
      await bookingService.createBooking(bookingData, localStorage.getItem('token'));
      setShowPaymentModal(false);
      navigate('/dashboard');
    } catch (err) {
      setPaymentError('Failed to complete booking');
    }
  };
  const handleConfirmBooking = async () => {
    try {
      setBookingInProgress(true);
  
      // Generate a placeholder paymentId (replace with actual payment processing logic)
      const paymentId = Math.random().toString(36).slice(2, 11);
  
      const bookingData = {
        tripId: trip._id,
        quantity,
        totalPrice: quantity * trip.price,
        paymentId: paymentId
      };
  
      await bookingService.createBooking(bookingData, localStorage.getItem('token'));
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setBookingInProgress(false);
      setShowBookingModal(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!trip) return <div className="text-center py-8">Trip not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Trip Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{trip.name}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          <span>📍 {trip.location}</span>
          <span>⏱️ {trip.duration}</span>
          <span>💪 {trip.difficulty}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trip Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">About this trip</h2>
            <p className="text-gray-600">{trip.description}</p>
          </section>

          {/* Itinerary */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>
            <div className="space-y-4">
              {trip.itinerary.map((day) => (
                <div key={day.day} className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-gray-600">{day.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {trip.included.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">${trip.price}</h3>
              <p className="text-gray-600">per person</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Number of Travelers
              </label>
              <select
                className="w-full p-2 border rounded"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[...Array(trip.availableSlots)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Total</span>
                <span className="font-bold">${totalPrice}</span>
              </div>
              <button
                onClick={handleBook}
                disabled={bookingInProgress}
                className={`w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors ${
                  bookingInProgress ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {bookingInProgress ? "Processing..." : "Book Now"}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">Cancellation Policy</h4>
              <ul className="space-y-1">
                <li>
                  • Full refund {trip.cancellationPolicy.fullRefund}+
                  days before
                </li>
                <li>
                  • 50% refund {trip.cancellationPolicy.halfRefund}-
                  {trip.cancellationPolicy.fullRefund} days before
                </li>
                <li>
                  • No refund less than{" "}
                {trip.cancellationPolicy.halfRefund} days before
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
            <div className="space-y-4 mb-6">
              <p><span className="font-medium">Trip:</span> {trip.name}</p>
              <p><span className="font-medium">Dates:</span> {trip.dates}</p>
              <p><span className="font-medium">Travelers:</span> {quantity}</p>
              <p><span className="font-medium">Total:</span> ${quantity * trip.price}</p>
            </div>
            <div className="flex gap-4">
              <button 
                className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90"
                onClick={handleConfirmBooking}
                disabled={bookingInProgress}
              >
                {bookingInProgress ? 'Processing...' : 'Confirm'}
              </button>
              <button 
                className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
                onClick={() => setShowBookingModal(false)}
                disabled={bookingInProgress}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showPaymentModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
      {paymentError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {paymentError}
        </div>
      )}
      <div className="mb-4">
        <p className="text-gray-600">Total Amount: ${totalPrice}</p>
      </div>
      <PaymentForm
        amount={totalPrice}
        onSuccess={handlePaymentSuccess}
        onError={setPaymentError}
      />
      <button
        onClick={() => setShowPaymentModal(false)}
        className="mt-4 w-full border border-gray-300 py-2 rounded hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default TripDetails;
