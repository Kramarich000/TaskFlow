import { BoardCardSkeleton } from '@features/boards';

export function BoardGridLoader({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 min-h-[256px]">
      {Array.from({ length: count }).map((_, index) => (
        <BoardCardSkeleton key={index} />
      ))}
    </div>
  );
}
