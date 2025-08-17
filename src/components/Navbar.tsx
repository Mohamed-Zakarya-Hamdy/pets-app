"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">b</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-800">Bless</span>
                <span className="text-xl font-bold text-green-600">Pets</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard/pets" 
              className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-green-50"
            >
              🐕 Pets
            </Link>
            <Link 
              href="/dashboard/pets/add" 
              className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-green-50"
            >
              ➕ Add Pet
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {user?.name}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

       
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

       
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-3">
              <Link 
                href="/dashboard/pets" 
                className="block px-3 py-2 text-gray-600 hover:text-green-600 rounded-lg text-sm font-medium transition-colors hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🐕 Pets
              </Link>
              <Link 
                href="/dashboard/pets/add" 
                className="block px-3 py-2 text-gray-600 hover:text-green-600 rounded-lg text-sm font-medium transition-colors hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ➕ Add Pet
              </Link>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user?.name}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
