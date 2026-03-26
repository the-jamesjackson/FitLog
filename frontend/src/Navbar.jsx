import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fitlog-nav">
            <div className="nav-inner">
                <NavLink className="nav-brand" to="/" onClick={() => setOpen(false)}>
                    <span className="brand-dot" />
                    FitLog
                </NavLink>

                <button
                    className="nav-toggle"
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {open ? '✕' : '☰'}
                </button>

                <ul className={`nav-links${open ? ' open' : ''}`}>
                    <li>
                        <NavLink className="nav-link" to="/" end onClick={() => setOpen(false)}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link" to="/log" onClick={() => setOpen(false)}>
                            Workout Log
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link" to="/goals" onClick={() => setOpen(false)}>
                            Fitness Goals
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
