const db = require('../config/db');

const createBooking = async (req, res) => {
  const { service_id, scheduled_date, note } = req.body;
  if (!service_id) return res.status(400).json({ message: 'service_id is required' });

  try {
    const [result] = await db.query(
      'INSERT INTO bookings (user_id, service_id, scheduled_date, note) VALUES (?, ?, ?, ?)',
      [req.user.id, service_id, scheduled_date || null, note || null]
    );
    res.status(201).json({ message: 'Booking created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, s.title AS service_title, s.price, u.name AS provider_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON s.provider_id = u.id
      WHERE b.user_id = ?
      ORDER BY b.booked_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, s.title AS service_title, u.name AS customer_name, u.phone AS customer_phone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
      WHERE s.provider_id = ?
      ORDER BY b.booked_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  try {
    await db.query(`
      UPDATE bookings b
      JOIN services s ON b.service_id = s.id
      SET b.status = ?
      WHERE b.id = ? AND s.provider_id = ?
    `, [status, req.params.id, req.user.id]);
    res.json({ message: 'Booking status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createBooking, getUserBookings, getProviderBookings, updateBookingStatus };
