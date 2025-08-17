"use client";

import { useEffect } from "react";

export default function LoginError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Login route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-md shadow max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-3">Something went wrong</h2>
        <p className="text-sm text-gray-600 mb-4">
          {error?.message || "An unexpected error occurred."}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => reset?.()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.assign("/")}
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
          >
            Go Home
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          If the issue persists, please check the developer console for details.
        </p>
      </div>
    </div>
  );
}
