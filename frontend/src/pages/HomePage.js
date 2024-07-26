// pages/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [message, setMessage] = useState('');
  const suggestions = ['สวัสดี', 'หิวข้าว', 'เข้าห้องน้ำ', 'สบายดีไหม', 'ขอบคุณ', 'ขอโทษ', 'คิดถึง', 'รัก', 'ไปไหน'];

  const handleSend = () => {
    console.log('Sending message:', message);
    setMessage('');
  };

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
    </div>
  );
};

export default HomePage;