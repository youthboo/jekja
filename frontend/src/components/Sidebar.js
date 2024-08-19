// components/Sidebar.js   **ยัง click ไม่ได้ !!!
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWebGazerContext } from '../hooks/WebGazerContext'; 
import './Sidebar.css';
import icon from '../assets/hospital.png';

const Sidebar = () => {
  const location = useLocation();
  const { webgazerInstance } = useWebGazerContext();
  const categoriesRef = useRef([]);

  useEffect(() => {
    const instance = webgazerInstance.current;
    const currentRefs = categoriesRef.current; 

    if (instance) {
      currentRefs.forEach((ref) => {
        if (ref) {
          instance.addMouseEventListeners(ref);
        }
      });
    }

    return () => {
      if (instance) {
        currentRefs.forEach((ref) => {
          if (ref) {
            instance.removeMouseEventListeners(ref);
          }
        });
      }
    };
  }, [webgazerInstance]);

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
      {categories.map((category, index) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`category-button ${location.pathname === `/category/${category.id}` ? 'active' : ''}`}
          ref={(el) => (categoriesRef.current[index] = el)}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
