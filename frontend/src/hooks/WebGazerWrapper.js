import React, { useEffect } from 'react';
import { useWebGazerContext } from './WebGazerContext';

const WebGazerWrapper = ({ children }) => {
  const { 
    calibrating, 
    calibrationPoints, 
    startCalibration, 
    stopCalibration, 
    handleCalibrationClick, 
    isGazing,
    gazeTarget
  } = useWebGazerContext();

  useEffect(() => {
    // เพิ่ม smooth pursuit
    if (gazeTarget) {
      gazeTarget.style.transition = 'all 0.3s ease-out';
      gazeTarget.style.transform = 'scale(1.1)';
    }

    return () => {
      if (gazeTarget) {
        gazeTarget.style.transition = '';
        gazeTarget.style.transform = '';
      }
    };
  }, [gazeTarget]);

  return (
    <>
      {children}
      <div className="calibration-container">
        <button onClick={startCalibration}>เริ่มคาลิเบรต</button>
        <button onClick={stopCalibration}>หยุดคาลิเบรต</button>
      </div>
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
      {isGazing && <div className="gaze-feedback">กำลังจ้องมอง...</div>}
    </>
  );
};

export default WebGazerWrapper;