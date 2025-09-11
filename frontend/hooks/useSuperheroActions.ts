import { useCallback } from 'react';
import { useSuperheroStore } from '@/store/superheroStore';
import {
  SuperheroListItem,
  CreateSuperheroData,
  UpdateSuperheroData,
} from '@/types/superhero';

export const useSuperheroActions = () => {
  const {
    currentSuperhero,
    pagination,
    loading,
    error,
    fetchSuperheroes,
    fetchSuperheroById,
    createSuperhero,
    updateSuperhero,
    deleteSuperhero,
    setError,
  } = useSuperheroStore();

  const handlePageChange = useCallback(
    (page: number) => {
      fetchSuperheroes(page, pagination.limit);
    },
    [fetchSuperheroes, pagination.limit]
  );

  const handleCreateSuperhero = useCallback(
    async (data: CreateSuperheroData) => {
      await createSuperhero(data);
    },
    [createSuperhero]
  );

  const handleUpdateSuperhero = useCallback(
    async (data: CreateSuperheroData | UpdateSuperheroData) => {
      if (currentSuperhero) {
        await updateSuperhero({ ...data, id: currentSuperhero.id });
      }
    },
    [updateSuperhero, currentSuperhero]
  );

  const handleViewSuperhero = useCallback(
    async (superhero: SuperheroListItem) => {
      await fetchSuperheroById(superhero.id);
    },
    [fetchSuperheroById]
  );

  const handleEditSuperhero = useCallback(
    async (superhero: SuperheroListItem) => {
      await fetchSuperheroById(superhero.id);
    },
    [fetchSuperheroById]
  );

  const handleDeleteSuperhero = useCallback(
    async (id: string) => {
      await deleteSuperhero(id);
    },
    [deleteSuperhero]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    currentSuperhero,
    pagination,
    loading,
    error,
    handlePageChange,
    handleCreateSuperhero,
    handleUpdateSuperhero,
    handleViewSuperhero,
    handleEditSuperhero,
    handleDeleteSuperhero,
    clearError,
  };
};
