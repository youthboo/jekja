import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import icon from '../assets/hospital.png';

const Sidebar = () => {
  const location = useLocation();
  const categoriesRef = useRef([]);

  const categories = [
    { id: 'หน้าหลัก', label: 'หน้าหลัก' },
    { id: 'พยัญชนะ', label: 'พยัญชนะ' },
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
      {categories.map((category, index) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`category-button ${location.pathname === `/category/${category.id}` ? 'active' : ''}`}
          ref={(el) => {
            if (el) {
              categoriesRef.current[index] = el;
            }
          }}
        >
          <div className="loading-bar"></div> 
          {category.label}
        </Link>
      ))}
    </div>
  );
};


export default Sidebar;
