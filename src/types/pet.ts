export interface Pet {
  id: number;
  category?: {
    id?: number;
    name?: string;
  };
  name?: string;
  photoUrls: string[];
  tags?: {
    id?: number;
    name?: string;
  }[];
  status: 'available' | 'pending' | 'sold';
}

export interface PetFormData {
  name: string;
  status: 'available' | 'pending' | 'sold';
  photoUrls: string[];
  category?: {
    id?: number;
    name?: string;
  };
  tags?: {
    id?: number;
    name?: string;
  }[];
}
