export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
      shadow-md animate-pulse">
      <div className="h-52 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
}