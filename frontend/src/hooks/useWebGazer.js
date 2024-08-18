// hooks/useWebGazer.js

import { useEffect, useRef, useCallback } from 'react';
import { useWebGazerContext } from './WebGazerContext';

const useWebGazer = (onGaze) => {
  const { webgazerReady, webgazerInstance } = useWebGazerContext();
  const gazeTimers = useRef({});

  const initializeWebGazer = useCallback(() => {
    if (webgazerReady && webgazerInstance.current) {
      webgazerInstance.current.setGazeListener((data, elapsedTime) => {
        if (data) {
          onGaze(data.x, data.y); // ส่งข้อมูลการมองไปยังฟังก์ชัน onGaze
        }
      });
    }
  }, [webgazerReady, webgazerInstance, onGaze]);

  useEffect(() => {
    initializeWebGazer();
  }, [initializeWebGazer]);

  return { webgazerReady, webgazerInstance, gazeTimers };
};

export default useWebGazer;

