/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 17:35:55
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/CountdownLite/index.tsx
 * @Description:
 */
import {useState, useEffect, useRef} from 'react';

interface IProps {
  seconds: number;
}

function Timer({seconds}: IProps) {
  const [time, setTime] = useState(seconds);
  const timer = useRef<any>(null);

  useEffect(() => {
    setTime(seconds);
  }, [seconds]);

  useEffect(() => {
    if (time > 0) {
      timer.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [time]);

  const minutes = Math.floor(time / 60);
  const remainingSeconds = time % 60;

  return (
    <span>
      {String(minutes).padStart(2, '0')}
      :
      {String(remainingSeconds).padStart(2, '0')}
    </span>
  );
}

export default Timer;
