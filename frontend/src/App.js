import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import { WebGazerProvider } from './hooks/WebGazerContext'; // ใช้ WebGazerProvider
import './App.css';

const App = () => {
  return (
    <WebGazerProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WebGazerProvider>
  );
};

export default App;
