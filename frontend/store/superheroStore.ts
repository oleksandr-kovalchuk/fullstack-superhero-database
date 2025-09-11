import { create } from 'zustand';
import {
  Superhero,
  SuperheroListItem,
  CreateSuperheroData,
  UpdateSuperheroData,
  SuperheroListResponse,
  SuperheroResponse,
} from '@/types/superhero';

interface SuperheroState {
  superheroes: SuperheroListItem[];
  currentSuperhero: Superhero | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  loading: boolean;
  error: string | null;
}

interface SuperheroActions {
  fetchSuperheroes: (page?: number, limit?: number) => Promise<void>;
  fetchSuperheroById: (id: string) => Promise<void>;
  createSuperhero: (data: CreateSuperheroData) => Promise<void>;
  updateSuperhero: (data: UpdateSuperheroData) => Promise<void>;
  deleteSuperhero: (id: string) => Promise<void>;
  setCurrentSuperhero: (superhero: Superhero | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

type SuperheroStore = SuperheroState & SuperheroActions;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const handleApiCall = async <T>(
  apiCall: () => Promise<Response>,
  onSuccess: (data: T) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);
    const response = await apiCall();

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
        const details = errorData.details ? errorData.details.map((d: { field: string; message: string }) => `${d.field}: ${d.message}`).join(', ') : '';
        throw new Error(details ? `${errorMessage} - ${details}` : errorMessage);
    }

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    setError(errorMessage);
    console.error('API Error:', error);
  } finally {
    setLoading(false);
  }
};

export const useSuperheroStore = create<SuperheroStore>((set, get) => ({
  superheroes: [],
  currentSuperhero: null,
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,

  fetchSuperheroes: async (page = 1, limit = 5) => {
    await handleApiCall(
      () => fetch(`${API_BASE_URL}/superheroes?page=${page}&limit=${limit}`),
      (response: SuperheroListResponse) => {
        set({
          superheroes: response.data,
          pagination: response.pagination,
        });
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  fetchSuperheroById: async (id: string) => {
    await handleApiCall(
      () => fetch(`${API_BASE_URL}/superheroes/${id}`),
      (response: SuperheroResponse) => {
        set({ currentSuperhero: response.data });
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  createSuperhero: async (data: CreateSuperheroData) => {
    await handleApiCall(
      () => {
        const formData = new FormData();
        formData.append('nickname', data.nickname);
        formData.append('realName', data.realName);
        formData.append('originDescription', data.originDescription);
        formData.append('superpowers', data.superpowers);
        formData.append('catchPhrase', data.catchPhrase);
        
        if (data.images && data.images.length > 0) {
          Array.from(data.images).forEach((file) => {
            formData.append('images', file);
          });
        }

        return fetch(`${API_BASE_URL}/superheroes`, {
          method: 'POST',
          body: formData,
        });
      },
      () => {
        // Refresh the list to get updated data
        get().fetchSuperheroes(get().pagination.page, get().pagination.limit);
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  updateSuperhero: async (data: UpdateSuperheroData) => {
    await handleApiCall(
      () => {
        const updatePayload: Partial<Omit<CreateSuperheroData, 'images'>> = {};
        if (data.nickname) updatePayload.nickname = data.nickname;
        if (data.realName) updatePayload.realName = data.realName;
        if (data.originDescription) updatePayload.originDescription = data.originDescription;
        if (data.superpowers) updatePayload.superpowers = data.superpowers;
        if (data.catchPhrase) updatePayload.catchPhrase = data.catchPhrase;

        return fetch(`${API_BASE_URL}/superheroes/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload),
        });
      },
      async (response: SuperheroResponse) => {
        // If there are images to upload, handle them separately
        if (data.images && data.images.length > 0) {
          const formData = new FormData();
          Array.from(data.images).forEach((file) => {
            formData.append('images', file);
          });

          try {
            const imageResponse = await fetch(`${API_BASE_URL}/superheroes/${data.id}/images`, {
              method: 'POST',
              body: formData,
            });

            if (!imageResponse.ok) {
              throw new Error('Failed to upload images');
            }
          } catch (error) {
            console.error('Error uploading images:', error);
            // Continue with the update even if image upload fails
          }
        }

        // Fetch the updated superhero with all images
        const updatedResponse = await fetch(`${API_BASE_URL}/superheroes/${data.id}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          set({ currentSuperhero: updatedData.data });
        } else {
          set({ currentSuperhero: response.data });
        }
        
        // Refresh the list to get updated data
        get().fetchSuperheroes(get().pagination.page, get().pagination.limit);
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  deleteSuperhero: async (id: string) => {
    await handleApiCall(
      () =>
        fetch(`${API_BASE_URL}/superheroes/${id}`, {
          method: 'DELETE',
        }),
      () => {
        set({ currentSuperhero: null });
        // Refresh the list to get updated data
        get().fetchSuperheroes(get().pagination.page, get().pagination.limit);
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  setCurrentSuperhero: (superhero: Superhero | null) => {
    set({ currentSuperhero: superhero });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));
