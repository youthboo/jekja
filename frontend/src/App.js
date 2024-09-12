import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CategoryPage from './pages/CategoryPage';
import { WebGazerProvider } from './hooks/WebGazerContext';
import WebGazerWrapper from './hooks/WebGazerWrapper';
import './App.css';

const App = () => {
  return (
    <WebGazerProvider>
      <WebGazerWrapper>
        <Router>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<CategoryPage id="หน้าหลัก" />} />
                <Route path="/category/:id" element={<CategoryPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </WebGazerWrapper>
    </WebGazerProvider>
  );
};

export default App;