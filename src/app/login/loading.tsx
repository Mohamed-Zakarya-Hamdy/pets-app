export default function LoginLoading() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <div className="animate-pulse h-8 w-40 bg-gray-200 rounded mb-4" />
        <p className="text-sm text-gray-500">Loading login page...</p>
      </div>
    </div>
  );
}
