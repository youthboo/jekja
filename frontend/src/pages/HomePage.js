// pages/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [message, setMessage] = useState('');
  const suggestions = ['สวัสดี', 'หิวข้าว', 'เข้าห้องน้ำ', 'สบายดีไหม', 'ขอบคุณ', 'ขอโทษ', 'คิดถึง', 'รัก', 'ไปไหน'];

  const handleSend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }), // เปลี่ยนเป็น 'message'
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
