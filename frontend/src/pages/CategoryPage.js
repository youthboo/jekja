// pages/CategoryPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  
  const letterMap = {
    'ก-ซ': ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง', 'จ', 'ฉ', 'ช', 'ซ'],
    'ฌ-ถ': ['ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ', 'ด', 'ต', 'ถ'],
    'ท-ม': ['ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
    'ย-ฮ': ['ย', 'ร', 'ล', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ'],
    'สระ': ['ะ', 'า', 'ิ', 'ี', 'ึ', 'ื', 'เ', 'แ', 'โ', 'ุ', 'ั', 'ู', 'ำ'],
    'วรรณยุกต์': ['่', '้', '๊', '๋', '็', '์', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  };

  const letters = letterMap[id] || [];

  const handleSend = () => {
    console.log('Sending message:', message);
    setMessage('');
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
      </div>
    </div>
  );
};

export default CategoryPage;
