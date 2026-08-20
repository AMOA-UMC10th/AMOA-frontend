export function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function CrosshairIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.72 11.11 7.01 11.36a1.5 1.5 0 0 0 1.98 0C13.28 21.11 20 15.25 20 10c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

export function HeartFilledIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 57 57"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.468 32.7122L26.8206 48.0736C27.3839 48.6028 27.6655 48.8674 27.9976 48.9325C28.1471 48.9619 28.301 48.9619 28.4505 48.9325C28.7826 48.8674 29.0642 48.6028 29.6275 48.0736L45.9801 32.7122C50.581 28.3901 51.1397 21.2777 47.2701 16.2902L46.5425 15.3524C41.9133 9.38589 32.6214 10.3865 29.3687 17.2018C28.9092 18.1645 27.5389 18.1645 27.0794 17.2018C23.8267 10.3865 14.5348 9.38588 9.90561 15.3523L9.178 16.2902C5.30839 21.2777 5.86712 28.3901 10.468 32.7122Z" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? '#F70071' : 'none'}
      stroke={filled ? '#F70071' : '#171B1C'}
      strokeWidth={1.8}
    >
      <path d="M4.4076 13.7736L11.6245 20.5531C11.7331 20.655 11.7874 20.7061 11.852 20.7159C11.8731 20.7191 11.8945 20.7191 11.9156 20.7159C11.9803 20.7061 12.0346 20.655 12.1432 20.5531L19.36 13.7736C21.2973 11.9537 21.5325 8.959 19.9032 6.859L19.5968 6.4642C17.6477 3.952 13.7353 4.3733 12.3658 7.2429C12.1723 7.6482 11.5953 7.6482 11.4019 7.2429C10.0323 4.3733 6.1199 3.9519 4.1708 6.4641L3.8644 6.859C2.2351 8.959 2.4704 11.9537 4.4076 13.7736Z" />
    </svg>
  );
}

export function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1.0909V15.2727M7.6364 5.4545L12 1.0909L16.3636 5.4545M3.2727 12V20.7273C3.2727 21.3059 3.5026 21.8608 3.9118 22.27C4.3209 22.6792 4.8759 22.9091 5.4545 22.9091H18.5455C19.1241 22.9091 19.679 22.6792 20.0882 22.27C20.4974 21.8608 20.7273 21.3059 20.7273 20.7273V12" />
    </svg>
  );
}
export function AddressPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.99998 7.00008C7.32081 7.00008 7.59547 6.88585 7.82394 6.65737C8.05241 6.4289 8.16665 6.15425 8.16665 5.83342C8.16665 5.51258 8.05241 5.23793 7.82394 5.00946C7.59547 4.78098 7.32081 4.66675 6.99998 4.66675C6.67915 4.66675 6.40449 4.78098 6.17602 5.00946C5.94755 5.23793 5.83331 5.51258 5.83331 5.83342C5.83331 6.15425 5.94755 6.4289 6.17602 6.65737C6.40449 6.88585 6.67915 7.00008 6.99998 7.00008ZM6.99998 12.8334C5.4347 11.5015 4.2656 10.2643 3.49269 9.12196C2.71977 7.9796 2.33331 6.9223 2.33331 5.95008C2.33331 4.49175 2.80241 3.32994 3.7406 2.46466C4.6788 1.59939 5.76526 1.16675 6.99998 1.16675C8.2347 1.16675 9.32116 1.59939 10.2594 2.46466C11.1975 3.32994 11.6666 4.49175 11.6666 5.95008C11.6666 6.9223 11.2802 7.9796 10.5073 9.12196C9.73435 10.2643 8.56526 11.5015 6.99998 12.8334Z" />
    </svg>
  );
}

export function ChevronLeftSmallIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 8 13"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.13395 11.91L6.07295 12.97L0.29395 7.193C0.200796 7.10043 0.126867 6.99036 0.0764193 6.86911C0.0259713 6.74786 0 6.61783 0 6.4865C0 6.35517 0.0259713 6.22514 0.0764193 6.10389C0.126867 5.98264 0.200796 5.87257 0.29395 5.78L6.07295 0L7.13295 1.06L1.70895 6.485L7.13395 11.91Z" />
    </svg>
  );
}

export function ChevronRightSmallIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 8 13"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 11.91L1.061 12.97L6.84 7.193C6.933 7.10043 7.007 6.99036 7.058 6.86911C7.108 6.74786 7.134 6.61783 7.134 6.4865C7.134 6.35517 7.108 6.22514 7.058 6.10389C7.007 5.98264 6.933 5.87257 6.84 5.78L1.061 0L0.001 1.06L5.425 6.485L0 11.91Z" />
    </svg>
  );
}


export function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 15"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 14.0644C12.418 14.0644 16 10.916 16 7.03222C16 3.14842 12.418 0 8 0C3.582 0 0 3.14842 0 7.03222C0 8.80031 0.743 10.4177 1.97 11.6534C1.873 12.6741 1.553 13.7932 1.199 14.633C1.12 14.8199 1.273 15.0288 1.472 14.9967C3.728 14.625 5.069 14.0544 5.652 13.757C6.41777 13.9629 7.20727 14.0663 8 14.0644Z" />
    </svg>
  );
}


export function alarm({ className }: { className?: string }) {
  return (
    <svg
  width="16"
  height="20"
  viewBox="0 0 405 509"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="
      M183 88
      V72
      C183 53 198 38 218 38
      C237 38 253 53 253 72
      V88
      Z
    "
    fill="#191D1D"
  />

  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="
      M80 220
      C80 157 124 103 183 88
      C194 85 206 83 218 83
      C230 83 242 85 253 88
      C313 103 357 157 357 220

      V384
      H403
      V431
      H34
      V384
      H80
      Z

      M126 220
      V384
      H310
      V220

      C310 170 269 130 218 130
      C167 130 126 170 126 220
      Z
    "
    fill="#191D1D"
  />

  <path
    d="
      M172 453
      H264
      C264 479 244 499 218 499
      C192 499 172 479 172 453
      Z
    "
    fill="#191D1D"
  />
</svg>
  );
}

export function call_end({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.00001 4.66675C8.14723 4.66675 9.27744 4.89765 10.3906 5.35946C11.5038 5.82126 12.4931 6.51397 13.3583 7.43758C13.475 7.55425 13.5333 7.69036 13.5333 7.84591C13.5333 8.00147 13.475 8.13758 13.3583 8.25425L12.0167 9.56675C11.9097 9.67369 11.7858 9.73203 11.6448 9.74175C11.5038 9.75147 11.375 9.71258 11.2583 9.62508L9.56668 8.34175C9.4889 8.28341 9.43056 8.21536 9.39167 8.13758C9.35279 8.0598 9.33334 7.9723 9.33334 7.87508V6.21258C8.9639 6.09591 8.58473 6.00355 8.19584 5.9355C7.80695 5.86744 7.40834 5.83341 7.00001 5.83341C6.59167 5.83341 6.19306 5.86744 5.80417 5.9355C5.41529 6.00355 5.03612 6.09591 4.66667 6.21258V7.87508C4.66667 7.9723 4.64723 8.0598 4.60834 8.13758C4.56945 8.21536 4.51112 8.28341 4.43334 8.34175L2.74167 9.62508C2.62501 9.71258 2.49619 9.75147 2.35522 9.74175C2.21424 9.73203 2.09029 9.67369 1.98334 9.56675L0.641675 8.25425C0.525008 8.13758 0.466675 8.00147 0.466675 7.84591C0.466675 7.69036 0.525008 7.55425 0.641675 7.43758C1.49723 6.51397 2.48404 5.82126 3.60209 5.35946C4.72015 4.89765 5.85279 4.66675 7.00001 4.66675Z" />
    </svg>
  );
}

export function location_on({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.72 11.11 7.01 11.36a1.5 1.5 0 0 0 1.98 0C13.28 21.11 20 15.25 20 10c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

export function notifications({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9v6l-2 2v1h18v-1l-2-2V9c0-3.87-3.13-7-7-7z" />
      <path d="M9 18a3 3 0 0 0 6 0H9z" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`font-extrabold text-2xl tracking-tight text-[#171B1C] ${className ?? ''}`}>
      AMOA.
    </span>
  );
}

export function star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="#FF1B82"
      stroke="none"
    >
      <path d="M12 2.5c.5 0 .96.31 1.14.79l1.94 5.19 5.53.35c.51.03.95.37 1.11.86.16.49 0 1.03-.4 1.35l-4.31 3.48 1.5 5.35c.14.5-.04 1.03-.46 1.34-.42.31-.98.32-1.41.03L12 17.9l-4.64 3.04c-.43.29-.99.28-1.41-.03-.42-.31-.6-.84-.46-1.34l1.5-5.35-4.31-3.48c-.4-.32-.56-.86-.4-1.35.16-.49.6-.83 1.11-.86l5.53-.35 1.94-5.19c.18-.48.64-.79 1.14-.79z" />
    </svg>
  );
}

export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
  width="23"
  height="23"
  viewBox="0 0 160 162"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="
      M34 64
      C34 58.5 36.4 53.3 40.6 49.7
      L68.4 25.8
      C78.6 17 93.4 17 103.6 25.8
      L131.4 49.7
      C135.6 53.3 138 58.5 138 64
      V111
      C138 126.5 125.5 139 110 139
      H62
      C46.5 139 34 126.5 34 111
      V64
      Z
    "
    fill="none"
    stroke="#1B1F20"
    stroke-width="13"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <path
    d="M75 114.5H99"
    fill="none"
    stroke="#1B1F20"
    stroke-width="10"
    stroke-linecap="round"
  />
</svg>
  );
}

export function NavSearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function ChevronRightThinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12L10 8L6 4"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}