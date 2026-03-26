import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar";
import Home from "./Home";
import WorkoutForm from "./WorkoutForm";
import Goals from "./Goals";
import Footer from "./Footer";
import './Custom.css';

export default function App() {
  return (
    <div className="app-wrapper">
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/"     element={<Home />} />
          <Route path="log"   element={<WorkoutForm />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
}
