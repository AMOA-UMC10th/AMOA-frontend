import {
  useState,
  useRef,
  type ChangeEvent,
  type CompositionEvent,
} from 'react';

interface NicknameInputProps {
  onVerified: (nickname: string) => void;
}

// 완성형 한글, 자음/모음 단독, 영문, 숫자 허용 / 특수문자·공백 제거, 10자 초과 방지
function filterNickname(input: string) {
  return input.replace(/[^가-힣ㄱ-ㅣa-zA-Z0-9]/g, '').slice(0, 10);
}

export default function NicknameInput({ onVerified }: NicknameInputProps) {
  const [nickname, setNickname] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const isComposing = useRef(false);

  const isLengthValid = nickname.length >= 2 && nickname.length <= 10;

  const resetVerification = () => {
    if (isChecked) setIsChecked(false);
    if (isDuplicate) setIsDuplicate(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // 조합 중(한글 입력 중)에는 필터링 보류, 길이 제한만 적용
    if (isComposing.current) {
      setNickname(raw.slice(0, 10));
      return;
    }

    setNickname(filterNickname(raw));
    resetVerification();
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    setNickname(filterNickname((e.target as HTMLInputElement).value));
    resetVerification();
  };

  const handleCheckDuplicate = () => {
    if (!isLengthValid || isChecked) return;

    // TODO: 백엔드에 닉네임 중복확인 요청
    const isTaken = false;

    if (isTaken) {
      setIsDuplicate(true);
      return;
    }
    setIsDuplicate(false);
    setIsChecked(true);
    onVerified(nickname);
  };

  const helperText = isDuplicate
    ? '이미 사용 중인 닉네임이에요'
    : isChecked
      ? '사용가능한 닉네임이에요'
      : '2~10자, 한글/영문/숫자';

  const helperColor = isDuplicate
    ? 'text-[#FF3232]'
    : isChecked
      ? 'text-[#28323C]'
      : 'text-[#ADB0B5]';

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-[#28323C] font-medium">닉네임</label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          disabled={isChecked}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="flex-1 border-b border-[#E9EBEE] px-1 py-2 outline-none disabled:text-[#ADB0B5]"
        />
        <button
          onClick={handleCheckDuplicate}
          disabled={!isLengthValid || isChecked}
          className="w-24 h-10 rounded-lg text-sm whitespace-nowrap bg-[#000000] text-white disabled:bg-[#E9EBEE] disabled:text-[#ADB0B5]"
        >
          {isChecked ? '확인완료' : '중복확인'}
        </button>
      </div>

      <div className="flex justify-between">
        <span className={`text-xs ${helperColor}`}>{helperText}</span>
        <span className="text-xs text-[#ADB0B5]">{nickname.length}/10</span>
      </div>
    </div>
  );
}
