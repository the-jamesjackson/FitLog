import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

app.get('/api/exercises', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM exercise_types");
    res.json(result.rows); 
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

app.use(express.json()); 

app.get("/api/workouts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT workouts.id, workouts.date, workouts.duration, workouts.notes,
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

app.get("/api/goals", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM goals ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

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

// DELETE A WORKOUT
app.delete("/api/workouts/:id", async (req, res) =>  {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM workouts WHERE id = $1", [id]);
    res.json({message: "Workout deleted successfully"});
  } catch (err) {
    console.error("Error deleting workout:", err);
    res.status(500).json({error: "Failed to delete workout"});
  }
});

// DELETE A GOAL
app.delete("/api/goals/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM goals WHERE id = $1", [id]);
    res.json({message: "Goal deleted successfully"});
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({error: "Failed to delete goal"});
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});