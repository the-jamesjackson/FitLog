import { Link } from 'react-router-dom';

const ACTIVITIES = [
    { label: 'Calisthenics',   icon: '💪' },
    { label: 'Climbing',       icon: '🧗' },
    { label: 'CrossFit',       icon: '🏋️' },
    { label: 'Cycling',        icon: '🚴' },
    { label: 'Elliptical',     icon: '🔄' },
    { label: 'HIIT',           icon: '⚡' },
    { label: 'Hiking',         icon: '🥾' },
    { label: 'Meditation',     icon: '🧠' },
    { label: 'Pilates',        icon: '🧘' },
    { label: 'Running',        icon: '🏃' },
    { label: 'Skiing',         icon: '⛷️' },
    { label: 'Snowboarding',   icon: '🏂' },
    { label: 'Sports',         icon: '⚽' },
    { label: 'Stair Climbing', icon: '🪜' },
    { label: 'Stretching',     icon: '🤸' },
    { label: 'Surfing',        icon: '🏄' },
    { label: 'Swimming',       icon: '🏊' },
    { label: 'Walking',        icon: '🚶' },
    { label: 'Weightlifting',  icon: '🏋️' },
    { label: 'Yoga',           icon: '🌿' },
];

export default function Home() {
    return (
        <div className="main-content">
            <section className="home-hero">
                <div className="container">
                    <p className="hero-eyebrow">Your fitness tracker</p>

                    <h1 className="hero-title">
                        Train
                        <span className="word-accent">Smarter.</span>
                    </h1>

                    <p className="hero-subtitle">
                        Log every rep, every mile, every session. Set goals and
                        watch your progress compound over time.
                    </p>

                    <div className="hero-cta-group">
                        <Link to="/log" className="btn-primary">
                            Log a Workout
                        </Link>
                        <Link to="/goals" className="btn-ghost">
                            Set a Goal
                        </Link>
                    </div>
                </div>
            </section>

            <div className="container">
                <hr className="hero-rule" />

                <div className="feature-grid">
                    <div className="feature-card">
                        <span className="feature-icon">📋</span>
                        <h3>Workout Log</h3>
                        <p>
                            Record every session with exercise type, duration, date,
                            and personal notes. Your full history, always accessible.
                        </p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🎯</span>
                        <h3>Goal Tracking</h3>
                        <p>
                            Define what you're working toward. Set deadlines, assign
                            categories, and mark goals complete as you crush them.
                        </p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">⚡</span>
                        <h3>{ACTIVITIES.length} Activities</h3>
                        <p>
                            From yoga to weightlifting to climbing — every discipline
                            is supported so nothing goes untracked.
                        </p>
                    </div>
                </div>

                <div className="activities-section">
                    <span className="section-label">Supported Activities</span>
                    <div className="activities-grid">
                        {ACTIVITIES.map((a) => (
                            <span key={a.label} className="activity-pill">
                                {a.icon} {a.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
