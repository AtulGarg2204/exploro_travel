// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import TripCard from '../components/TripCard';
import { tripService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LandingPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const data = await tripService.getTrips();
        setTrips(data);
      } catch (err) {
        setError('Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary/10 py-16 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find and book amazing trips with expert guides
          </p>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for trips..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Trips</h2>
        {trips.length === 0 ? (
          <p className="text-center text-gray-600">No trips available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips
              .filter(trip => 
                trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.location.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(trip => (
                <TripCard key={trip._id} trip={trip} />
              ))}
          </div>
        )}
      </div>

      {/* Company Info Section */}
      <div className="bg-gray-50 mt-16 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Why Choose Exploro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Expert Guides</h3>
              <p className="text-gray-600">Professional guides with years of experience</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Flexible Booking</h3>
              <p className="text-gray-600">Easy cancellation and rebooking options</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices and group discounts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;