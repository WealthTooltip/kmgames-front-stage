import {useState, useEffect, useRef} from 'react';

interface IProps {
  seconds: number;
}

function Timer({seconds}: IProps) {
  const [time, setTime] = useState(seconds);
  const timer = useRef<any>(null);

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
