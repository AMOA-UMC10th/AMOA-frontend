import { useEffect, useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import AuthTimer from '../onboarding/AuthTimer';
import { checkNickname, sendPhoneCode, verifyPhoneCode } from '../../data/userdata/user';

const CODE_LENGTH = 6;

interface ProfileFormProps {
  profileImageUrl: string;
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  onSaveNickname: (nickname: string) => Promise<boolean>;
  onSavePhone: (phoneNumber: string) => Promise<boolean>;
  // 저장에 성공하면 서버가 돌려준 이미지 URL을, 실패하면 null을 반환한다.
  onSaveImage: (file: File) => Promise<string | null>;
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
      className="flex h-[38px] w-[81px] shrink-0 items-center justify-center rounded-[7px] bg-[#F70071] text-[13px] font-medium text-white disabled:bg-[#E9EBEE] disabled:text-[#ADB0B5]"
    >
      {label}
    </button>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[3px] border-b border-[#D4D7DC] py-[10px]">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-medium text-[#ADB0B5]">{label}</span>
        <KakaoBadge />
      </div>
      <p className="text-[15px] text-[#ADB0B5]">{value}</p>
    </div>
  );
}

export default function ProfileForm({
  profileImageUrl,
  name,
  nickname,
  email,
  phoneNumber,
  onSaveNickname,
  onSavePhone,
  onSaveImage,
}: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(profileImageUrl);
  const [imageSaving, setImageSaving] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  const [nicknameValue, setNicknameValue] = useState(nickname);
  const [nicknameEditing, setNicknameEditing] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);
  const [nicknameChecking, setNicknameChecking] = useState(false);
  const [nicknameSaving, setNicknameSaving] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);

  const [phoneValue, setPhoneValue] = useState(formatPhoneNumber(phoneNumber));
  const [phoneEditing, setPhoneEditing] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [codeMismatch, setCodeMismatch] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [codeVerifying, setCodeVerifying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeDuration, setCodeDuration] = useState(180);

  const handleImageClick = () => fileInputRef.current?.click();
const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const result = await updateProfileImage(file);
    setImageUrl(result.profileImageUrl); // 서버에서 내려준 새 URL로 업데이트
  } catch (error) {
    console.error('프로필 이미지 변경 실패:', error);
  }
};
  const startNicknameEdit = () => {
    setNicknameDraft(nicknameValue);
    setNicknameChecked(false);
    setNicknameDuplicate(false);
    setNicknameEditing(true);
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameDraftValid || nicknameChecked || nicknameChecking) return;

    setNicknameChecking(true);
    try {
      const { available } = await checkNickname(nicknameDraft);
      setNicknameDuplicate(!available);
      setNicknameChecked(available);
    } catch (err) {
      console.error(err);
      setNicknameDuplicate(true);
      setNicknameChecked(false);
    } finally {
      setNicknameChecking(false);
    }
  };

  const handleConfirmNickname = async () => {
    if (!nicknameChecked || nicknameSaving) return;

    setNicknameSaving(true);
    try {
      const saved = await onSaveNickname(nicknameDraft.trim());
      if (!saved) return;
      setNicknameValue(nicknameDraft.trim());
      setNicknameEditing(false);
    } finally {
      setNicknameSaving(false);
    }
  };

  const startPhoneEdit = () => {
    setPhoneDraft('');
    setCode('');
    setCodeRequested(false);
    setPhoneVerified(false);
    setPhoneEditing(true);
  };

  const isNicknameDraftValid =
    nicknameDraft.trim().length >= 2 &&
    nicknameDraft.trim().length <= 10 &&
    /^[가-힣a-zA-Z0-9]+$/.test(nicknameDraft.trim());
  const isPhoneDraftValid = phoneDraft.replace(/\D/g, '').length === 11;
  const isCodeValid = code.length === CODE_LENGTH;

  const handleRequestCode = async () => {
    if (!isPhoneDraftValid || codeSending) return;

    setCodeSending(true);
    setCodeError(null);
    setCodeMismatch(false);
    setCode('');
    try {
      const { expiresInSeconds } = await sendPhoneCode(phoneDraft);
      setCodeDuration(expiresInSeconds || 180);
      setCodeRequested(true);
    } catch (err) {
      console.error(err);
      setCodeError(
        err instanceof Error ? err.message : '인증번호를 보내지 못했어요',
      );
    } finally {
      setCodeSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!isCodeValid || codeVerifying) return;

    setCodeVerifying(true);
    setCodeError(null);
    try {
      const { verified } = await verifyPhoneCode(phoneDraft, code);
      setCodeMismatch(!verified);
      setPhoneVerified(verified);
    } catch (err) {
      console.error(err);
      setCodeMismatch(true);
      setPhoneVerified(false);
    } finally {
      setCodeVerifying(false);
    }
  };

  const handleConfirmPhone = async () => {
    if (!phoneVerified || phoneSaving) return;

    setPhoneSaving(true);
    try {
      const saved = await onSavePhone(phoneDraft.replace(/\D/g, ''));
      if (!saved) return;
      setPhoneValue(phoneDraft);
      setPhoneEditing(false);
    } finally {
      setPhoneSaving(false);
    }
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
            disabled={imageSaving}
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
        <button
          type="button"
          onClick={handleImageClick}
          disabled={imageSaving}
          className="text-[12px] text-[#999]"
        >
          프로필 사진 변경
        </button>
      </div>

      <div className="flex flex-col">
        <ReadOnlyRow label="이름" value={name} />
        <ReadOnlyRow label="이메일" value={email} />

        <div className="flex flex-col gap-[3px] border-b border-[#D4D7DC] py-[10px]">
          <span className="text-[11px] font-medium text-[#646F7C]">
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
                  placeholder="닉네임 입력"
                  className="flex-1 border-b border-[#F70071] py-1 text-[15px] text-[#1E2427] focus:outline-none"
                />
                {nicknameChecked ? (
                  <ChangeButton
                    label="변경하기"
                    disabled={nicknameSaving}
                    onClick={handleConfirmNickname}
                  />
                ) : (
                  <ChangeButton
                    label="중복확인"
                    disabled={!isNicknameDraftValid || nicknameChecking}
                    onClick={handleCheckDuplicate}
                  />
                )}
              </div>

              <div className="flex items-start justify-between gap-2">
                {nicknameDuplicate ? (
                  <span className="text-[11px] text-[#F70071]">
                    이미 사용중인 닉네임이에요
                  </span>
                ) : nicknameChecked ? (
                  <span className="text-[11px] text-[#F70071]">
                    사용가능한 닉네임이에요
                  </span>
                ) : (
                  <span className="text-[11px] text-[#ADB0B5]">
                    2~10자, 한글/영문/숫자
                  </span>
                )}
                <span className="shrink-0 text-[11px] text-[#ADB0B5]">
                  {nicknameDraft.length}/10
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-2.5">
              <p className="flex-1 pt-1.5 text-[15px] -translate-y-[3px] text-[#1E2427]">{nicknameValue}</p>
              <ChangeButton label="변경하기" onClick={startNicknameEdit} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[3px] border-b border-[#D4D7DC] py-[10px]">
          <span className="text-[11px] font-medium text-[#646F7C]">
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
                  placeholder="전화번호 입력"
                  disabled={codeRequested}
                  onChange={(e) => setPhoneDraft(formatPhoneNumber(e.target.value))}
                  className="flex-1 border-b border-[#F70071] py-1 text-[15px] text-[#1E2427] disabled:text-[#ADB0B5] focus:outline-none"
                />
                {phoneVerified ? (
                  <ChangeButton
                    label="변경하기"
                    disabled={phoneSaving}
                    onClick={handleConfirmPhone}
                  />
                ) : (
                  <ChangeButton
                    label="인증받기"
                    disabled={!isPhoneDraftValid || codeRequested || codeSending}
                    onClick={handleRequestCode}
                  />
                )}
              </div>

              {codeError && (
                <span className="text-[11px] text-[#F70071]">{codeError}</span>
              )}

              {codeRequested && (
                <>
                  <span className="text-[11px] text-[#646F7C]">인증번호</span>
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={CODE_LENGTH}
                        placeholder={`${CODE_LENGTH}자리 입력`}
                        value={code}
                        disabled={phoneVerified}
                        onChange={(e) => {
                          setCode(e.target.value.replace(/\D/g, ''));
                          setCodeMismatch(false);
                        }}
                        className="w-full border-b border-[#F70071] py-1 pr-12 text-[15px] text-[#1E2427] disabled:text-[#ADB0B5] focus:outline-none"
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <AuthTimer
                          duration={codeDuration}
                          onExpire={() => setCode('')}
                        />
                      </div>
                    </div>
                    <ChangeButton
                      label="인증하기"
                      disabled={!isCodeValid || phoneVerified || codeVerifying}
                      onClick={handleVerifyCode}
                    />
                  </div>

                  {codeMismatch ? (
                    <span className="text-[11px] text-[#F70071]">
                      인증번호가 일치하지 않아요
                    </span>
                  ) : phoneVerified ? (
                    <span className="text-[11px] text-[#F70071]">
                      인증번호가 확인되었어요
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#ADB0B5]">
                      인증번호가 오지 않았나요?{' '}
                      <button
                        type="button"
                        onClick={handleRequestCode}
                        className="font-semibold text-[#646F7C] underline"
                      >
                        재전송
                      </button>
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex items-end gap-2.5">
              <p className="flex-1 text-[15px] -translate-y-[3px] text-[#1E2427]">{phoneValue}</p>
              <ChangeButton label="변경하기" onClick={startPhoneEdit} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
