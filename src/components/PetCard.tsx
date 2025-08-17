"use client";

import { Pet } from '@/types/pet';
import Link from 'next/link';
import { useState } from 'react';

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✅';
      case 'pending':
        return '⏳';
      case 'sold':
        return '💰';
      default:
        return '❓';
    }
  };

  return (
    <div className="card-hover group">
      <div className="relative h-56 bg-gradient-to-br from-emerald-50 to-amber-50 overflow-hidden">
        {pet.photoUrls && pet.photoUrls.length > 0 && !imageError ? (
          <img
            src={pet.photoUrls[0]}
            alt={pet.name || 'Pet'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-amber-100">
            <span className="text-6xl">🐾</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(pet.status)}`}>
            {getStatusIcon(pet.status)} {pet.status}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-200">
          {pet.name || 'Unnamed Pet'}
        </h3>
        
        {pet.category && pet.category.name && (
          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            {pet.category.name}
          </p>
        )}

        {pet.tags && pet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {pet.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag.id || index}-${index}`}
                className="inline-block bg-gradient-to-r from-green-50 to-amber-50 text-green-700 text-xs px-3 py-1.5 rounded-full border border-green-200 font-medium"
              >
                {tag.name || 'Unnamed Tag'}
              </span>
            ))}
            {pet.tags.length > 3 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1.5 rounded-full">
                +{pet.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            ID: {pet.id || 'N/A'}
          </span>
          
          <Link
            href={`/dashboard/pets/${pet.id}`}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Details
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
