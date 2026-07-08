import { useRef } from 'react';

interface VerificationCodeInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  variant?: 'default' | 'success';
}

export default function VerificationCodeInput({
  value,
  onChange,
  variant = 'default',
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^[0-9]?$/.test(digit)) return;
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isSuccess = variant === 'success';

  return (
    <div className="flex gap-2">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={isSuccess}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-12 h-12 text-center text-lg rounded-lg border ${
            isSuccess
              ? 'border-[#22C55E] text-[#22C55E] bg-white'
              : 'border-[#E9EBEE] text-[#28323C] focus:border-[#000000]'
          }`}
        />
      ))}
    </div>
  );
}
