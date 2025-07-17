const pool = require('../models/db');

// Create Event
exports.createEvent = async (req, res) => {
  const { title, datetime, location, capacity } = req.body;

  if (!title || !datetime || !location || !capacity || capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ error: "Invalid event data or capacity limit exceeded" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO events (title, datetime, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, datetime, location, capacity]
    );
    res.status(201).json({ eventId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "Database error while creating event" });
  }
};

// Get Event Details
exports.getEventDetails = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    const users = await pool.query(
      'SELECT users.id, users.name, users.email FROM registrations JOIN users ON users.id = registrations.user_id WHERE event_id = $1',
      [eventId]
    );

    if (event.rowCount === 0) return res.status(404).json({ error: "Event not found" });

    res.json({ ...event.rows[0], registrations: users.rows });
  } catch (err) {
    res.status(500).json({ error: "Database error while fetching event details" });
  }
};

// Register for Event
exports.registerUser = async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  try {
    const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (event.rowCount === 0) return res.status(404).json({ error: "Event not found" });

    const isPast = new Date(event.rows[0].datetime) < new Date();
    if (isPast) return res.status(400).json({ error: "Cannot register for past events" });

    const alreadyRegistered = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    if (alreadyRegistered.rowCount > 0)
      return res.status(400).json({ error: "User already registered" });

    const currentCount = await pool.query(
      'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
      [eventId]
    );
    if (+currentCount.rows[0].count >= event.rows[0].capacity)
      return res.status(400).json({ error: "Event is full" });

    await pool.query('INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)', [userId, eventId]);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Cancel Registration
exports.cancelRegistration = async (req, res) => {
  const { id: eventId, userId } = req.params;

  try {
    const check = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    if (check.rowCount === 0)
      return res.status(404).json({ error: "User is not registered for this event" });

    await pool.query(
      'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Cancellation failed" });
  }
};

// List Upcoming Events (sorted)
exports.listUpcomingEvents = async (req, res) => {
  try {
    const events = await pool.query(
      `SELECT * FROM events WHERE datetime > NOW()
       ORDER BY datetime ASC, location ASC`
    );
    res.json(events.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching upcoming events" });
  }
};

// Event Stats
exports.getEventStats = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await pool.query('SELECT capacity FROM events WHERE id = $1', [eventId]);
    if (event.rowCount === 0) return res.status(404).json({ error: "Event not found" });

    const capacity = event.rows[0].capacity;
    const regCount = await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [eventId]);

    const used = +regCount.rows[0].count;
    const remaining = capacity - used;
    const percentage = ((used / capacity) * 100).toFixed(2);

    res.json({
      total_registrations: used,
      remaining_capacity: remaining,
      percentage_filled: `${percentage}%`,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching stats" });
  }
};
