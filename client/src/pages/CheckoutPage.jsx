// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { bookingService, paymentService } from '../services/api';
import PaymentForm from '../components/forms/PaymentForm'

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      // Process payment first
      const payment = await paymentService.processPayment({
        amount: getTotalPrice(),
        paymentMethod: 'card',
        ...paymentData
      }, token);
  
      console.log('Payment response:', payment); // Debug log
  
      // Check for payment ID
      if (!payment || !payment._id) {
        throw new Error('Invalid payment ID');
      }
  
      // Create bookings one by one
      for (const item of cartItems) {
        const bookingData = {
          tripId: item._id,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          paymentId: payment._id // Use _id instead of id
        };
        
        console.log('Creating booking with data:', bookingData); // Debug log
        
        await bookingService.createBooking(bookingData, token);
      }
  
      clearCart();
      navigate('/dashboard');
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to complete checkout: ' + (err.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">${item.price * item.quantity}</p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${getTotalPrice()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-1">
          <PaymentForm 
            onSuccess={handlePaymentSuccess} 
            amount={getTotalPrice()} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;