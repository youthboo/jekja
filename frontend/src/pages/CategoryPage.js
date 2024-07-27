import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';
import deleteIcon from '../assets/delete.png';
import alertIcon from '../assets/bell.png'; 

const CategoryPage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  
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
            onClick={() => setMessage(prevMessage => prevMessage + letter)}
          >
            {letter}
          </button>
        ))}
        {/* เพิ่มไอคอน delete.png ต่อท้าย */}
        <button 
          key="delete" 
          className="letter-button"
          onClick={() => setMessage(prevMessage => prevMessage.slice(0, -1))} // ลบตัวอักษรตัวท้าย
        >
          <img src={deleteIcon} alt="delete" className="delete-icon" />
        </button>
      </div>
      {/* เพิ่มไอคอน alert ที่ด้านบนขวาของจอ */}
      <img src={alertIcon} alt="alert" className="alert-icon" />
    </div>
  );
};

export default CategoryPage;
