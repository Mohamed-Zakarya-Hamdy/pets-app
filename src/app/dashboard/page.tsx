"use client";

import { useEffect, useState, useCallback } from "react";
import { PetstoreAPI } from "@/lib/api";
import { Pet } from "@/types/pet";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    available: 0,
    pending: 0,
    sold: 0,
    total: 0
  });
  const [recentPets, setRecentPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [availablePets, pendingPets, soldPets] = await Promise.all([
        PetstoreAPI.getPetsByStatus('available'),
        PetstoreAPI.getPetsByStatus('pending'),
        PetstoreAPI.getPetsByStatus('sold')
      ]);

      setStats({
        available: availablePets.length,
        pending: pendingPets.length,
        sold: soldPets.length,
        total: availablePets.length + pendingPets.length + soldPets.length
      });

      // Get recent pets (first 6 from available)
      setRecentPets(availablePets.slice(0, 6));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-amber-50 rounded-3xl opacity-50"></div>
        <div className="relative z-10 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            🐾 Welcome to{" "}
            <span className="bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent">
              Bless Pets
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your pet store inventory with our modern, intuitive platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200">
              <span className="text-3xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-3xl font-bold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-red-200">
              <span className="text-3xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sold</p>
              <p className="text-3xl font-bold text-gray-900">{stats.sold}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200">
              <span className="text-3xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/pets"
            className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:border-green-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🐕</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                  View All Pets
                </h3>
                <p className="text-gray-600">Browse and manage pets</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/pets/add"
            className="group p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl hover:from-amber-100 hover:to-amber-200 transition-all duration-300 border border-amber-200 hover:border-amber-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">➕</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                  Add New Pet
                </h3>
                <p className="text-gray-600">Register a new pet</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/pets"
            className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:border-blue-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔍</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                  Search Pets
                </h3>
                <p className="text-gray-600">Find specific pets</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Recent Pets</h2>
          <Link
            href="/dashboard/pets"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All →
          </Link>
        </div>
        
        {recentPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPets.map((pet, index) => (
              <div key={`${pet.id || 'unknown'}-${index}`} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-amber-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🐾</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{pet.name || 'Unnamed Pet'}</h3>
                    <p className="text-sm text-gray-600 capitalize">{pet.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-amber-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🐾</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              No pets available yet
            </h3>
            <Link
              href="/dashboard/pets/add"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Add your first pet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
