
const ART_TYPES = [
  { label: '전체', value: 'ALL' },
  { label: '이달의 아트', value: 'MONTHLY' },
  { label: '지난달 아트', value: 'LAST_MONTHLY' },
  { label: '이벤트 아트', value: 'EVENT' },
  { label: '원컬러', value: 'ONE_COLOR' },
];

interface ArtTypeFilterProps {
  selectedType: string;
  onChangeType: (type: string) => void;
}

export default function ArtTypeFilter({
  selectedType,
  onChangeType,
}: ArtTypeFilterProps) {
  return (
    <div className="py-2">
      <h3 className="text-sm font-bold text-[#1d2026] mb-3.5">아트</h3>

      <div className="flex flex-wrap gap-2">
        {ART_TYPES.map((type) => {
          const isSelected = selectedType === type.value;
          return (
           <button
            key={type.value}
            type="button"
            onClick={() => onChangeType(type.value)}
            className={`flex h-8 items-center justify-center rounded-full border px-3 text-xs transition-all ${
              isSelected
                ? 'border-[#FF007A] bg-[#FF007A] text-white'
                : 'border-[#ced4da] bg-white text-[#56606d] hover:bg-gray-50'
            }`}
          >
            {type.label}
          </button>
          );
        })}
      </div>
    </div>
  );
}