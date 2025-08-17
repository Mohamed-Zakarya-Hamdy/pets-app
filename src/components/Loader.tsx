export default function Loader() {
  return (
    <div className="flex items-center justify-center space-x-3">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-emerald-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-lg text-gray-600 font-medium">Loading...</span>
    </div>
  );
}
