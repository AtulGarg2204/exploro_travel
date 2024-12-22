import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const handleViewDetails = () => {
    console.log('Trip:', trip); // Debug log
    if (trip && trip._id) {
      navigate(`/trips/${trip._id}`);
    } else {
      console.error('No trip ID found:', trip);
    }
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', trip); // Debug log
    addToCart(trip, 1);
    alert('Added to cart!');
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{trip.name}</h3>
        <p className="text-gray-600 mb-4">{trip.description}</p>
        <div className="space-y-2">
          <p className="text-gray-700"><span className="font-medium">Dates:</span> {trip.dates}</p>
          <p className="text-gray-700"><span className="font-medium">Price:</span> ${trip.price}</p>
          <p className="text-gray-700"><span className="font-medium">Available Slots:</span> {trip.availableSlots}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
      <button 
        onClick={handleViewDetails}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        View Details
      </button>
      <button
        onClick={handleAddToCart}
        className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary/10"
      >
        Add to Cart
      </button>
    </div>
      </div>
    </div>
  );
};

export default TripCard;