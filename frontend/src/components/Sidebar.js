// components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import icon from '../assets/hospital.png';

const Sidebar = () => {
  const location = useLocation();
  const categories = [
    { id: 'ก-ซ', label: 'ก-ซ' },
    { id: 'ฌ-ถ', label: 'ฌ-ถ' },
    { id: 'ท-ม', label: 'ท-ม' },
    { id: 'ย-ฮ', label: 'ย-ฮ' },
    { id: 'สระ', label: 'สระ' },
    { id: 'วรรณยุกต์', label: 'วรรณยุกต์' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/" className="logo-link">
          <div>
            <img src={icon} alt="Icon" style={{ width: '70px', height: '70px', marginRight: '20px' }} />
          </div>
          <div className="logo-text">GazeTalk</div>
        </Link>
      </div>
      {categories.map((category) => (
        <Link 
          key={category.id} 
          to={`/category/${category.id}`}
          className={`category-button ${location.pathname === `/category/${category.id}` ? 'active' : ''}`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
