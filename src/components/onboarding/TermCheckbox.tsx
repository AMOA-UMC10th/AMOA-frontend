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
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
        checked ? 'bg-[#F70071] border-[#F70071]' : 'bg-white border-[#ADB0B5]'
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

function splitLabel(label: string) {
  const match = label.match(/^(.*?)(\s*\(.*\))$/);
  if (!match) return { main: label, suffix: '' };
  return { main: match[1], suffix: match[2] };
}

export default function TermCheckbox({ term, onToggle }: TermCheckboxProps) {
  const { main, suffix } = splitLabel(term.label);
  const suffixColor = term.required ? 'text-[#28323C]' : 'text-[#646F7C]';

  return (
    <div className="flex items-center gap-3 py-2.5">
      <button onClick={() => onToggle(term.id)} aria-label="약관 동의 체크">
        <CheckIcon checked={term.checked} />
      </button>
      <div className="flex-1">
        <TermDetailLink
          label={
            <>
              <span className="text-sm font-bold text-[#28323C]">{main}</span>
              <span className={`text-sm font-bold ${suffixColor}`}>
                {suffix}
              </span>
            </>
          }
          content={term.detailContent}
        />
      </div>
    </div>
  );
}
