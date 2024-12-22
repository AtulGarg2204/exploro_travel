// server/routes/payments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');

router.post('/process', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    // Create a new payment record
    const payment = new Payment({
      user: req.user.id,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId: 'pay_' + Date.now() // In real app, this would come from payment gateway
    });
    const savedPayment= await payment.save();
    console.log('Payment saved:', savedPayment); // Debug log
    
    res.json(savedPayment);
  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).json({ msg: 'Payment processing failed' });
  }
});


// Get payment details
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    // Verify user owns the payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;