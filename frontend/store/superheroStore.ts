import { create } from 'zustand';
import {
  Superhero,
  SuperheroListItem,
  CreateSuperheroData,
  UpdateSuperheroData,
  SuperheroListResponse,
  SuperheroResponse,
} from '@/types/superhero';
import { API_CONFIG, PAGINATION_CONFIG } from '@/lib/constants';
import { createFormData, extractErrorMessage } from '@/lib/utils';

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
      const errorMessage =
        errorData.error ||
        errorData.message ||
        `HTTP error! status: ${response.status}`;
      const details = errorData.details
        ? errorData.details
            .map(
              (d: { field: string; message: string }) =>
                `${d.field}: ${d.message}`
            )
            .join(', ')
        : '';
      throw new Error(details ? `${errorMessage} - ${details}` : errorMessage);
    }

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
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
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,

  fetchSuperheroes: async (
    page = PAGINATION_CONFIG.DEFAULT_PAGE,
    limit = PAGINATION_CONFIG.DEFAULT_LIMIT
  ) => {
    await handleApiCall(
      () =>
        fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPERHEROES}?page=${page}&limit=${limit}`
        ),
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
      () =>
        fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPERHEROES}/${id}`
        ),
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
        const formData = createFormData(
          {
            nickname: data.nickname,
            realName: data.realName,
            originDescription: data.originDescription,
            superpowers: data.superpowers,
            catchPhrase: data.catchPhrase,
          },
          data.images ? Array.from(data.images) : undefined
        );

        return fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPERHEROES}`,
          {
            method: 'POST',
            body: formData,
          }
        );
      },
      () => {
        const { pagination } = get();
        get().fetchSuperheroes(pagination.page, pagination.limit);
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
        if (data.originDescription)
          updatePayload.originDescription = data.originDescription;
        if (data.superpowers) updatePayload.superpowers = data.superpowers;
        if (data.catchPhrase) updatePayload.catchPhrase = data.catchPhrase;

        return fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPERHEROES}/${data.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload),
          }
        );
      },
      async (response: SuperheroResponse) => {
        if (data.images && data.images.length > 0) {
          const formData = createFormData({}, Array.from(data.images));

          try {
            const imageResponse = await fetch(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPERHEROES}/${data.id}${API_CONFIG.ENDPOINTS.IMAGES}`,
              {
                method: 'POST',
                body: formData,
              }
            );

            if (!imageResponse.ok) {
              throw new Error('Failed to upload images');
            }
          } catch (error) {
            console.error('Error uploading images:', error);
          }
        }

        const updatedResponse = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPERHEROES}/${data.id}`
        );
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          set({ currentSuperhero: updatedData.data });
        } else {
          set({ currentSuperhero: response.data });
        }

        const { pagination } = get();
        get().fetchSuperheroes(pagination.page, pagination.limit);
      },
      (loading) => set({ loading }),
      (error) => set({ error })
    );
  },

  deleteSuperhero: async (id: string) => {
    await handleApiCall(
      () =>
        fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPERHEROES}/${id}`,
          {
            method: 'DELETE',
          }
        ),
      () => {
        set({ currentSuperhero: null });
        const { pagination } = get();
        get().fetchSuperheroes(pagination.page, pagination.limit);
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
