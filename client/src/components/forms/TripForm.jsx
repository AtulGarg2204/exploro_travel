import React from 'react';

const TripForm = ({ trip, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = React.useState(trip || {
    name: '',
    description: '',
    dates: '',
    price: '',
    availableSlots: '',
    location: '',
    difficulty: 'Moderate',
    duration: '',
    included: ['Professional guide', 'Accommodation', 'Transportation'],
    cancellationPolicy: {
      fullRefund: 15,
      halfRefund: 7,
      noRefund: 0
    },
    itinerary: [{ day: 1, title: '', description: '' }]
  });

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { 
        day: formData.itinerary.length + 1, 
        title: '', 
        description: '' 
      }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Trip Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dates</label>
            <input
              type="text"
              required
              placeholder="e.g., Jan 15-22, 2025"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.dates}
              onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="text"
              required
              placeholder="e.g., 7 days"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Available Slots</label>
            <input
              type="number"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.availableSlots}
              onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      {/* Itinerary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Itinerary</h3>
          <button
            type="button"
            onClick={addItineraryDay}
            className="text-primary hover:text-primary/80"
          >
            + Add Day
          </button>
        </div>
        {formData.itinerary.map((day, index) => (
          <div key={index} className="space-y-2 border-l-4 border-primary pl-4">
            <h4 className="font-medium">Day {day.day}</h4>
            <input
              type="text"
              placeholder="Day Title"
              required
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={day.title}
              onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
            />
            <textarea
              placeholder="Day Description"
              required
              rows={2}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={day.description}
              onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          {isEditing ? 'Update Trip' : 'Create Trip'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TripForm;