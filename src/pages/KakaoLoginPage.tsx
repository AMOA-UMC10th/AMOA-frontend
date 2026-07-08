function KakaoLoginPage() {
  const handleKakaoLogin = (): void => {
    // 백엔드 연동 전 단계라 우선 클릭 핸들러만 잡아둠
    // 추후 여기서 카카오 SDK Auth.login() 호출 예정
    console.log('카카오로 시작하기 클릭');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-6">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-black">
          AMOA.
        </h1>
        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
          아트 디자인, 가격 한눈에 비교부터
          <br />
          예약까지 한번에
        </p>
      </div>

      <button
        onClick={handleKakaoLogin}
        className="mt-10 w-full max-w-xs flex items-center justify-center gap-2 bg-black text-white rounded-full py-3.5 font-medium active:opacity-80 transition"
      >
        <KakaoIcon />
        카카오로 시작하기
      </button>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.78 1.8 5.22 4.52 6.62-.2.73-.72 2.62-.82 3.03-.13.51.19.5.4.36.16-.1 2.6-1.76 3.65-2.47.71.1 1.45.16 2.25.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}

export default KakaoLoginPage;
