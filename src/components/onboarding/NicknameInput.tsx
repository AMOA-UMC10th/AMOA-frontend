import {
  useRef,
  useState,
  type ChangeEvent,
  type CompositionEvent,
} from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NicknameInputProps {
  onVerified: (nickname: string) => void;
  onVerificationReset: () => void;
}

interface NicknameCheckResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    available: boolean;
  } | null;
}

// 완성형 한글, 자음/모음, 영문, 숫자만 허용
// 특수문자와 공백 제거, 최대 10자
function filterNickname(input: string) {
  return input.replace(/[^가-힣ㄱ-ㅣa-zA-Z0-9]/g, '').slice(0, 10);
}

export default function NicknameInput({
  onVerified,
  onVerificationReset,
}: NicknameInputProps) {
  const [nickname, setNickname] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isComposing = useRef(false);

  const isLengthValid = nickname.length >= 2 && nickname.length <= 10;

  const showCheckButton = hasInteracted || nickname.length > 0 || isChecked;

  const resetVerification = () => {
    setIsChecked(false);
    setIsDuplicate(false);
    setErrorMessage(null);
    onVerificationReset();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasInteracted(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    resetVerification();

    // 한글 조합 중에는 필터링하지 않고 길이만 제한
    if (isComposing.current) {
      setNickname(rawValue.slice(0, 10));
      return;
    }

    setNickname(filterNickname(rawValue));
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
    resetVerification();
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;

    const completedValue = filterNickname(e.currentTarget.value);

    setNickname(completedValue);
    resetVerification();
  };

  const handleCheckDuplicate = async () => {
    if (!isLengthValid || isChecked || isLoading) {
      return;
    }

    if (!API_BASE_URL) {
      setErrorMessage('API 주소가 설정되지 않았어요.');
      return;
    }

    const requestedNickname = nickname;

    setIsLoading(true);
    setErrorMessage(null);
    setIsDuplicate(false);

    try {
      const token = localStorage.getItem('tempToken');

      const response = await fetch(
        `${API_BASE_URL}/users/nickname/check?nickname=${encodeURIComponent(
          requestedNickname,
        )}`,
        {
          method: 'GET',
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        },
      );

      const data: NicknameCheckResponse = await response.json();

      if (!response.ok || !data.isSuccess || !data.result) {
        setIsChecked(false);
        setErrorMessage(data.message || '닉네임 중복 확인에 실패했어요.');
        onVerificationReset();
        return;
      }

      if (!data.result.available) {
        setIsChecked(false);
        setIsDuplicate(true);
        onVerificationReset();
        return;
      }

      setIsChecked(true);
      setIsDuplicate(false);
      setErrorMessage(null);

      onVerified(requestedNickname);
    } catch {
      setIsChecked(false);
      setErrorMessage('네트워크 오류가 발생했어요. 다시 시도해 주세요.');
      onVerificationReset();
    } finally {
      setIsLoading(false);
    }
  };

  const helperText = errorMessage
    ? errorMessage
    : isDuplicate
      ? '이미 사용 중인 닉네임이에요'
      : isChecked
        ? '사용 가능한 닉네임이에요'
        : '2~10자, 한글/영문/숫자';

  const helperColor =
    errorMessage || isDuplicate
      ? 'text-[#F70071]'
      : isChecked
        ? 'text-[#646F7C]'
        : 'text-[#D4D7DC]';

  return (
    <div className="w-full">
      <label
        htmlFor="nickname"
        className={`block text-[13px] font-medium ${
          isFocused || nickname.length > 0 ? 'text-[#171B1C]' : 'text-[#ADB0B5]'
        }`}
      >
        닉네임
      </label>

      <div className="flex items-end gap-[9px]">
        <div className="min-w-0 flex-1">
          <input
            id="nickname"
            type="text"
            value={nickname}
            placeholder="닉네임 입력"
            autoComplete="off"
            disabled={isLoading}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className={`h-11 w-full border-b bg-transparent mt-[2px] pt-[14px] pb-[14px] px-0 text-[13px]
              font-medium text-[#171B1C] outline-none
              placeholder:text-[#ADB0B5]
              disabled:cursor-not-allowed disabled:text-[#ADB0B5]
              ${
                isFocused || nickname.length > 0
                  ? 'border-[#F70071]'
                  : 'border-[#E9EBEE]'
              }
            `}
          />
        </div>

        {showCheckButton && (
          <button
            type="button"
            onClick={handleCheckDuplicate}
            disabled={!isLengthValid || isChecked || isLoading}
            className={`h-[38px] w-[81px] shrink-0 rounded-[7px]
              text-[13px] text-white transition-colors
              ${
                isChecked
                  ? 'cursor-default bg-[#F0BED7]'
                  : isLengthValid && !isLoading
                    ? 'bg-[#F70071]'
                    : 'cursor-not-allowed bg-[#F0BED7]'
              }
            `}
          >
            {isLoading ? '확인 중' : isChecked ? '확인완료' : '중복확인'}
          </button>
        )}
      </div>

      <div className="mt-[9px] flex items-center justify-between">
        <span className={`text-[11px] ${helperColor}`}>{helperText}</span>

        <span className="text-[11px] text-[#C7CBD1]">{nickname.length}/10</span>
      </div>
    </div>
  );
}
