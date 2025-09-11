import { create } from 'zustand';
import {
  Superhero,
  CreateSuperheroData,
  UpdateSuperheroData,
  SuperheroListResponse,
} from '@/types/superhero';

interface SuperheroState {
  superheroes: Superhero[];
  currentSuperhero: Superhero | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
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
  },
  loading: false,
  error: null,

  fetchSuperheroes: async (page = 1, limit = 5) => {
    await handleApiCall(
      () => fetch(`${API_BASE_URL}/superheroes?page=${page}&limit=${limit}`),
      (data: SuperheroListResponse) => {
        set({
          superheroes: data.superheroes,
          pagination: data.pagination,
        });
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  fetchSuperheroById: async (id: string) => {
    await handleApiCall(
      () => fetch(`${API_BASE_URL}/superheroes/${id}`),
      (data: Superhero) => {
        set({ currentSuperhero: data });
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  createSuperhero: async (data: CreateSuperheroData) => {
    await handleApiCall(
      () =>
        fetch(`${API_BASE_URL}/superheroes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
      (newSuperhero: Superhero) => {
        const { superheroes } = get();
        set({ superheroes: [newSuperhero, ...superheroes] });
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  updateSuperhero: async (data: UpdateSuperheroData) => {
    await handleApiCall(
      () =>
        fetch(`${API_BASE_URL}/superheroes/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
      (updatedSuperhero: Superhero) => {
        const { superheroes } = get();
        set({
          superheroes: superheroes.map((hero) =>
            hero.id === updatedSuperhero.id ? updatedSuperhero : hero
          ),
          currentSuperhero: updatedSuperhero,
        });
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
        const { superheroes } = get();
        set({
          superheroes: superheroes.filter((hero) => hero.id !== id),
          currentSuperhero: null,
        });
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
