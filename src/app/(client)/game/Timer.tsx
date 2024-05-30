import { Progress } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';

const Timer = ({
  timer,
  setTimer,
  totalTimer,
}: {
  timer: number;
  setTimer: (value: number) => void;
  totalTimer: number;
}) => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const remaining = totalTimer - elapsed;
      setTimer(remaining > 0 ? remaining : 0);
    }, 10);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <Progress
      color={'green'}
      value={(timer / totalTimer) * 100}
      variant="soft"
      gap={3}
    ></Progress>
  );
};

export default Timer;
