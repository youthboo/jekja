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

      window.webgazer.showVideo(false);
      window.webgazer.showFaceOverlay(false);
      window.webgazer.showFaceFeedbackBox(false);
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
