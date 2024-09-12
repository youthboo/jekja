import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';
import deleteIcon from '../assets/delete.png';
import alertIcon from '../assets/bell.png';

const CategoryPage = () => {
  const { id: paramId } = useParams();
  const id = paramId || 'หน้าหลัก'; 

  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [letters, setLetters] = useState([]);
  const [defaultLetters] = useState([
    'ก-จ', 'ฉ-ฐ', 'ฒ-ธ', 'น-ภ', 'ม-ส', 'ห-ฮ'
  ]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    const letterMap = {
      'หน้าหลัก': ['สวัสดี', 'หิวข้าว', 'เข้าห้องน้ำ', 'สบายดีไหม', 'ขอบคุณ', 'ขอโทษ', 'คิดถึง', 'รัก', 'ไปไหน'],
      'พยัญชนะ': defaultLetters,
      'สระ': ['สระ1', 'สระ2'],
      'วรรณยุกต์': ['่', '้', '๊', '๋', '็', '์'],
    };
  
    if (id === 'พยัญชนะ') {
      setSelectedSubcategory(null);
    }
  
    setLetters(letterMap[id] || defaultLetters);
  }, [id, defaultLetters]);
  

  const handleLetterClick = (letter) => {
    console.log('Before click:', { letters, selectedSubcategory });
  
    const subLettersMap = {
      'ก-จ': ['ก', 'ข', 'ฃ', 'ฅ', 'ค', 'ฆ', 'ง', 'จ'],
      'ฉ-ฐ': ['ฉ', 'ช', 'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ'],
      'ฒ-ธ': ['ฑ', 'ฒ', 'ณ', 'ด', 'ต', 'ถ', 'ท', 'ธ'],
      'น-ภ': ['น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ'],
      'ม-ส': ['ม', 'ย', 'ร', 'ล', 'ว', 'ศ', 'ษ', 'ส'],
      'ห-ฮ': ['ห', 'ฬ', 'อ', 'ฮ'],
    };
  
    if (letter === 'พยัญชนะ') {
      console.log('Resetting to default letters');
      setLetters(defaultLetters);
      setSelectedSubcategory(null);
    } else if (subLettersMap[letter]) {
      console.log('Setting subletters for', letter);
      setLetters(subLettersMap[letter]);
      setSelectedSubcategory(letter);
    } else if (letter === 'สระ1') {
      setLetters(['ะ', 'า', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู']);
    } else if (letter === 'สระ2') {
      setLetters(['เ', 'แ', 'โ', 'ั', 'ำ', 'ไ', 'ใ']);
    } else {
      setMessage(prevMessage => prevMessage + letter);
    }
  
    console.log('After click:', { letters, selectedSubcategory });
  };  

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
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
          {!(id === 'หน้าหลัก' || (id === 'สระ' && (letters.includes('สระ1') || letters.includes('สระ2'))) || (id === 'พยัญชนะ' && letters === defaultLetters)) && (
            <button 
              key="delete" 
              className="letter-button delete-button"
              onClick={() => setMessage(prevMessage => prevMessage.slice(0, -1))}
            >
              <img src={deleteIcon} alt="delete" className="delete-icon" />
            </button>
          )}
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