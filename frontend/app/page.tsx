'use client';

import { useEffect, useState } from 'react';
import { useSuperheroStore } from '@/store/superheroStore';
import {
  SuperheroListItem,
  CreateSuperheroData,
  UpdateSuperheroData,
} from '@/types/superhero';
import { SuperheroCard } from '@/components/SuperheroCard';
import { SuperheroForm } from '@/components/SuperheroForm';
import { Pagination } from '@/components/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { UI_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const {
    superheroes,
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

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('create');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSuperheroes();
  }, [fetchSuperheroes]);

  const handlePageChange = (page: number) => {
    fetchSuperheroes(page, pagination.limit);
  };

  const handleCreateSuperhero = async (data: CreateSuperheroData) => {
    await createSuperhero(data);
    setShowModal(false);
  };

  const handleUpdateSuperhero = async (
    data: CreateSuperheroData | UpdateSuperheroData
  ) => {
    if (currentSuperhero) {
      await updateSuperhero({ ...data, id: currentSuperhero.id });
      setModalMode('view');
    }
  };

  const handleViewSuperhero = async (superhero: SuperheroListItem) => {
    await fetchSuperheroById(superhero.id);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditSuperhero = async (superhero: SuperheroListItem) => {
    await fetchSuperheroById(superhero.id);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setModalMode('create');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteSuperhero = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      await deleteSuperhero(deleteId);
      setShowDeleteDialog(false);
      setDeleteId(null);
      if (modalMode === 'view' && currentSuperhero?.id === deleteId) {
        setShowModal(false);
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteFromModal = () => {
    if (currentSuperhero) {
      confirmDelete(currentSuperhero.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Superhero Database
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your collection of superheroes with full CRUD
                operations
              </p>
            </div>
            <Button onClick={handleCreateNew}>
              Create New Superhero
            </Button>
          </div>

          {loading && superheroes.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : superheroes?.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No superheroes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new superhero.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreateNew}>
                  Create New Superhero
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap justify-center gap-6">
                {superheroes?.map((superhero, index) => (
                  <div
                    key={superhero.id}
                    className="w-full sm:w-80 md:w-72 lg:w-80 xl:w-72"
                  >
                    <SuperheroCard
                      superhero={superhero}
                      onView={handleViewSuperhero}
                      onEdit={handleEditSuperhero}
                      onDelete={confirmDelete}
                      priority={index < UI_CONFIG.PRIORITY_IMAGES_COUNT}
                    />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          )}
        </div>

        <SuperheroForm
          isOpen={showModal}
          onClose={handleCloseModal}
          superhero={modalMode !== 'create' ? currentSuperhero : null}
          onSubmit={
            modalMode === 'create'
              ? handleCreateSuperhero
              : handleUpdateSuperhero
          }
          onDelete={handleDeleteFromModal}
          loading={loading}
          viewMode={modalMode}
        />

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setDeleteId(null);
          }}
          onConfirm={handleDeleteSuperhero}
          title="Delete Superhero"
          message="Are you sure you want to delete this superhero? This action cannot be undone."
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
