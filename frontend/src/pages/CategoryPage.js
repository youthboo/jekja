// pages/CategoryPage.js
import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';
import deleteIcon from '../assets/delete.png';
import alertIcon from '../assets/bell.png';
import useWebGazer from '../hooks/useWebGazer'; // นำเข้า useWebGazer

const CategoryPage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const letterMap = {
    'ก-ซ': ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง', 'จ', 'ฉ', 'ช', 'ซ'],
    'ฌ-ถ': ['ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ', 'ด', 'ต', 'ถ'],
    'ท-ม': ['ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
    'ย-ฮ': ['ย', 'ร', 'ล', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ'],
    'สระ': ['ะ', 'า', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ั', 'ำ', 'ไ', 'ใ'],
    'วรรณยุกต์': ['่', '้', '๊', '๋', '็', '์'],
  };

  const letters = letterMap[id] || [];

  const handleSend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      console.log('Message saved:', result);

      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleAlertClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleConfirmAlert = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/send-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'แจ้งเตือนฉุกเฉิน' }),
      });

      if (!response.ok) {
        throw new Error('Failed to send alert');
      }

      const result = await response.json();
      console.log('Alert sent:', result);
    } catch (error) {
      console.error('Failed to send alert:', error);
    } finally {
      handlePopupClose();
    }
  };

  const handleGaze = useCallback((data) => {
    if (data == null) return;

    const { x, y } = data;
    const buttons = document.querySelectorAll('.letter-button');
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        button.classList.add('gazing');
        setMessage(prevMessage => prevMessage + button.innerText);
      } else {
        button.classList.remove('gazing');
      }
    });
  }, []);

  useWebGazer(handleGaze); // ใช้ useWebGazer

  return (
    <div className="category-page">
      <h2>{id}</h2>
      <div className="message-input">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="พิมพ์ข้อความ"
        />
        <button onClick={handleSend}>ตกลง</button>
      </div>
      <div className="letter-grid">
        {letters.map((letter, index) => (
          <button 
            key={index} 
            className="letter-button"
          >
            {letter}
          </button>
        ))}
        <button 
          key="delete" 
          className="letter-button"
          onClick={() => setMessage(prevMessage => prevMessage.slice(0, -1))} // ลบตัวอักษรตัวท้าย
        >
          <img src={deleteIcon} alt="delete" className="delete-icon" />
        </button>
      </div>
      <img 
        src={alertIcon} 
        alt="alert" 
        className="alert-icon" 
        onClick={handleAlertClick} 
      />
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>ต้องการเรียกผู้ดูแลหรือไม่?</p>
            <button onClick={handleConfirmAlert}>ใช่</button>
            <button onClick={handlePopupClose}>ไม่ใช่</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
