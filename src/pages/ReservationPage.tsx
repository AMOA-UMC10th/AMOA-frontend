// [I101] 예약 데모 화면 (손 상태 ➡️ 아트/옵션 ➡️ 날짜/시간 ➡️ 확인/결제 ➡️ 완료)

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '../assets/icons';
import { mockCardResponse } from '../data/mockupdata/nailData';
import HandStatusSelect from '../components/reservation/HandStatusSelect';
import OptionSelector from '../components/reservation/OptionSelector';
import DateTimeCalendar from '../components/reservation/DateTimeCalendar';
import PaymentConsentModal from '../components/reservation/PaymentConsentModal';
import {
  ART_OPTIONS,
  RESERVATION_DEPOSIT,
  calculateTotalPrice,
  calculateTotalDuration,
  formatDuration,
  formatDateLabel,
  getTodayKey,
  saveReservation,
  type HandStatusId,
  type GelRemovalShop,
} from '../data/mockupdata/reservationData';

type Step = 'hand-status' | 'art-option' | 'datetime' | 'confirm' | 'complete';
type PaymentMethod = 'KAKAO_PAY' | 'CARD';

export default function ReservationPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();

  const card =
    mockCardResponse.result.cards.find((c) => c.card_id === Number(cardId)) ??
    mockCardResponse.result.cards[0];

  const [step, setStep] = useState<Step>('hand-status');

  const [handStatus, setHandStatus] = useState<HandStatusId[]>([]);
  const [gelRemovalShop, setGelRemovalShop] = useState<GelRemovalShop | null>(
    null,
  );
  const [extensionRemovalCount, setExtensionRemovalCount] = useState(1);

  const [selectedArtId, setSelectedArtId] = useState<string | null>(null);
  const [additionalCounts, setAdditionalCounts] = useState<
    Record<string, number>
  >({});

  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayKey(),
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);

    if (numbers.length < 4) {
      return numbers;
    }

    if (numbers.length < 8) {
      return numbers.replace(/(\d{3})(\d+)/, '$1-$2');
    }

    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };
  const [requestNote, setRequestNote] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const selection = {
    handStatus,
    extensionRemovalCount,
    selectedArtId,
    additionalCounts,
  };
  const totalPrice = calculateTotalPrice(selection);
  const totalDuration = calculateTotalDuration(selection);

  const handleToggleHandStatus = (id: HandStatusId) => {
    setHandStatus((prev) => {
      if (id === 'BARE') return prev.includes('BARE') ? [] : ['BARE'];
      const withoutBare = prev.filter((s) => s !== 'BARE');
      const isActive = withoutBare.includes(id);
      if (id === 'EXTENSION_REMOVAL' && !isActive) setExtensionRemovalCount(1);
      if (id === 'GEL_REMOVAL' && isActive) setGelRemovalShop(null);
      return isActive
        ? withoutBare.filter((s) => s !== id)
        : [...withoutBare, id];
    });
  };

  const handleChangeAdditionalCount = (id: string, count: number) => {
    setAdditionalCounts((prev) => ({ ...prev, [id]: count }));
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const isHandStatusComplete =
    handStatus.length > 0 &&
    (!handStatus.includes('GEL_REMOVAL') || gelRemovalShop !== null);

  const isArtOptionComplete = selectedArtId !== null;

  const isDateTimeComplete = selectedDate !== null && selectedTime !== null;

  const isConfirmComplete =
    customerName.trim().length > 0 &&
    customerPhone.replace(/[^0-9]/g, '').length === 11 &&
    paymentMethod !== null &&
    agreedToPolicy;

  const selectedArt = ART_OPTIONS.find((a) => a.id === selectedArtId);

  // TODO: 카카오페이 SDK 연동 후, 여기서 실제 결제창(window.Kakao.Payment.request 등) 호출
  const handleKakaoPayFlow = () => {
    console.log('카카오페이 결제 요청 (아직 미연동, 데모라 스킵)');
  };

  // TODO: PG사(카드결제) 연동 후, 여기서 실제 카드결제 페이지로 이동
  const handleCardPaymentFlow = () => {
    console.log('카드 결제 요청 (아직 미연동, 데모라 스킵)');
  };

  const handleConfirmNext = () => {
    if (!isConfirmComplete || !selectedDate || !selectedTime) return;

    if (paymentMethod === 'KAKAO_PAY') handleKakaoPayFlow();
    else if (paymentMethod === 'CARD') handleCardPaymentFlow();

    const id = crypto.randomUUID();
    // TODO: 실제 결제 연동 전까지는 결제 없이 바로 저장 + 완료 화면으로 이동
    saveReservation({
      id,
      cardId: card.card_id,
      shopName: card.shop_name,
      artLabel: selectedArt?.label ?? '',
      date: selectedDate,
      time: selectedTime,
      totalPrice,
      depositPrice: RESERVATION_DEPOSIT,
      customerName,
      customerPhone,
      requestNote,
      isCancelled: false,
      createdAt: Date.now(),
    });
    setSavedId(id);
    setStep('complete');
  };

  const handleNextStep = () => {
    if (step === 'hand-status' && isHandStatusComplete) setStep('art-option');
    else if (step === 'art-option' && isArtOptionComplete) setStep('datetime');
    else if (step === 'datetime' && isDateTimeComplete) setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'art-option') setStep('hand-status');
    else if (step === 'datetime') setStep('art-option');
    else if (step === 'confirm') setStep('datetime');
    else navigate(-1);
  };

  if (step === 'complete') {
    return (
      <div className="min-h-dvh flex flex-col">
        <div className="relative flex items-center justify-center px-4 py-3 border-b border-[#E9EBEE] shrink-0">
          <button
            onClick={() => navigate('/home')}
            className="absolute left-4 cursor-pointer"
            aria-label="뒤로가기"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
          </button>
          <span className="text-sm font-bold text-[#171B1C]">
            {card.shop_name}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-10 pb-6">
          <span className="w-16 h-16 rounded-full bg-[#FFEEF6] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#F70071"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="text-xl font-bold text-[#171B1C]">
            예약이 완료됐어요
          </h1>
          <p className="mt-1 text-sm text-[#ADB0B5]">
            예약번호 A-{savedId?.slice(0, 8).toUpperCase()}
          </p>

          <div className="mt-8 w-full rounded-xl bg-[#F7F8FA] divide-y divide-[#E9EBEE] px-5">
            <div className="flex justify-between py-4 text-sm">
              <span className="text-[#ADB0B5]">샵명</span>
              <span className="font-medium text-[#171B1C]">
                {card.shop_name}
              </span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-[#ADB0B5]">아트</span>
              <span className="font-medium text-[#171B1C]">
                {selectedArt?.label ?? '-'}
              </span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-[#ADB0B5]">일시</span>
              <span className="font-medium text-[#171B1C]">
                {selectedDate ? formatDateLabel(selectedDate) : '-'}{' '}
                {selectedTime}
              </span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-[#ADB0B5]">가격</span>
              <span className="font-bold text-[#171B1C]">
                {RESERVATION_DEPOSIT.toLocaleString()} 원
              </span>
            </div>
          </div>

          <div className="mt-6 w-full flex gap-2">
            <button
              onClick={() => navigate('/home')}
              className="flex-1 border border-[2px] border-[#D4D7DC] text-[#171B1C] rounded-lg py-3 cursor-pointer"
            >
              홈으로
            </button>
            <button
              onClick={() => navigate('/reservations')}
              className="flex-1 bg-[#F70071] text-white rounded-lg py-3 cursor-pointer"
            >
              예약 내역 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="relative flex items-center justify-center px-4 py-3 border-b border-[#E9EBEE] shrink-0">
        <button
          onClick={handleBack}
          className="absolute left-4 cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-sm font-bold text-[#171B1C]">
          {card.shop_name}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {step === 'hand-status' && (
          <HandStatusSelect
            selected={handStatus}
            onToggle={handleToggleHandStatus}
            gelRemovalShop={gelRemovalShop}
            onSelectGelRemovalShop={setGelRemovalShop}
            extensionRemovalCount={extensionRemovalCount}
            onChangeExtensionRemovalCount={setExtensionRemovalCount}
          />
        )}

        {step === 'art-option' && (
          <OptionSelector
            selectedArtId={selectedArtId}
            onSelectArt={setSelectedArtId}
            additionalCounts={additionalCounts}
            onChangeAdditionalCount={handleChangeAdditionalCount}
          />
        )}

        {step === 'datetime' && (
          <DateTimeCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        )}

        {step === 'confirm' && (
          <div className="px-5 pt-6">
            <h2 className="text-lg font-bold text-[#171B1C]">
              예약 정보를 확인해주세요
            </h2>

            <div className="mt-4 rounded-xl bg-[#F7F8FA] divide-y divide-[#E9EBEE] px-5">
              <div className="flex justify-between py-4 text-sm">
                <span className="text-[#ADB0B5]">샵명</span>
                <span className="font-medium text-[#171B1C]">
                  {card.shop_name}
                </span>
              </div>
              <div className="flex justify-between py-4 text-sm">
                <span className="text-[#ADB0B5]">아트</span>
                <span className="font-medium text-[#171B1C]">
                  {selectedArt?.label ?? '-'}
                </span>
              </div>
              <div className="flex justify-between py-4 text-sm">
                <span className="text-[#ADB0B5]">일시</span>
                <span className="font-medium text-[#171B1C]">
                  {selectedDate ? formatDateLabel(selectedDate) : '-'}{' '}
                  {selectedTime}
                </span>
              </div>
              <div className="flex justify-between py-4 text-sm">
                <span className="text-[#ADB0B5]">가격</span>
                <span className="font-bold text-[#171B1C]">
                  {totalPrice.toLocaleString()} 원
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div>
                <label className="text-sm text-[#28323C] font-medium">
                  이름
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className="mt-1.5 w-full bg-[#F7F8FA] rounded-lg px-3 py-3 outline-none text-sm text-[#171B1C] placeholder:text-[#ADB0B5]"
                />
              </div>
              <div>
                <label className="text-sm text-[#28323C] font-medium">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={13}
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(formatPhoneNumber(e.target.value));
                  }}
                  placeholder="010-0000-0000"
                  className="mt-1.5 w-full bg-[#F7F8FA] rounded-lg px-3 py-3 outline-none text-sm text-[#171B1C] placeholder:text-[#ADB0B5]"
                />
              </div>
              <div>
                <label className="text-sm text-[#28323C] font-medium">
                  요청사항
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="요청사항을 적어주세요"
                  rows={3}
                  className="mt-1 w-full border border-[#E9EBEE] rounded-lg px-3 py-2 outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-base font-bold text-[#171B1C] mb-2">
                예약금 결제
              </p>
              <div className="rounded-xl bg-[#FFEEF6] p-4">
                <div className="flex justify-between text-sm pb-3 border-b border-[#F7D0E4]">
                  <span className="text-[#646F7C]">총 시술 금액</span>
                  <span className="text-[#171B1C]">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold text-[#171B1C]">
                    예약금
                  </span>
                  <span className="text-lg font-bold text-[#F70071]">
                    {RESERVATION_DEPOSIT.toLocaleString()}원
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#ADB0B5]">
                  나머지 금액은 방문 후 현장에서 결제해주세요
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-lg font-bold text-[#171B1C]">결제 수단</p>

              <div className="flex flex-col gap-3">
                {(['KAKAO_PAY', 'CARD'] as PaymentMethod[]).map((method) => {
                  const isSelected = paymentMethod === method;

                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 bg-white px-5 py-6 text-left cursor-pointer transition-colors ${
                        isSelected ? 'border-[#F70071]' : 'border-[#D9DBDF]'
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-[#171B1C]">
                          {method === 'KAKAO_PAY'
                            ? '카카오페이'
                            : '신용/체크카드'}
                        </span>

                        <span className="text-sm text-[#ADB0B5]">
                          {method === 'KAKAO_PAY'
                            ? '카카오톡 간편결제'
                            : '국내외 모든 카드 사용 가능'}
                        </span>
                      </div>

                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          isSelected ? 'border-[#F70071]' : 'border-[#BFC3C8]'
                        }`}
                      >
                        {isSelected && (
                          <span className="h-3 w-3 rounded-full bg-[#F70071]" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex gap-2 rounded-lg bg-[#F7F8FA] px-3 py-2.5">
              <span className="mt-0.5 text-[#ADB0B5]">ⓘ</span>
              <p className="text-xs text-[#646F7C] leading-relaxed">
                예약금은 노쇼 방지를 위해 수령됩니다. 예약 취소 시 환불 정책에
                따라 예약금이 반환되지 않을 수 있습니다.
              </p>
            </div>

            <label className="mt-3 flex items-center gap-2 text-xs text-[#646F7C]">
              <input
                type="checkbox"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="cursor-pointer"
              />
              <span>
                취소/환불 규정에 동의합니다{' '}
                <span className="text-[#F70071] font-medium">(필수)</span>
              </span>
            </label>
          </div>
        )}
      </div>

      {(step === 'hand-status' || step === 'art-option') && (
        <div className="shrink-0 flex items-center justify-between border-t border-[#E9EBEE] px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-[#ADB0B5]">
            <span className="flex items-center gap-1.5">
              결제금액
              <span className="text-[18px] font-bold text-[#171B1C]">
                {totalPrice.toLocaleString()}원
              </span>
            </span>
            <span className="text-[#E9EBEE]">·</span>
            <span className="flex items-center gap-1.5">
              소요시간
              <span className="text-[18px] font-bold text-[#171B1C]">
                {formatDuration(totalDuration)}
              </span>
            </span>
          </div>
          <button
            onClick={handleNextStep}
            disabled={
              step === 'hand-status'
                ? !isHandStatusComplete
                : !isArtOptionComplete
            }
            className="rounded-xl bg-[#F70071] px-9 py-3 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-[#FFC0DA] disabled:text-[#ffffff]"
          >
            다음
          </button>
        </div>
      )}

      {step === 'datetime' && (
        <div className="shrink-0 px-5 py-3">
          <button
            onClick={handleNextStep}
            disabled={!isDateTimeComplete}
            className="w-full rounded-xl bg-[#171B1C] py-5 text-md font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-[#ADB0B5] disabled:text-white"
          >
            다음
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="shrink-0 px-5 py-3">
          <button
            onClick={handleConfirmNext}
            disabled={!isConfirmComplete}
            className="w-full rounded-xl bg-[#171B1C] py-5 text-md font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-[#E9EBEE] disabled:text-[#ADB0B5]"
          >
            다음
          </button>
        </div>
      )}

      <PaymentConsentModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
      />
    </div>
  );
}
