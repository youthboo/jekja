// pages/HomePage.js
import React, { useState, useCallback } from 'react';
import './HomePage.css';
import alertIcon from '../assets/bell.png'; 
import useWebGazer from '../hooks/useWebGazer'; // นำเข้าคอมโพเนนต์ useWebGazer

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const suggestions = ['สวัสดี', 'หิวข้าว', 'เข้าห้องน้ำ', 'สบายดีไหม', 'ขอบคุณ', 'ขอโทษ', 'คิดถึง', 'รัก', 'ไปไหน'];

  const handleSend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Message sent:', result);
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
    // สมมติว่าคุณต้องการให้การ gaze บนปุ่มเพื่อส่งข้อความ
    const buttons = document.querySelectorAll('.suggestion-button');
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        button.classList.add('gazing');
        setMessage(button.innerText);
      } else {
        button.classList.remove('gazing');
      }
    });
  }, []);

  const { webgazerReady } = useWebGazer(handleGaze);

  if (!webgazerReady) {
    return <div>กำลังโหลด WebGazer...</div>;
  }

  return (
    <div className="home-page">
      <div className="message-input">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="พิมพ์ข้อความ"
        />
        <button onClick={handleSend}>ตกลง</button>
      </div>
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index} 
            onClick={() => setMessage(suggestion)}
            className="suggestion-button"
          >
            {suggestion}
          </button>
        ))}
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

export default HomePage;
