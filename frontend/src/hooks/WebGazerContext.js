// hooks/WebGazerContext.js

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const WebGazerContext = createContext();

export const WebGazerProvider = ({ children }) => {
  const [webgazerReady, setWebgazerReady] = useState(false);
  const webgazerInstance = useRef(null);

  const initializeWebGazer = useCallback(async () => {
    try {
      await window.webgazer.setRegression('ridge').setTracker('clmtrackr').begin();
      webgazerInstance.current = window.webgazer;
      setWebgazerReady(true);

      // ตั้งค่าให้ซ่อน UI ของ WebGazer
      window.webgazer.showVideo(true);
      window.webgazer.showFaceOverlay(true);
      window.webgazer.showFaceFeedbackBox(true);
    } catch (error) {
      console.error('Failed to initialize webgazer:', error);
    }
  }, []);

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

  return (
    <WebGazerContext.Provider value={{ webgazerReady, webgazerInstance }}>
      {children}
    </WebGazerContext.Provider>
  );
};

export const useWebGazerContext = () => {
  const context = useContext(WebGazerContext);
  if (!context) {
    throw new Error('useWebGazerContext must be used within a WebGazerProvider');
  }
  return context;
};
