//A105 인증번호 입력창 및 3분 타이머

import { useEffect, useState } from 'react';

interface AuthTimerProps {
  duration?: number; // 초 단위, 기본 180초(3분)
  onExpire?: () => void;
}

export default function AuthTimer({
  duration = 180,
  onExpire,
}: AuthTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="text-sm text-[#ADB0B5] font-medium tabular-nums">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}
