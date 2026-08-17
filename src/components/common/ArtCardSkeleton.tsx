// ArtCard 로딩 스켈레톤 (화면설계서 "홈 스켈레톤" 참고)

export default function ArtCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="relative w-full aspect-[18/25] overflow-hidden bg-[#E9EBEE]" />

      <div className="mt-2.5 px-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-12 rounded bg-[#E9EBEE]" />
          <div className="h-4 w-4 rounded-full bg-[#E9EBEE]" />
        </div>

        <div className="mt-1.5 h-4 w-3/4 rounded bg-[#E9EBEE]" />
        <div className="mt-1.5 h-3 w-1/2 rounded bg-[#E9EBEE]" />
      </div>
    </div>
  );
}
