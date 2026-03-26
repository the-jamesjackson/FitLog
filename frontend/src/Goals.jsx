import { useState, useEffect } from "react";

const CATEGORIES = [
    'Calisthenics','Climbing','CrossFit','Cycling','Elliptical',
    'HIIT','Hiking','Meditation','Pilates','Running',
    'Skiing','Snowboarding','Sports','Stair Climbing','Stretching',
    'Surfing','Swimming','Walking','Weightlifting','Yoga',
];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export default function Goals() {
    const [goalText, setGoalText]   = useState("");
    const [category, setCategory]   = useState("");
    const [deadline, setDeadline]   = useState("");
    const [goals, setGoals]         = useState([]);
    const [message, setMessage]     = useState({ text: "", type: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/goals")
            .then((res) => res.json())
            .then((data) => setGoals(data))
            .catch((err) => console.error("Failed to fetch goals:", err));
    }, []);

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const method = editingId ? "PUT" : "POST";
        const url = editingId 
            ? `http://localhost:3000/api/goals/${editingId}`
            : "http://localhost:3000/api/goals";
        
        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: goalText, category, deadline }),
        })
            .then((res) => { if (!res.ok) throw new Error(); 
                return res.json(); 
            })
            .then(() => {
                showMessage(editingId ? "Goal updated!" : "Goal added!", "success");
                setEditingId(null);
                setGoalText("");
                setCategory("");
                setDeadline("");
                return fetch("http://localhost:3000/api/goals")
                    .then((res) => res.json())
                    .then((data) => setGoals(data));
            })
            .catch(() => showMessage("Failed to save goal.", "error"));
    };

    const toggleComplete = (id) => {
        fetch(`http://localhost:3000/api/goals/${id}/toggle`, { method: "PUT" })
            .then((res) => res.json())
            .then((updated) => {
                setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
            })
            .catch((err) => console.error("Failed to update goal:", err));
    };

    const handleDelete = (goalId) => {
        if (!confirm("Delete this goal?")) return;
        fetch(`http://localhost:3000/api/goals/${goalId}`, { method: "DELETE" })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then(() => {
                setGoals((prev) => prev.filter((g) => g.id !== goalId));
                showMessage("Goal deleted.", "success");
            })
            .catch(() => showMessage("Failed to delete goal.", "error"));
    };

    const handleEdit = (goal) => {
        setEditingId(goal.id);
        setGoalText(goal.text);
        setCategory(goal.category || "");
        setDeadline(goal.deadline ? goal.deadline.slice(0, 10) : "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const active    = goals.filter((g) => !g.completed);
    const completed = goals.filter((g) => g.completed);

    return (
        <div className="main-content">
            <div className="page-hero">
                <div className="container">
                    <span className="page-eyebrow">Define your path</span>
                    <h1>Fitness Goals</h1>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {message.text && (
                    <div className={`fitlog-alert ${message.type}`}>
                        {message.type === 'success' ? '✓' : '✕'} {message.text}
                    </div>
                )}

                <form className="fitlog-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label className="form-label">Goal</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Run a 5K under 25 minutes"
                            value={goalText}
                            onChange={(e) => setGoalText(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Category (optional)</label>
                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Any category…</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Deadline (optional)</label>
                            <input
                                type="date"
                                className="form-control"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingId ? "Update Goal" : "+ Add Goal"}
                        </button>
                    </div>
                </form>

                <hr className="section-divider" />

                {/* Active goals */}
                <div className="list-section-header" style={{ marginBottom: '1.25rem' }}>
                    <h2>Active</h2>
                    {active.length > 0 && <span className="count-badge">{active.length}</span>}
                </div>

                {active.length === 0 ? (
                    <div className="empty-state" style={{ marginBottom: '2.5rem' }}>
                        <span className="empty-icon">🎯</span>
                        <p>No active goals — add one above.</p>
                    </div>
                ) : (
                    <div className="items-list" style={{ marginBottom: '3rem' }}>
                        {active.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onToggle={toggleComplete}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}

                {/* Completed goals */}
                {completed.length > 0 && (
                    <>
                        <div className="list-section-header">
                            <h3>Completed</h3>
                            <span className="count-badge">{completed.length}</span>
                        </div>
                        <div className="items-list">
                            {completed.map((goal) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    onToggle={toggleComplete}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function GoalCard({ goal, onToggle, onDelete, onEdit }) {
    return (
        <div className={`goal-card${goal.completed ? ' done' : ''}`}>
            <div className="goal-body">
                <div className="goal-text">{goal.text}</div>
                <div className="goal-chips">
                    {goal.category && (
                        <span className="goal-chip">{goal.category}</span>
                    )}
                    {goal.deadline && (
                        <span className="goal-chip deadline">
                            ⏱ {formatDate(goal.deadline)}
                        </span>
                    )}
                </div>
            </div>
            <div className="goal-actions">
                <button
                    className={`btn-icon-sm check${goal.completed ? ' done' : ''}`}
                    onClick={() => onToggle(goal.id)}
                    title={goal.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                    ✓
                </button>
                <button
                    className="btn-icon-sm"
                    onClick={() => onEdit(goal)}
                    title="Edit goal"
                >
                    ✎
                </button>
                <button
                    className="btn-icon-sm"
                    onClick={() => onDelete(goal.id)}
                    title="Delete goal"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
