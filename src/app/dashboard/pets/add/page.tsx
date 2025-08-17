"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PetstoreAPI } from "@/lib/api";
import { PetFormData } from "@/types/pet";
import Loader from "@/components/Loader";

export default function AddPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    status: "available",
    photoUrls: [""],
    category: { name: "" },
    tags: [{ name: "" }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanFormData = {
        ...formData,
        photoUrls: formData.photoUrls.filter(url => url.trim() !== ""),
        tags: formData.tags?.filter(tag => tag.name?.trim() !== "") || []
      };

      const newPet = await PetstoreAPI.createPet(cleanFormData);
      console.log('Pet created successfully:', newPet);
      
      setError(""); 
      setTimeout(() => {
        router.push("/dashboard/pets?refresh=true");
      }, 1000);
    } catch (err) {
      console.error('Error creating pet:', err);
      setError("Failed to create pet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addPhotoUrl = () => {
    setFormData({
      ...formData,
      photoUrls: [...formData.photoUrls, ""]
    });
  };

  const removePhotoUrl = (index: number) => {
    setFormData({
      ...formData,
      photoUrls: formData.photoUrls.filter((_, i) => i !== index)
    });
  };

  const updatePhotoUrl = (index: number, value: string) => {
    const newPhotoUrls = [...formData.photoUrls];
    newPhotoUrls[index] = value;
    setFormData({
      ...formData,
      photoUrls: newPhotoUrls
    });
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), { name: "" }]
    });
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index) || []
    });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...(formData.tags || [])];
    newTags[index] = { name: value };
    setFormData({
      ...formData,
      tags: newTags
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.push("/dashboard/pets")}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <span className="mr-2">←</span>
          Back to Pets
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Add New Pet</h1>
        <p className="text-gray-600 mt-2">
          Register a new pet to your store
        </p>
        
        {!loading && !error && formData.name && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              <span className="text-green-800 font-medium">
                Pet "{formData.name}" created successfully! Redirecting to pets list...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
     
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter pet name"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={formData.category?.name || ""}
              onChange={(e) => setFormData({ 
                ...formData, 
                category: { name: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Dogs, Cats, Birds"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo URLs
            </label>
            <div className="space-y-3">
              {formData.photoUrls.map((url, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updatePhotoUrl(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/pet-photo.jpg"
                  />
                  {formData.photoUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhotoUrl(index)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhotoUrl}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <span className="mr-2">➕</span>
                Add Photo URL
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {formData.tags?.map((tag, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={tag.name || ""}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Friendly, Playful, Trained"
                  />
                  {formData.tags && formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <span className="mr-2">➕</span>
                Add Tag
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/pets")}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader />
                </div>
              ) : (
                "Create Pet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
