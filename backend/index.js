import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000;

// Create PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Middleware: Enable CORS to allow frontend (localhost:5173) to communicate with backend (localhost:3000)
app.use(cors());

// Middleware: Parse incoming JSON request bodies
// This allows us to access req.body in our route handlers
app.use(express.json());

// GET /api/exercises - Retrieve all exercise types
app.get('/api/exercises', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM exercise_types");
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// GET /api/workouts - Retrieve all workouts with exercise names
// Joins workouts table with exercise_types to get readable exercise names
app.get("/api/workouts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT workouts.id, workouts.exercise_id, workouts.date, workouts.duration, workouts.notes,
             exercise_types.name AS exercise_name
      FROM workouts
      JOIN exercise_types ON workouts.exercise_id = exercise_types.id
      ORDER BY date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// POST /api/workouts - Create a new workout
// Frontend sends exercise_id, date, duration, and optional notes
app.post("/api/workouts", async (req, res) => {
  const { exercise_id, date, duration, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO workouts (exercise_id, date, duration, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [exercise_id, date, duration, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting workout:", err);
    res.status(500).json({ error: "Failed to log workout" });
  }
});

// PUT /api/workouts/:id - Update a specific workout
app.put("/api/workouts/:id", async (req, res) => {
  const { id } = req.params;
  const { exercise_id, date, duration, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE workouts
      SET exercise_id = $1, date = $2, duration = $3, notes = $4 WHERE id = $5 RETURNING *`,
      [exercise_id, date, duration, notes, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating workout:", err);
    res.status(500).json({ error: "Failed to update workout" });
  }
});

// DELETE /api/workouts/:id - Delete a specific workout
// :id is a URL parameter (e.g., /api/workouts/5 means id = 5)
app.delete("/api/workouts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM workouts WHERE id = $1", [id]);
    res.json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error("Error deleting workout:", err);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

// GET /api/goals - Retrieve all fitness goals
// Ordered by newest first (id DESC)
app.get("/api/goals", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM goals ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// POST /api/goals - Create a new fitness goal
// Frontend sends goal text, category, and optional deadline
app.post("/api/goals", async (req, res) => {
  const { text, category, deadline } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO goals (text, category, deadline)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [text, category, deadline || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding goal:", err);
    res.status(500).json({ error: "Failed to add goal" });
  }
});

// PUT /api/goals/:id - Update a specific goal
app.put("/api/goals/:id", async (req, res) => {
  const { id } = req.params;
  const { text, category, deadline } = req.body;

  try {
    const result = await pool.query(
      `UPDATE goals
      SET text = $1, category = $2, deadline = $3 WHERE id = $4 RETURNING *`,
      [text, category, deadline, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// PUT /api/goals/:id/toggle - Toggle goal completion status
// Changes completed from true to false or false to true
app.put("/api/goals/:id/toggle", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE goals
       SET completed = NOT completed
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// DELETE /api/goals/:id - Delete a specific goal
app.delete("/api/goals/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM goals WHERE id = $1", [id]);
    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
