import React, { useState, useCallback, useEffect, useRef } from 'react';
import './HomePage.css';
import alertIcon from '../assets/bell.png'; 
import { useWebGazerContext } from '../hooks/WebGazerContext';

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  const [clickCounts, setClickCounts] = useState(Array(19).fill(0));
  const { webgazerInstance, webgazerReady } = useWebGazerContext();

  const [gazingAt, setGazingAt] = useState(null);
  const gazeTimeout = useRef(null);

  const suggestions = ['สวัสดี', 'หิวข้าว', 'เข้าห้องน้ำ', 'สบายดีไหม', 'ขอบคุณ', 'ขอโทษ', 'คิดถึง', 'รัก', 'ไปไหน'];

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

  const startCalibration = () => {
    if (webgazerInstance.current) {
      webgazerInstance.current.clearData();
      webgazerInstance.current.showFaceOverlay(true);
      webgazerInstance.current.showVideo(true);
      setCalibrating(true);
      setCalibrationPoints(generateCalibrationPoints());
      setClickCounts(Array(19).fill(0));
    }
  };

  const stopCalibration = () => {
    if (webgazerInstance.current) {
      webgazerInstance.current.showFaceOverlay(false);
      webgazerInstance.current.showVideo(false);
    }
    setCalibrating(false);
    setCalibrationPoints([]);
  };

  const generateCalibrationPoints = () => {
    const positions = [
      { x: 10, y: 20 }, { x: 10, y: 35 }, { x: 10, y: 50 }, { x: 10, y: 65 }, { x: 10, y: 80 },
      { x: 10, y: 95 }, { x: 33, y: 45 }, { x: 59, y: 45 },  { x: 85, y: 45 },
      { x: 33, y: 63 }, { x: 59, y: 63 }, { x: 85, y: 63 }, { x: 33, y: 82 },
      { x: 59, y: 82 }, { x: 85, y: 82 }, { x: 92, y: 26 }, { x: 95, y: 7 },
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
    const buttons = document.querySelectorAll('.suggestion-button');
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
          setMessage(gazedButton.textContent);
          gazedButton.click();
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
  
  return (
    <div className="home-page">
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
      {calibrating && (
        <div className="calibration-points">
          {calibrationPoints.map((point, index) => (
            <div
              key={index}
              className="calibration-point"
              style={{ left: point.x, top: point.y, backgroundColor: point.color }}
              onClick={(e) => handleCalibrationClick(index, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;