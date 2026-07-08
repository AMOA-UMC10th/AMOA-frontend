//A106 필수/선택 약관 체크박스 목록

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

export default function TermCheckbox({ term, onToggle }: TermCheckboxProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={term.checked}
          onChange={() => onToggle(term.id)}
        />
        <span>
          {term.required ? '[필수] ' : '[선택] '}
          {term.label}
        </span>
      </label>
      <TermDetailLink title={term.label} content={term.detailContent} />
    </div>
  );
}
