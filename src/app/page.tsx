"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-4xl">🐾</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bless Pets
        </h1>
        <p className="text-gray-600 mb-8">
          Pet Store Management System
        </p>
        <Loader />
      </div>
    </div>
  );
}
