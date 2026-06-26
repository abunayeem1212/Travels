export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center
      text-gray-400 gap-3">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500
        rounded-full animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  );
}