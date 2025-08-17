"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PetstoreAPI } from "@/lib/api";
import { Pet } from "@/types/pet";
import Loader from "@/components/Loader";

export default function PetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Pet>>({});

  const petId = Number(params.id);

  const fetchPet = async () => {
    try {
      console.log('Fetching pet with ID:', petId);
      const petData = await PetstoreAPI.getPetById(petId);
      console.log('Pet data received:', petData);
      
      if (!petData) {
        throw new Error('No pet data received');
      }
      
      if (petData.id === undefined || petData.id === null) {
        throw new Error('Pet ID is missing from API response');
      }
      
      setPet(petData);
      setEditForm(petData);
      setError(""); 
    } catch (err) {
      console.error('Error fetching pet:', err);
      
      if (err instanceof Error) {
        if (err.message.includes('Pet with ID') && err.message.includes('not found')) {
          setError(`Pet with ID ${petId} not found. Please check the ID and try again.`);
        } else if (err.message.includes('Failed to fetch pet after multiple attempts')) {
          setError("API is temporarily unavailable. Please try again in a few moments.");
        } else {
          setError(err.message || "Failed to fetch pet data");
        }
      } else {
        setError("An unexpected error occurred while fetching pet data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (petId && !isNaN(petId)) {
      fetchPet();
    } else {
      setError("Invalid pet ID");
      setLoading(false);
    }
  }, [petId]);

  const handleUpdate = async () => {
    if (!pet) return;

    try {
      console.log('Updating pet with data:', { ...pet, ...editForm });
      const updatedPet = await PetstoreAPI.updatePet({
        ...pet,
        ...editForm
      });
      console.log('Pet updated successfully:', updatedPet);
      
      setPet(updatedPet);
      setIsEditing(false);
      setError(""); 
      
      setTimeout(() => {
        router.push("/dashboard/pets?refresh=true");
      }, 1000);
    } catch (err) {
      console.error('Error updating pet:', err);
      setError("Failed to update pet. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!pet || !confirm("Are you sure you want to delete this pet?")) return;

    try {
      await PetstoreAPI.deletePet(pet.id!);
      router.push("/dashboard/pets");
    } catch (err) {
      setError("Failed to delete pet");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">❌</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {error || "Pet not found"}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {error?.includes('API is temporarily unavailable') 
            ? "The API is experiencing temporary issues. Please try again."
            : "There was an error loading the pet data."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              fetchPet();
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <span className="mr-2">🔄</span>
            Retry
          </button>
          <button
            onClick={() => router.push("/dashboard/pets")}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            ← Back to Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/dashboard/pets")}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <span className="mr-2">←</span>
            Back to Pets
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Pet" : (pet.name || 'Unnamed Pet')}
          </h1>
          
          {!isEditing && !error && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span className="text-green-800 text-sm">
                  Pet updated successfully! Redirecting to pets list...
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit Pet
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete Pet
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm(pet);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Photos</h2>
          {pet.photoUrls && pet.photoUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {pet.photoUrls.map((url, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`${pet.name} photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='24'%3E🐾%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🐾</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{pet.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={editForm.status || ""}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(pet.status)}`}>
                    {pet.status}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet ID
                </label>
                <p className="text-lg text-gray-900">{pet.id}</p>
              </div>

              {pet.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.category?.name || ""}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        category: { ...editForm.category, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{pet.category.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {pet.tags && pet.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {pet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
