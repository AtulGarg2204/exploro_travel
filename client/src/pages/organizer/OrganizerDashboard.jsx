// src/pages/organizer/OrganizerDashboard.jsx
import React, { useState, useContext, useEffect,useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { tripService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import TripForm from '../../components/forms/TripForm';

const OrganizerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  
  const fetchOrganizerTrips = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tripService.getTrips();
      const organizerTrips = data.filter(trip => trip.organizer === user?.id);
      setTrips(organizerTrips);
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, [user?.id]); 

  useEffect(() => {
    fetchOrganizerTrips();
  }, [fetchOrganizerTrips]);

  const handleEdit = (trip) => {
    console.log('Editing trip:', trip); // Debug log
    setEditingTrip(trip);
    setShowModal(true);
  };
  
  const handleSubmit = async (tripData) => {
    try {
      if (editingTrip) {
        console.log('Updating trip:', editingTrip._id, tripData); // Debug log
        const updatedTrip = await tripService.updateTrip(
          editingTrip._id, 
          tripData, 
          localStorage.getItem('token')
        );
        setTrips(trips.map(trip => 
          trip._id === editingTrip._id ? updatedTrip : trip
        ));
      } else {
        console.log('Creating new trip:', tripData); // Debug log
        const newTrip = await tripService.createTrip(
          tripData, 
          localStorage.getItem('token')
        );
        setTrips(prevTrips => [...prevTrips, newTrip]);
      }
      setShowModal(false);
      setEditingTrip(null); // Make sure editingTrip is cleared
      setError(null); // Clear any existing errors
    } catch (err) {
      console.error('Submit error:', err); // Debug log
      setError(editingTrip ? 'Failed to update trip' : 'Failed to create trip');
    }
  };
  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripService.deleteTrip(tripId, localStorage.getItem('token'));
        setTrips(prevTrips => prevTrips.filter(trip => trip._id !== tripId));
        setError(null); // Clear any existing errors
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete trip');
      }
    }
  };

  // const handleSubmit = async (tripData) => {
  //   try {
  //     if (editingTrip) {
  //       const updatedTrip = await tripService.updateTrip(
  //         editingTrip._id, 
  //         tripData, 
  //         localStorage.getItem('token')
  //       );
  //       setTrips(trips.map(trip => 
  //         trip._id === editingTrip._id ? updatedTrip : trip
  //       ));
  //     } else {
  //       const newTrip = await tripService.createTrip(
  //         tripData, 
  //         localStorage.getItem('token')
  //       );
  //       setTrips([...trips, newTrip]);
  //     }
  //     setShowModal(false);
  //     setEditingTrip(null);
  //   } catch (err) {
  //     setError(editingTrip ? 'Failed to update trip' : 'Failed to create trip');
  //   }
  // };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your trips</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Add New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No trips created yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-primary hover:text-primary/80 mt-2"
          >
            Create your first trip
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trip Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Available Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.map((trip) => (
                <tr key={trip._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {trip.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{trip.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${trip.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {trip.availableSlots}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(trip)}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingTrip ? 'Edit Trip' : 'Add New Trip'}
            </h2>
            <TripForm
              trip={editingTrip}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowModal(false);
                setEditingTrip(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;