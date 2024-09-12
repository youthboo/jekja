import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const WebGazerContext = createContext();

export const WebGazerProvider = ({ children }) => {
  const [webgazerReady, setWebgazerReady] = useState(false);
  const webgazerInstance = useRef(null);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  // eslint-disable-next-line 
  const [clickCounts, setClickCounts] = useState(Array(15).fill(0));
  const [lastGazeTime, setLastGazeTime] = useState(0);
  const [isGazing, setIsGazing] = useState(false);
  const [gazeTarget, setGazeTarget] = useState(null);
  
  const initializeWebGazer = useCallback(async () => {
    try {
      await window.webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener((data, clock) => {
          if (data == null || calibrating) return;
          handleGaze(data, clock);
        })
        .begin();

      webgazerInstance.current = window.webgazer;
      setWebgazerReady(true);

    } catch (error) {
      console.error('Failed to initialize webgazer:', error);
    }
    // eslint-disable-next-line 
  }, [calibrating]);

  const startCalibration = useCallback(() => {
    if (webgazerInstance.current) {
      webgazerInstance.current.clearData();
      webgazerInstance.current.showFaceOverlay(true);
      setCalibrating(true);
      setCalibrationPoints(generateCalibrationPoints());
      setClickCounts(Array(15).fill(0));
    }
  }, []);

  const stopCalibration = useCallback(() => {
    if (webgazerInstance.current) {
      webgazerInstance.current.showFaceOverlay(false);
    }
    setCalibrating(false);
    setCalibrationPoints([]);
  }, []);

  const generateCalibrationPoints = () => {
    const positions = [
      { x: 12, y: 25 }, { x: 12, y: 48 }, { x: 12, y: 69 }, { x: 12, y: 92 },
      { x: 35, y: 45 }, { x: 61, y: 45 }, { x: 87, y: 45 },
      { x: 35, y: 67 }, { x: 61, y: 67 }, { x: 87, y: 67 },
      { x: 35, y: 86 }, { x: 61, y: 86 }, { x: 87, y: 86 },
      { x: 89, y: 28 }, { x: 95, y: 7 }
    ];
    return positions.map(pos => ({ x: `${pos.x}%`, y: `${pos.y}%`, color: 'red' }));
  };

  const handleCalibrationClick = useCallback((index, e) => {
    if (webgazerInstance.current) {
      const { clientX, clientY } = e;
      webgazerInstance.current.recordScreenPosition(clientX, clientY, 'click');
      setClickCounts(prevClickCounts => {
        const newClickCounts = [...prevClickCounts];
        newClickCounts[index] += 1;
        if (newClickCounts[index] >= 3) {
          setCalibrationPoints(prevPoints => {
            const newCalibrationPoints = [...prevPoints];
            newCalibrationPoints[index].color = 'yellow';
            return newCalibrationPoints;
          });
        }
        return newClickCounts;
      });
    }
  }, []);

  const handleGaze = useCallback((data, clock) => {
    if (data == null || calibrating) return;

    const { x, y } = data;
    const currentTime = clock;
    const timeSinceLastGaze = currentTime - lastGazeTime;

    const element = document.elementFromPoint(x, y);
    const interactiveElement = element?.closest('button, a, [role="button"]');

    if (interactiveElement) {
      if (gazeTarget !== interactiveElement) {
        setGazeTarget(interactiveElement);
        setLastGazeTime(currentTime);
      } else if (timeSinceLastGaze >= 1000) {
        setIsGazing(true);
        interactiveElement.click();
        setGazeTarget(null);
        setLastGazeTime(currentTime);
      }
    } else {
      setGazeTarget(null);
      setIsGazing(false);
    }
  }, [calibrating, lastGazeTime, gazeTarget]);

  useEffect(() => {
    initializeWebGazer();
    return () => {
      if (webgazerInstance.current?.end) {
        webgazerInstance.current.end();
      }
    };
  }, [initializeWebGazer]);

  useEffect(() => {
    if (webgazerReady && webgazerInstance.current) {
      const currentWebgazer = webgazerInstance.current;
      currentWebgazer.setGazeListener(handleGaze);
      return () => currentWebgazer.clearGazeListener();
    }
  }, [handleGaze, webgazerReady]);

  return (
    <WebGazerContext.Provider value={{ 
      webgazerReady, 
      webgazerInstance, 
      calibrating, 
      calibrationPoints, 
      startCalibration, 
      stopCalibration, 
      handleCalibrationClick, 
      isGazing,
      gazeTarget 
    }}>
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