// [I101] 예약 데모 화면 (손 상태 ➡️ 아트/옵션 ➡️ 날짜/시간 ➡️ 확인/결제 ➡️ 완료)

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '../assets/icons';
import HandStatusSelect from '../components/reservation/HandStatusSelect';
import OptionSelector from '../components/reservation/OptionSelector';
import DateTimeCalendar from '../components/reservation/DateTimeCalendar';
import {
  HAND_STATUS_OPTIONS,
  EXTENSION_REMOVAL_UNIT_PRICE,
  BASE_DURATION_MINUTES,
  RESERVATION_DEPOSIT,
  formatDuration,
  formatDateLabel,
  getTodayKey,
  saveReservation,
  type ArtOption,
  type AdditionalOption,
  type TimeSlot,
  type HandStatusId,
  type GelRemovalShop,
} from '../data/mockupdata/reservationData';
import {
  getCardDetail,
  getShopOptions,
  splitShopOptions,
  createReservationDraft,
  getAvailableTimes,
  confirmReservationSchedule,
  getMyProfile,
  type CardDetail,
} from '../data/reservationAPI';

type Step = 'hand-status' | 'art-option' | 'datetime' | 'confirm' | 'complete';
type PaymentMethod = 'KAKAO_PAY' | 'CARD';

const HAND_STATUS_TO_BACKEND: Record<
  HandStatusId,
  'BARE_NAIL' | 'GEL_NAIL' | 'EXTENSION_NAIL'
> = {
  BARE: 'BARE_NAIL',
  GEL_REMOVAL: 'GEL_NAIL',
  EXTENSION_REMOVAL: 'EXTENSION_NAIL',
};

export default function ReservationPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const numericCardId = Number(cardId);

  const [step, setStep] = useState<Step>('hand-status');

  // 카드/샵/옵션 — 실제 API로 받아옴
  const [cardDetail, setCardDetail] = useState<CardDetail | null>(null);
  const [artOptions, setArtOptions] = useState<ArtOption[]>([]);
  const [additionalOptions, setAdditionalOptions] = useState<
    AdditionalOption[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const card = await getCardDetail(numericCardId);
        setCardDetail(card);

        const shopOptions = await getShopOptions(card.shopId);
        const split = splitShopOptions(shopOptions);
        setArtOptions(split.artOptions);
        setAdditionalOptions(split.additionalOptions);
      } catch (error) {
        console.error('카드/옵션 조회 실패:', error);
        setLoadError('예약 정보를 불러오지 못했어요. 다시 시도해주세요.');
      } finally {
        setIsLoadingOptions(false);
      }
    };

    load();
  }, [numericCardId]);

  // 손 상태
  const [handStatus, setHandStatus] = useState<HandStatusId[]>([]);
  const [gelRemovalShop, setGelRemovalShop] = useState<GelRemovalShop | null>(
    null,
  );
  const [extensionRemovalCount, setExtensionRemovalCount] = useState(1);

  // 아트/추가옵션
  const [selectedArtId, setSelectedArtId] = useState<number | null>(null);
  const [additionalCounts, setAdditionalCounts] = useState<
    Record<number, number>
  >({});

  // 예약 draft — POST /reservations 성공하면 채워짐
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  // 날짜/시간
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayKey(),
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // reservationId나 selectedDate가 바뀔 때마다 실제 가능 시간 조회
  useEffect(() => {
    if (!reservationId || !selectedDate) return;

    const fetchTimes = async () => {
      setIsLoadingTimes(true);
      try {
        const result = await getAvailableTimes(reservationId, selectedDate);
        setTimeSlots(
          result.availableTimes.map((slot) => ({
            time: slot.time,
            available: slot.isAvailable === 1,
          })),
        );
      } catch (error) {
        console.error('예약 가능 시간 조회 실패:', error);
        setTimeSlots([]);
      } finally {
        setIsLoadingTimes(false);
      }
    };

    fetchTimes();
  }, [reservationId, selectedDate]);

  // 예약자 정보 — 내 정보 조회로 자동 채움, 수정 불가
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [requestNote, setRequestNote] = useState('');

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const profile = await getMyProfile();
        setCustomerName(profile.name);
        setCustomerPhone(profile.phoneNumber);
      } catch (error) {
        console.error('내 정보 조회 실패:', error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchMyProfile();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [completeResult, setCompleteResult] = useState<{
    reservationId: number;
    shopName: string;
    artName: string;
    reservationDate: string;
    reservationStartTime: string;
    totalPrice: number;
  } | null>(null);

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

  const handleChangeAdditionalCount = (id: number, count: number) => {
    setAdditionalCounts((prev) => ({ ...prev, [id]: count }));
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  // 실시간 미리보기용 가격/시간 (draft 생성 전, hand-status/art-option 스텝 하단바 표시용)
  const selectedArt = artOptions.find((a) => a.id === selectedArtId);

  const previewPrice = (() => {
    let total = 0;
    handStatus.forEach((id) => {
      const option = HAND_STATUS_OPTIONS.find((o) => o.id === id);
      if (option) total += option.price;
    });
    if (handStatus.includes('EXTENSION_REMOVAL')) {
      total += extensionRemovalCount * EXTENSION_REMOVAL_UNIT_PRICE;
    }
    if (selectedArt) total += selectedArt.price;
    additionalOptions.forEach((option) => {
      const count = additionalCounts[option.id] ?? 0;
      total += count * option.unitPrice;
    });
    return total;
  })();

  const previewDuration = (() => {
    let total = BASE_DURATION_MINUTES + (selectedArt?.badgeMinutes ?? 0);
    additionalOptions.forEach((option) => {
      const count = additionalCounts[option.id] ?? 0;
      total += count * option.badgeMinutes;
    });
    return total;
  })();

  const isHandStatusComplete =
    handStatus.length > 0 &&
    (!handStatus.includes('GEL_REMOVAL') || gelRemovalShop !== null);

  const isArtOptionComplete = selectedArtId !== null;
  const isDateTimeComplete = selectedDate !== null && selectedTime !== null;

  const isConfirmComplete =
    !isProfileLoading &&
    customerName.trim().length > 0 &&
    customerPhone.replace(/[^0-9]/g, '').length >= 10 &&
    paymentMethod !== null &&
    agreedToPolicy;

  // 손상태/아트/옵션 스텝 끝 → 예약 draft 생성 후 날짜 스텝으로
  const handleGoToDateTime = async () => {
    if (!isArtOptionComplete || isCreatingDraft) return;

    setIsCreatingDraft(true);
    try {
      const draft = await createReservationDraft({
        cardId: numericCardId,
        handStates: handStatus.map((id) => HAND_STATUS_TO_BACKEND[id]),
        gelRemovalType: handStatus.includes('GEL_REMOVAL')
          ? (gelRemovalShop ?? 'NONE')
          : 'NONE',
        extensionRemovalCount: handStatus.includes('EXTENSION_REMOVAL')
          ? extensionRemovalCount
          : 0,
        selectedOptions: [
          ...(selectedArtId != null
            ? [{ shopOptionId: selectedArtId, quantity: 1 }]
            : []),
          ...Object.entries(additionalCounts)
            .filter(([, count]) => count > 0)
            .map(([id, count]) => ({
              shopOptionId: Number(id),
              quantity: count,
            })),
        ],
      });

      setReservationId(draft.reservationId);
      setStep('datetime');
    } catch (error) {
      console.error('예약 생성 실패:', error);
      alert('예약 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsCreatingDraft(false);
    }
  };

  const handleNextStep = () => {
    if (step === 'hand-status' && isHandStatusComplete) setStep('art-option');
    else if (step === 'art-option' && isArtOptionComplete) handleGoToDateTime();
    else if (step === 'datetime' && isDateTimeComplete) setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'art-option') setStep('hand-status');
    else if (step === 'datetime') setStep('art-option');
    else if (step === 'confirm') setStep('datetime');
    else navigate(-1);
  };

  const handleConfirmNext = async () => {
    if (!isConfirmComplete || !selectedDate || !selectedTime || !reservationId)
      return;

    setIsSubmitting(true);
    try {
      const result = await confirmReservationSchedule(reservationId, {
        reservationDate: selectedDate,
        reservationStartTime: selectedTime,
        requestMessage: requestNote,
        paymentMethod: paymentMethod as 'KAKAO_PAY' | 'CARD',
        refundPolicyAgreed: agreedToPolicy,
      });

      setCompleteResult(result);

      // ⚠️ MyReservationListPage(F102)가 아직 localStorage 기준이라, 실제 API 붙기 전까지 임시로 같이 저장
      saveReservation({
        id: String(result.reservationId),
        cardId: numericCardId,
        shopName: result.shopName,
        artLabel: result.artName,
        date: result.reservationDate,
        time: result.reservationStartTime,
        totalPrice: result.totalPrice,
        depositPrice: RESERVATION_DEPOSIT,
        customerName,
        customerPhone,
        requestNote,
        isCancelled: false,
        createdAt: Date.now(),
      });

      setStep('complete');
    } catch (error) {
      console.error('예약 확정 실패:', error);
      alert('예약 확정에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <p className="text-sm text-[#ADB0B5]">{loadError}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-[#171B1C] text-white px-5 py-2.5 text-sm cursor-pointer"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  if (isLoadingOptions || !cardDetail) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-sm text-[#ADB0B5]">불러오는 중...</p>
      </div>
    );
  }

  if (step === 'complete' && completeResult) {
    return (
      <div className="min-h-dvh flex flex-col">
        <div className="relative flex items-center justify-center px-4 py-3 border-b border-[#E9EBEE] shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 cursor-pointer"
            aria-label="뒤로가기"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#646F7C]" />
          </button>
          <span className="text-[13px] font-semibold text-[#000000]">
            {completeResult.shopName}
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
            예약번호 A-{completeResult.reservationId}
          </p>

          <div className="mt-8 w-full rounded-xl bg-[#F7F8FA] divide-y divide-[#E9EBEE] px-5">
            <div className="flex justify-between py-4 text-sm">
              <span className="text-[#ADB0B5]">샵명</span>
              <span className="font-medium text-[#171B1C]">
                {completeResult.shopName}
              </span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-[#ADB0B5]">아트</span>
              <span className="font-medium text-[#171B1C]">
                {completeResult.artName}
              </span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-[#ADB0B5]">일시</span>
              <span className="font-medium text-[#171B1C]">
                {formatDateLabel(completeResult.reservationDate)}{' '}
                {completeResult.reservationStartTime.slice(0, 5)}
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
          {cardDetail.shopName}
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
            artOptions={artOptions}
            additionalOptions={additionalOptions}
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
            timeSlots={timeSlots}
            isLoadingTimes={isLoadingTimes}
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
                  {cardDetail.shopName}
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
                  {selectedTime?.slice(0, 5)}
                </span>
              </div>
              <div className="flex justify-between py-4 text-sm">
                <span className="text-[#ADB0B5]">가격</span>
                <span className="font-bold text-[#171B1C]">
                  {previewPrice.toLocaleString()} 원
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
                  disabled
                  className="mt-1.5 w-full bg-[#F7F8FA] rounded-lg px-3 py-3 outline-none text-sm text-[#171B1C] placeholder:text-[#ADB0B5]"
                />
              </div>
              <div>
                <label className="text-sm text-[#28323C] font-medium">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  disabled
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
                    {previewPrice.toLocaleString()}원
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
                {previewPrice.toLocaleString()}원
              </span>
            </span>
            <span className="text-[#E9EBEE]">·</span>
            <span className="flex items-center gap-1.5">
              소요시간
              <span className="text-[18px] font-bold text-[#171B1C]">
                {formatDuration(previewDuration)}
              </span>
            </span>
          </div>
          <button
            onClick={handleNextStep}
            disabled={
              (step === 'hand-status'
                ? !isHandStatusComplete
                : !isArtOptionComplete) || isCreatingDraft
            }
            className="rounded-xl bg-[#F70071] px-9 py-3 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-[#FFC0DA] disabled:text-[#ffffff]"
          >
            {isCreatingDraft ? '생성 중...' : '다음'}
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
            disabled={!isConfirmComplete || isSubmitting}
            className="w-full rounded-xl bg-[#171B1C] py-5 text-md font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-[#E9EBEE] disabled:text-[#ADB0B5]"
          >
            {isSubmitting ? '처리 중...' : '다음'}
          </button>
        </div>
      )}
    </div>
  );
}
