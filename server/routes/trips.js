// server/routes/trips.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Trip = require('../models/Trip');

// @route   GET api/trips
// @desc    Get all trips
// @access  Public
// In your routes/trips.js
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST api/trips
// @desc    Create a trip
// @access  Private/Organizer
router.post('/', [auth, roleCheck('organizer')], async (req, res) => {
  try {
    const newTrip = new Trip({
      ...req.body,
      organizer: req.user.id
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trips/:id
// @desc    Get trip by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/trips/:id
// @desc    Update trip
// @access  Private/Organizer
router.put('/:id', [auth, roleCheck('organizer')], async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Make sure organizer owns trip
    if (trip.organizer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/trips/:id
// @desc    Delete trip
// @access  Private/Organizer
// server/routes/trips.js
router.delete('/:id', [auth, roleCheck('organizer')], async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Make sure organizer owns trip
    if (trip.organizer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Use findByIdAndDelete instead of remove()
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;