
const DESIGN_STYLES = [
  '청순',
  '시크',
  '아기자기',
  '화려',
  '스트릿',
  '유니크',
  '내추럴',
];

interface DesignFilterProps {
  selectedDesigns: string[];
  onToggleDesign: (design: string) => void;
}

export default function DesignFilter({
  selectedDesigns,
  onToggleDesign,
}: DesignFilterProps) {
  const isAllSelected = selectedDesigns.length === 0;

  return (
    <div className="py-2">
      <h3 className="text-sm font-bold text-[#1d2026] mb-3.5">디자인</h3>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (!isAllSelected) {
              selectedDesigns.forEach((d) => onToggleDesign(d));
            }
          }}
          className={`flex h-8 items-center justify-center rounded-full border px-3 text-xs  transition-all ${
          isAllSelected
            ? 'border-[#FF007A] bg-[#FF007A] text-white'
            : 'border-[#ced4da] bg-white text-[#495057] hover:bg-gray-50'
        }`}
        >
          전체
        </button>

        {DESIGN_STYLES.map((design) => {
          const isSelected = selectedDesigns.includes(design);
          return (
            <button
            key={design}
            type="button"
            onClick={() => onToggleDesign(design)}
            className={`flex h-8 items-center justify-center rounded-full border px-3 text-xs transition-all ${
              isSelected
                ? 'border-[#FF007A] bg-[#FF007A] text-white'
                : 'border-[#ced4da] bg-white text-[#56606d] hover:bg-gray-50'
            }`}
          >
            {design}
          </button>
          );
        })}
      </div>
    </div>
  );
} 