import { Pet, PetFormData } from '@/types/pet';

const BASE_URL = 'https://petstore.swagger.io/v2';

export class PetstoreAPI {
  // Get pets by status
  static async getPetsByStatus(status: 'available' | 'pending' | 'sold' = 'available'): Promise<Pet[]> {
    console.log(`API: Fetching pets with status: ${status}`);
    
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`API: Attempt ${attempt}/${maxRetries} to fetch pets with status: ${status}`);
        
        const response = await fetch(`${BASE_URL}/pet/findByStatus?status=${status}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const petsData = await response.json();
        console.log(`API: Successfully fetched ${petsData.length} pets with status ${status} after ${attempt} attempt(s)`);
        return petsData;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`API: Attempt ${attempt} failed:`, error);
        
      
        if (attempt === maxRetries) {
          break;
        }

        const delay = 1000;
        console.log(`API: Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
   
    console.error('API: All attempts to fetch pets failed');
    throw lastError || new Error('Failed to fetch pets after multiple attempts');
  }

  // Get pet by ID
  static async getPetById(id: number): Promise<Pet> {
    console.log('API: Fetching pet with ID:', id);
    
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`API: Attempt ${attempt}/${maxRetries} to fetch pet with ID:`, id);
        
        const response = await fetch(`${BASE_URL}/pet/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Pet with ID ${id} not found`);
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const petData = await response.json();
        console.log('API: Pet data received:', petData);
        
        if (!petData) {
          throw new Error('No pet data received from API');
        }
        
        
        if (petData.id === undefined || petData.id === null) {
          throw new Error('Pet ID is missing from API response');
        }
        
    
        console.log(`API: Successfully fetched pet after ${attempt} attempt(s)`);
        return petData;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`API: Attempt ${attempt} failed:`, error);
        
      
        if (attempt === maxRetries) {
          break;
        }
        
    
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`API: Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error('API: All attempts to fetch pet failed');
    throw lastError || new Error('Failed to fetch pet after multiple attempts');
  }

  // Create new pet
  static async createPet(petData: PetFormData): Promise<Pet> {
    const response = await fetch(`${BASE_URL}/pet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });
    if (!response.ok) {
      throw new Error('Failed to create pet');
    }
    return response.json();
  }

  // Update pet
  static async updatePet(petData: Pet): Promise<Pet> {
    const response = await fetch(`${BASE_URL}/pet`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });
    if (!response.ok) {
      throw new Error('Failed to update pet');
    }
    return response.json();
  }

  // Delete pet
  static async deletePet(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/pet/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete pet');
    }
  }

  // Upload pet image
  static async uploadPetImage(petId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/pet/${petId}/uploadImage`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    return response.json();
  }
}
