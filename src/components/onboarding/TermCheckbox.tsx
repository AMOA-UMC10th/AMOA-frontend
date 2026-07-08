import TermDetailLink from './TermDetailLink';

interface Term {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  detailContent: string;
}

interface TermCheckboxProps {
  term: Term;
  onToggle: (id: string) => void;
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
        checked ? 'bg-[#000000]' : 'bg-[#E9EBEE]'
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke={checked ? '#FFFFFF' : '#ADB0B5'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function TermCheckbox({ term, onToggle }: TermCheckboxProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <button onClick={() => onToggle(term.id)} aria-label="약관 동의 체크">
        <CheckIcon checked={term.checked} />
      </button>
      <div className="flex-1">
        <TermDetailLink label={term.label} content={term.detailContent} />
      </div>
    </div>
  );
}
