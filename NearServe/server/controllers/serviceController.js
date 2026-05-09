const db = require('../config/db');

const getAllServices = async (req, res) => {
  const { category, location, search } = req.query;
  let query = `
    SELECT s.*, u.name AS provider_name, u.phone AS provider_phone,
           c.name AS category_name, c.icon AS category_icon,
           IFNULL(AVG(r.rating), 0) AS avg_rating,
           COUNT(r.id) AS review_count
    FROM services s
    JOIN users u ON s.provider_id = u.id
    JOIN categories c ON s.category_id = c.id
    LEFT JOIN reviews r ON s.id = r.service_id
    WHERE s.is_available = TRUE
  `;
  const params = [];

  if (category) { query += ' AND s.category_id = ?'; params.push(category); }
  if (location) { query += ' AND s.location LIKE ?'; params.push(`%${location}%`); }
  if (search)   { query += ' AND (s.title LIKE ? OR s.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  query += ' GROUP BY s.id ORDER BY s.created_at DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.name AS provider_name, u.phone AS provider_phone, u.location AS provider_location,
             c.name AS category_name, c.icon AS category_icon,
             IFNULL(AVG(r.rating), 0) AS avg_rating, COUNT(r.id) AS review_count
      FROM services s
      JOIN users u ON s.provider_id = u.id
      JOIN categories c ON s.category_id = c.id
      LEFT JOIN reviews r ON s.id = r.service_id
      WHERE s.id = ?
      GROUP BY s.id
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Service not found' });

    const [reviews] = await db.query(`
      SELECT r.*, u.name AS reviewer_name FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.service_id = ? ORDER BY r.created_at DESC
    `, [req.params.id]);

    res.json({ ...rows[0], reviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createService = async (req, res) => {
  const { category_id, title, description, price, location } = req.body;
  if (!category_id || !title || !price)
    return res.status(400).json({ message: 'category_id, title and price are required' });

  try {
    const [result] = await db.query(
      'INSERT INTO services (provider_id, category_id, title, description, price, location) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, category_id, title, description || '', price, location || '']
    );
    res.status(201).json({ message: 'Service created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateService = async (req, res) => {
  const { title, description, price, location, is_available } = req.body;
  try {
    await db.query(
      'UPDATE services SET title=?, description=?, price=?, location=?, is_available=? WHERE id=? AND provider_id=?',
      [title, description, price, location, is_available, req.params.id, req.user.id]
    );
    res.json({ message: 'Service updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id=? AND provider_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProviderServices = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT s.*, c.name AS category_name FROM services s JOIN categories c ON s.category_id=c.id WHERE s.provider_id=? ORDER BY s.created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService, getProviderServices };
