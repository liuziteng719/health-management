import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HealthData from './pages/HealthData';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkoutPlan from './pages/WorkoutPlan';
import DietPlan from './pages/DietPlan';
import MentalHealth from './pages/MentalHealth';

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health-data" element={<HealthData />} />
        <Route path="/community" element={<Community />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workout" element={<WorkoutPlan />} />
        <Route path="/diet" element={<DietPlan />} />
        <Route path="/mental-health" element={<MentalHealth />} />
      </Routes>
    </Router>
  );
};

export default App; 