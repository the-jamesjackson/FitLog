import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-custom mb-4" style={{ backgroundColor: '#7393B3' }}>
            <div className="container">
                <NavLink className="navbar-brand text-white" to="/">FitLog</NavLink>
                {/* HAMBURGER 🍔‼️ BUTTON */}
                <button className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* COLLAPSES ON SMALL SCREENS */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/log">Workout Log</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/goals">Fitness Goals</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

