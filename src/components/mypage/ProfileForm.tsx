// [F101] 프로필 조회/수정 폼 (이름·이메일·연락처·프로필사진 변경, 수정 불가 이메일 읽기 전용 처리)

import { useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import AuthTimer from '../onboarding/AuthTimer';

export interface ProfileFormValue {
  profileImageUrl: string;
  nickname: string;
  phoneNumber: string;
}

interface ProfileFormProps {
  profileImageUrl: string;
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  onSave: (value: ProfileFormValue) => void;
}

function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function KakaoBadge() {
  return (
    <span className="flex h-[17px] w-[55px] items-center justify-center rounded-[3px] border border-[#ADB0B5] text-[10px] text-[#ADB0B5]">
      카카오 연동
    </span>
  );
}

function ChangeButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-[38px] w-[81px] shrink-0 items-center justify-center rounded-[7px] bg-[#F70071] text-[13px] font-medium text-white disabled:bg-[#FFC0DC]"
    >
      {label}
    </button>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[3px] border-b border-[#D4D7DC] px-[6px] py-[10px]">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-medium leading-[1.5] text-[#ADB0B5]">{label}</span>
        <KakaoBadge />
      </div>
      <p className="text-[15px] leading-[1.5] text-[#ADB0B5]">{value}</p>
    </div>
  );
}

export default function ProfileForm({
  profileImageUrl,
  name,
  nickname,
  email,
  phoneNumber,
  onSave,
}: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(profileImageUrl);

  const [nicknameValue, setNicknameValue] = useState(nickname);
  const [nicknameEditing, setNicknameEditing] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);

  const [phoneValue, setPhoneValue] = useState(formatPhoneNumber(phoneNumber));
  const [phoneEditing, setPhoneEditing] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);

  const canSave = nicknameValue.trim().length > 0;

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: 백엔드에 프로필 이미지 업로드 요청, 응답으로 받은 URL로 교체
    setImageUrl(URL.createObjectURL(file));
  };

  const startNicknameEdit = () => {
    setNicknameDraft(nicknameValue);
    setNicknameChecked(false);
    setNicknameDuplicate(false);
    setNicknameEditing(true);
  };

  const handleCheckDuplicate = () => {
    const isLengthValid = nicknameDraft.length >= 2 && nicknameDraft.length <= 10;
    if (!isLengthValid || nicknameChecked) return;
    // TODO: 백엔드에 닉네임 중복확인 요청
    const isTaken = false;
    if (isTaken) {
      setNicknameDuplicate(true);
      return;
    }
    setNicknameDuplicate(false);
    setNicknameChecked(true);
    setNicknameValue(nicknameDraft);
    setNicknameEditing(false);
  };

  const startPhoneEdit = () => {
    setPhoneDraft('');
    setCode('');
    setCodeRequested(false);
    setPhoneVerified(false);
    setPhoneEditing(true);
  };

  const isPhoneDraftValid = phoneDraft.replace(/\D/g, '').length === 11;
  const isCodeValid = code.length === 4;

  const handleRequestCode = () => {
    if (!isPhoneDraftValid) return;
    // TODO: 백엔드에 SMS 인증번호 발송 요청
    setCodeRequested(true);
  };

  const handleVerifyCode = () => {
    if (!isCodeValid) return;
    // TODO: 백엔드에 인증번호 검증 요청
    setPhoneVerified(true);
    setPhoneValue(phoneDraft);
    setPhoneEditing(false);
  };

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({
      profileImageUrl: imageUrl,
      nickname: nicknameValue.trim(),
      phoneNumber: phoneValue,
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-[19px] pt-2">
        <div className="relative">
          <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-[#D0D0D0]">
            {imageUrl && (
              <img src={imageUrl} alt="프로필 사진" className="h-full w-full object-cover" />
            )}
          </div>
          <button
            type="button"
            onClick={handleImageClick}
            aria-label="프로필 사진 변경"
            className="absolute bottom-0 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black text-white"
          >
            <FiCamera size={12} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <button type="button" onClick={handleImageClick} className="text-[12px] text-[#999]">
          프로필 사진 변경
        </button>
      </div>

      <div className="flex flex-col">
        <ReadOnlyRow label="이름" value={name} />
        <ReadOnlyRow label="이메일" value={email} />

        <div className="flex flex-col gap-[3px] border-b border-[#D4D7DC] px-[6px] py-[10px]">
          <span className="text-[11px] font-medium leading-[1.5] text-[#646F7C]">
            닉네임<span className="text-[#CD0000]">*</span>
          </span>

          {nicknameEditing ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  autoFocus
                  value={nicknameDraft}
                  maxLength={10}
                  onChange={(e) => {
                    setNicknameDraft(e.target.value);
                    setNicknameChecked(false);
                    setNicknameDuplicate(false);
                  }}
                  placeholder="새로운 닉네임 입력"
                  className="flex-1 border-b border-[#F70071] py-1 text-[15px] leading-[1.5] text-[#1E2427] focus:outline-none"
                />
                <ChangeButton
                  label="중복확인"
                  disabled={nicknameDraft.trim().length < 2}
                  onClick={handleCheckDuplicate}
                />
              </div>
              {nicknameDuplicate && (
                <span className="text-xs text-[#CD0000]">이미 사용 중인 닉네임이에요</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[15px] leading-[1.5] text-[#1E2427]">{nicknameValue}</p>
              <ChangeButton label="변경하기" onClick={startNicknameEdit} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[3px] border-b border-[#D4D7DC] px-[6px] py-[10px]">
          <span className="text-[11px] font-medium leading-[1.5] text-[#646F7C]">
            전화번호<span className="text-[#CD0000]">*</span>
          </span>

          {phoneEditing ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={phoneDraft}
                  placeholder="010-0000-0000"
                  disabled={codeRequested}
                  onChange={(e) => setPhoneDraft(formatPhoneNumber(e.target.value))}
                  className="flex-1 border-b border-[#F70071] py-1 text-[15px] leading-[1.5] text-[#1E2427] focus:outline-none disabled:border-[#C5C8CE] disabled:text-[#ADB0B5]"
                />
                <ChangeButton
                  label="인증받기"
                  disabled={!isPhoneDraftValid || codeRequested}
                  onClick={handleRequestCode}
                />
              </div>

              {codeRequested && (
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="인증번호 4자리"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full border-b border-[#F70071] py-1 pr-12 text-[15px] leading-[1.5] text-[#1E2427] focus:outline-none"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <AuthTimer duration={180} onExpire={() => setCode('')} />
                    </div>
                  </div>
                  <ChangeButton label="확인완료" disabled={!isCodeValid} onClick={handleVerifyCode} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[15px] leading-[1.5] text-[#1E2427]">{phoneValue}</p>
              <ChangeButton label="변경하기" onClick={startPhoneEdit} />
            </div>
          )}
        </div>
      </div>

      {phoneVerified && (
        <span className="self-center rounded-full bg-[#F70071] px-4 py-2 text-xs font-semibold text-white">
          전화번호가 수정되었어요
        </span>
      )}

      <button
        type="button"
        disabled={!canSave}
        onClick={handleSubmit}
        className="h-[52px] w-full rounded-[10px] bg-[#F70071] text-[15px] font-medium text-white disabled:bg-[#FFC0DC]"
      >
        저장
      </button>
    </section>
  );
}
