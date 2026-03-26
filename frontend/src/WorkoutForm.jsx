import { useEffect, useState } from "react";

const EXERCISE_ICONS = {
    Calisthenics:  '💪',
    Climbing:      '🧗',
    CrossFit:      '🏋️',
    Cycling:       '🚴',
    HIIT:          '⚡',
    Hiking:        '🥾',
    Pilates:       '🧘',
    Running:       '🏃',
    Sports:        '⚽',
    Swimming:      '🏊',
    Walking:       '🚶',
    Weightlifting: '🏋️',
    Yoga:          '🌿',
};

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export default function WorkoutForm() {
    const [exercises, setExercises] = useState([]);
    const [formData, setFormData] = useState({ 
        exercise_id: "",
        date: "", 
        duration: "", 
        notes: "" 
    });

    const [workouts, setWorkouts] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetch("http://localhost:3000/api/exercises")
            .then((res) => { 
                if (!res.ok) throw new Error(); 
                return res.json(); 
            })
            .then((data) => setExercises(data))
            .catch((err) => console.error("Error fetching exercises:", err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/api/workouts")
            .then((res) => res.json())
            .then((data) => setWorkouts(data))
            .catch((err) => console.error("Failed to fetch workouts:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:3000/api/workouts", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(formData),
        })
            .then((res) => { 
                if (!res.ok) throw new Error(); 
                return res.json(); 
            })
            .then(() => {
                showMessage("Workout logged!", "success");
                setFormData({ 
                    exercise_id: "",
                    date: "", 
                    duration: "", 
                    notes: "" 
                });

                return fetch("http://localhost:3000/api/workouts")
                    .then((res) => res.json())
                    .then((data) => setWorkouts(data));
            })
            .catch(() => showMessage("Failed to log workout.", "error"));
    };

    const handleDelete = (workoutId) => {
        if (!confirm("Delete this workout?")) return;

        // SEND DELETE REQUEST TO BACKEND
        fetch(`http://localhost:3000/api/workouts/${workoutId}`, { 
            method: "DELETE" 
        })
            .then((res) => { 
                if (!res.ok) throw new Error();
                return res.json(); 
            })
            .then(() => {
                // REMOVE THE DELETED WORKOUT FROM STATE (UPDATE UI)
                setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
                showMessage("Workout deleted.", "success");
            })
            .catch(() => showMessage("Failed to delete workout.", "error"));
    };

    return (
        <div className="main-content">
            <div className="page-hero">
                <div className="container">
                    <span className="page-eyebrow">Track your training</span>
                    <h1>Workout Log</h1>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {message.text && (
                    <div className={`fitlog-alert ${message.type}`}>
                        {message.type === 'success' ? '✓' : '✕'} {message.text}
                    </div>
                )}

                <form className="fitlog-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="exercise_id" className="form-label">Exercise</label>
                            <select
                                id="exercise_id"
                                name="exercise_id"
                                className="form-select"
                                value={formData.exercise_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select type…</option>
                                {exercises.map((ex) => (
                                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="duration"
                                name="duration"
                                placeholder="e.g. 45"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="notes" className="form-label">Notes (optional)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="notes"
                                name="notes"
                                placeholder="How'd it go?"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            + Log Workout
                        </button>
                    </div>
                </form>

                <hr className="section-divider" />

                <div className="list-section-header">
                    <h2>Past Workouts</h2>
                    {workouts.length > 0 && (
                        <span className="count-badge">{workouts.length}</span>
                    )}
                </div>

                {workouts.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🏃</span>
                        <p>No workouts logged yet — get moving!</p>
                    </div>
                ) : (
                    <div className="items-list">
                        {workouts.map((w) => {
                            const icon = EXERCISE_ICONS[w.exercise_name] || '🏅';
                            return (
                                <div key={w.id} className="workout-card">
                                    <div className="workout-icon">{icon}</div>
                                    <div className="workout-body">
                                        <div className="workout-name">{w.exercise_name}</div>
                                        <div className="workout-meta">
                                            <span>{formatDate(w.date)}</span>
                                        </div>
                                        {w.notes && (
                                            <div className="workout-notes">{w.notes}</div>
                                        )}
                                    </div>
                                    <div className="workout-duration">
                                        {w.duration}
                                        <small>min</small>
                                    </div>
                                    <button
                                        className="btn-icon-sm"
                                        onClick={() => handleDelete(w.id)}
                                        title="Delete workout"
                                    >
                                        x
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
