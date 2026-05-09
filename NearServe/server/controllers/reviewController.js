const db = require('../config/db');

const addReview = async (req, res) => {
  const { service_id, rating, comment } = req.body;
  if (!service_id || !rating)
    return res.status(400).json({ message: 'service_id and rating are required' });

  try {
    await db.query(
      'INSERT INTO reviews (user_id, service_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, service_id, rating, comment || '']
    );
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addReview };
