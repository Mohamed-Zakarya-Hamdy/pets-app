"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PetstoreAPI } from "@/lib/api";
import { Pet } from "@/types/pet";
import PetCard from "@/components/PetCard";
import Loader from "@/components/Loader";

export default function PetsPage() {
  const searchParams = useSearchParams();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'pending' | 'sold'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching pets...');
      
      // Fetch pets from all statuses
      const [availablePets, pendingPets, soldPets] = await Promise.all([
        PetstoreAPI.getPetsByStatus('available'),
        PetstoreAPI.getPetsByStatus('pending'),
        PetstoreAPI.getPetsByStatus('sold')
      ]);

      // Combine all pets and ensure unique IDs
      const allPets = [...availablePets, ...pendingPets, ...soldPets];
      
      // Remove duplicates based on ID and create unique keys
      const uniquePets = allPets.filter((pet, index, self) => 
        index === self.findIndex(p => p.id === pet.id)
      );

      console.log('Total pets fetched:', uniquePets.length);
      setPets(uniquePets);
      setFilteredPets(uniquePets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
      setFilteredPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Refresh pets when returning from add/edit pages
  useEffect(() => {
    const refresh = searchParams.get('refresh');
    if (refresh === 'true') {
      console.log('Refreshing pets list...');
      fetchPets();
      // Remove the refresh parameter from URL
      window.history.replaceState({}, '', '/dashboard/pets');
    }
  }, [searchParams, fetchPets]);

  useEffect(() => {
    let filtered = pets;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(pet => pet.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(pet => {
        // Safe checks for all properties
        const petName = pet.name?.toLowerCase() || '';
        const categoryName = pet.category?.name?.toLowerCase() || '';
        const tagNames = pet.tags?.map(tag => tag.name?.toLowerCase() || '').join(' ') || '';
        
        return petName.includes(searchLower) || 
               categoryName.includes(searchLower) || 
               tagNames.includes(searchLower);
      });
    }

    setFilteredPets(filtered);
  }, [pets, statusFilter, searchTerm]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const refreshPets = () => {
    fetchPets();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pets Management</h1>
          <p className="text-gray-600 mt-2">
            Browse and manage your pet inventory
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={refreshPets}
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <span className="mr-2">🔄</span>
            Refresh
          </button>
          <a
            href="/dashboard/pets/add"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <span className="mr-2">➕</span>
            Add New Pet
          </a>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Pets
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredPets.length} of {pets.length} pets
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Pets Grid */}
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet, index) => (
            <PetCard 
              key={`${pet.id || 'unknown'}-${index}`} 
              pet={pet} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🐾</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No pets found' : 'No pets available'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? `No pets match your current filters.`
              : 'Get started by adding your first pet to the store.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <a
              href="/dashboard/pets/add"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <span className="mr-2">➕</span>
              Add New Pet
            </a>
          )}
        </div>
      )}
    </div>
  );
}
