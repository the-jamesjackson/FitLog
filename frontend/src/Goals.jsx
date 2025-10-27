import { useState, useEffect } from "react";

export default function Goals() {
    const [goalText, setGoalText] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/goals")
            .then((res) => res.json())
            .then((data) => setGoals(data))
            .catch((err) => console.error("Failed to fetch goals:", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newGoal = {
            text: goalText,
            category,
            deadline,
        };

        fetch("http://localhost:3000/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGoal),
        })
            .then((res) => res.json())
            .then((savedGoal) => {
                setGoals((prev) => [savedGoal, ...prev]);
                setGoalText("");
                setCategory("");
                setDeadline("");
            })
            .catch((err) => console.error("Failed to add goal:", err));
    };

    const toggleComplete = (id) => {
        fetch(`http://localhost:3000/api/goals/${id}/toggle`, {
            method: "PUT",
        })
            .then((res) => res.json())
            .then((updatedGoal) => {
                setGoals((prev) =>
                    prev.map((goal) =>
                        goal.id === updatedGoal.id ? updatedGoal : goal
                    )
                );
            })
            .catch((err) => console.error("Failed to update goal:", err));
    };

    const handleDelete = (goalId) => {
        if (!confirm("Are you sure you want to delete this goal?")) {
            return;
        }

        fetch(`http://localhost:3000/api/goals/${goalId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete goal");
                return res.json();
            })
            .then(() => {
                setGoals((prev) => prev.filter((g) => g.id !== goalId));
            })
            .catch((err) => console.error("Error deleting goal:", err));
    }

    return (
        <div className="container py-3">
            <h2 className="mb-3">Fitness Goals</h2>

            <form onSubmit={handleSubmit} className="mb-5">
                <div className="mb-3">
                    <label className="form-label">Goal</label>
                    <input
                        type="text"
                        className="form-control"
                        value={goalText}
                        onChange={(e) => setGoalText(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Choose...</option>
                        <option value="Calisthenics">Calisthenics</option>
                        <option value="Climbing">Climbing</option>
                        <option value="CrossFit">CrossFit</option>
                        <option value="Cycling">Cycling</option>
                        <option value="HIIT">HIIT</option>
                        <option value="Hiking">Hiking</option>
                        <option value="Pilates">Pilates</option>
                        <option value="Running">Running</option>
                        <option value="Sports">Sports</option>
                        <option value="Swimming">Swimming</option>
                        <option value="Walking">Walking</option>
                        <option value="Weightlifting">Weightlifting</option>
                        <option value="Yoga">Yoga</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Deadline (optional)</label>
                    <input
                        type="date"
                        className="form-control"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-success">Add Goal</button>
            </form>

            <h3 className="mb-3">Your Goals</h3>
            {goals.length === 0 ? (
                <p>No goals yet.</p>
            ) : (
                <ul className="list-group">
                    {goals.map((goal) => (
                        <li
                            key={goal.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${goal.completed ? "list-group-item-success" : ""}`}
                        >
                            <div>
                                <strong>{goal.text}</strong>
                                {goal.category && ` (${goal.category})`}
                                {goal.deadline && (
                                    <small className="text-muted ms-2">
                                        | Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                    </small>
                                )}
                            </div>
                            <div>
                                <button
                                    className={`btn btn-sm me-2 ${goal.completed ? "btn-outline-secondary" : "btn-outline-success"}`}
                                    onClick={() => toggleComplete(goal.id)}
                                >
                                    {goal.completed ? "Mark Incomplete" : "Mark Complete"}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(goal.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
