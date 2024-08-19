import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useWebGazerContext } from '../hooks/WebGazerContext';
import './CategoryPage.css';
import deleteIcon from '../assets/delete.png';
import alertIcon from '../assets/bell.png';

const CategoryPage = () => {
  const { id } = useParams();
  
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  const [clickCounts, setClickCounts] = useState(Array(19).fill(0));

  const { webgazerInstance, webgazerReady } = useWebGazerContext();
  
  // ใช้ useRef เพื่อเก็บข้อมูลของปุ่มที่กำลังถูกมอง
  const [gazingAt, setGazingAt] = useState(null);
  const gazeTimeout = useRef(null);

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

  const startCalibration = () => {
    if (webgazerInstance.current) {
      webgazerInstance.current.clearData();
      webgazerInstance.current.showFaceOverlay(true);
      setCalibrating(true);
      setCalibrationPoints(generateCalibrationPoints());
      setClickCounts(Array(19).fill(0));
    }
  };

  const stopCalibration = () => {
    if (webgazerInstance.current) {
      webgazerInstance.current.showFaceOverlay(false);
    }
    setCalibrating(false);
    setCalibrationPoints([]);
  };

  const generateCalibrationPoints = () => {
    const positions = [
      { x: 10, y: 21 }, { x: 10, y: 36 }, { x: 10, y: 51 }, { x: 10, y: 66 }, { x: 10, y: 81 },
      { x: 10, y: 96 }, { x: 28, y: 51 }, { x: 48, y: 51 }, { x: 68, y: 51 }, { x: 88, y: 51 },
      { x: 28, y: 68 }, { x: 48, y: 68 }, { x: 68, y: 68 }, { x: 88, y: 68 }, { x: 28, y: 85 },
      { x: 48, y: 85 }, { x: 68, y: 85 }, { x: 88, y: 85}, { x: 92, y: 32 }, { x: 95, y: 7 },
    ];
    return positions.map(pos => ({ x: `${pos.x}%`, y: `${pos.y}%`, color: 'red' }));
  };

  const handleCalibrationClick = (index, e) => {
    if (webgazerInstance.current) {
      const { clientX, clientY } = e;
      webgazerInstance.current.recordScreenPosition(clientX, clientY, 'click');
      const newClickCounts = [...clickCounts];
      newClickCounts[index] += 1;
      setClickCounts(newClickCounts);

      if (newClickCounts[index] >= 3) {
        const newCalibrationPoints = [...calibrationPoints];
        newCalibrationPoints[index].color = 'yellow';
        setCalibrationPoints(newCalibrationPoints);
      }
    }
  };

  const handleGaze = useCallback((data) => {
    if (data == null || calibrating) return;
  
    const { x, y } = data;
    const buttons = document.querySelectorAll('.letter-button');
    let gazedButton = null;
  
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      const isWithinButton = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  
      if (isWithinButton) {
        button.classList.add('gazing');
        if (!gazedButton) gazedButton = button;
      } else {
        button.classList.remove('gazing');
      }
    });
  
    if (gazedButton) {
      if (gazingAt !== gazedButton) {
        setGazingAt(gazedButton);
        if (gazeTimeout.current) {
          clearTimeout(gazeTimeout.current);
        }
        gazeTimeout.current = setTimeout(() => {
          console.log('Gaze click on:', gazedButton.textContent);
          if (gazedButton.classList.contains('delete-button')) {
            setMessage(prevMessage => prevMessage.slice(0, -1));
          } else {
            handleLetterClick(gazedButton.textContent);  // Updated here
          }
          setGazingAt(null);
        }, 1000);
      }
    } else {
      setGazingAt(null);
      if (gazeTimeout.current) {
        clearTimeout(gazeTimeout.current);
        gazeTimeout.current = null;
      }
    }
  }, [calibrating, gazingAt]);
  
  useEffect(() => {
    if (webgazerReady && webgazerInstance.current) {
      // Create a local variable to store the current webgazerInstance
      const currentWebgazer = webgazerInstance.current;
  
      const gazeListener = (data, elapsedTime) => {
        if (data == null) return;
        handleGaze(data);
      };
  
      currentWebgazer.setGazeListener(gazeListener);
  
      // Cleanup function uses the local variable
      return () => {
        if (webgazerReady && currentWebgazer) {
          currentWebgazer.clearGazeListener();
        }
      };
    }
  }, [handleGaze, webgazerReady, webgazerInstance]);

  const handleLetterClick = (letter) => {
    setMessage(prevMessage => prevMessage + letter);
  };

  return (
    <div className="category-page">
      <h2>{id}</h2>
      <div className="calibration-container">
        <button onClick={startCalibration}>เริ่มคาลิเบรต</button>
        <button onClick={stopCalibration}>หยุดคาลิเบรต</button>
      </div>
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
        <button 
          key="delete" 
          className="letter-button delete-button"
          onClick={() => setMessage(prevMessage => prevMessage.slice(0, -1))}
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
      {calibrating && (
        <div className="calibration-points">
          {calibrationPoints.map((point, index) => (
            <div 
              key={index} 
              className="calibration-point"
              style={{ 
                top: point.y, 
                left: point.x, 
                backgroundColor: point.color
              }}
              onClick={(e) => handleCalibrationClick(index, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
