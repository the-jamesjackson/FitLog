import { useEffect, useState } from "react";

export default function WorkoutForm() {
    const [exercises, setExercises] = useState([]);
    const [formData, setFormData] = useState({
        exercise_id: "",
        date: "",
        duration: "",
        notes: "",
    });

    const [workouts, setWorkouts] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/api/exercises")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch exercises");
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

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:3000/api/workouts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to log workout");
                return res.json();
            })
            .then(() => {
                setMessage("Workout logged successfully!");
                setFormData({
                    exercise_id: "",
                    date: "",
                    duration: "",
                    notes: "",
                });

                return fetch("http://localhost:3000/api/workouts")
                    .then((res) => res.json())
                    .then((data) => setWorkouts(data));
            })
            .catch((err) => {
                console.error("Error submitting workout:", err);
                setMessage("Failed to log workout");
            });
    };

     const handleDelete = (workoutId) => {
            // ASK USER TO CONFIRM BEFORE DELETING
            if (!confirm("Are you sure you want to delete this workout?")) {
                return;
            }

            //SEND DELETE REQUEST TO BACKEND
            fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
                method: "DELETE",
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to delete workout");
                    return res.json();
                })
                .then(() => {
                    // REMOVE THE DELETED WORKOUT FROM STATE (UPDATE UI)
                    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
                    setMessage("Workout deleted successfully!");
                })
                .catch((err) => {
                    console.error("Error deleting workout:", err);
                    setMessage("Failed to delete workout");
                })
    };


    return (
        <div className="container py-3">
            <h2 className="mb-3">Log a Workout</h2>

            {message && <p className="alert alert-info">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exercise_id" className="form-label">
                        Exercise
                    </label>
                    <select
                        id="exercise_id"
                        name="exercise_id"
                        className="form-select"
                        value={formData.exercise_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Choose...</option>
                        {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>
                                {ex.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Date
                    </label>
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

                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">
                        Duration (minutes)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                        Notes (optional)
                    </label>
                    <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        rows="2"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-success">
                    Log Workout
                </button>
            </form>

            <hr className="my-5" />

            <h3>Past Workouts</h3>
            {workouts.length === 0 ? (
                <p>No workouts yet.</p>
            ) : (
                <ul className="list-group">
                    {workouts.map((w) => (
                        <li key={w.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{w.exercise_name} </strong>
                                on {new Date(w.date).toLocaleDateString()} – {w.duration} mins
                                {w.notes && <> ({w.notes})</>}
                            </div>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(w.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
