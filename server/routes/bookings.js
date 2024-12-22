// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');

// Get user's bookings
// server/routes/bookings.js
router.get('/my', auth, async (req, res) => {
  try {
    // Add user role check if needed
    const bookings = await Booking.find({ user: req.user.id })
      .populate('trip')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Create booking
// server/routes/bookings.js
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received booking data:', req.body); // Debug log
    const { tripId, quantity, totalPrice, paymentId } = req.body;

    // Basic validation
    if (!tripId || !quantity || !totalPrice || !paymentId) {
      return res.status(400).json({ 
        msg: 'Missing required fields',
        received: { tripId, quantity, totalPrice, paymentId }
      });
    }

    // Verify trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Create and save booking
    const booking = new Booking({
      user: req.user.id,
      trip: tripId,
      quantity: Number(quantity),
      totalPrice: Number(totalPrice),
      paymentId,
      status: 'upcoming' // Changed from 'confirmed' to match your frontend
    });

    await booking.save();

    // Update trip slots
    trip.availableSlots -= quantity;
    await trip.save();

    // Send back populated booking
    const populatedBooking = await Booking.findById(booking._id).populate('trip');
    res.json(populatedBooking);

  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ msg: err.message });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Verify user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check cancellation policy
    const trip = await Trip.findById(booking.trip);
    const bookingDate = new Date(booking.bookingDate);
    const tripDate = new Date(trip.dates);
    const daysDifference = Math.ceil((tripDate - new Date()) / (1000 * 60 * 60 * 24));

    let refundAmount = 0;
    if (daysDifference >= trip.cancellationPolicy.fullRefund) {
      refundAmount = booking.totalPrice;
    } else if (daysDifference >= trip.cancellationPolicy.halfRefund) {
      refundAmount = booking.totalPrice * 0.5;
    }

    booking.status = 'cancelled';
    booking.refundAmount = refundAmount;
    await booking.save();

    // Return slots to trip
    trip.availableSlots += booking.quantity;
    await trip.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;