import { HashRouter, NavLink, Routes, Route, Link, useParams } from 'react-router-dom';
import Navbar from "./Navbar";
import Home from "./Home";
import WorkoutForm from "./WorkoutForm";
import Goals from "./Goals";
import Footer from "./Footer";
import './Custom.css';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HashRouter>
        <Navbar />
        <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="log" element={<WorkoutForm />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
        </div>
        <Footer />
      </HashRouter>
    </div>
  );
}
