// hooks/useWebGazer.js
import { useState, useEffect, useRef, useCallback } from 'react';

const useWebGazer = (onGaze) => {
  const [webgazerReady, setWebgazerReady] = useState(false);
  const webgazerInstance = useRef(null);
  const gazeTimers = useRef({});

  const initializeWebGazer = useCallback(async () => {
    try {
      await window.webgazer.setRegression('ridge').setTracker('clmtrackr')
        .setGazeListener(onGaze).begin();
      webgazerInstance.current = window.webgazer;
      setWebgazerReady(true);
      
      // ตั้งค่าไม่ให้แสดงวิดีโอ, Face Overlay, และ Face Feedback Box
      window.webgazer.showVideo(false);
      window.webgazer.showFaceOverlay(false);
      window.webgazer.showFaceFeedbackBox(false);
    } catch (error) {
      console.error('Failed to initialize webgazer:', error);
    }
  }, [onGaze]);

  useEffect(() => {
    initializeWebGazer();

    return () => {
      if (webgazerInstance.current && typeof webgazerInstance.current.end === 'function') {
        try {
          webgazerInstance.current.end();
        } catch (error) {
          console.error('Error while ending webgazer:', error);
        }
      }
    };
  }, [initializeWebGazer]);

  return { webgazerReady, webgazerInstance, gazeTimers };
};

export default useWebGazer;
