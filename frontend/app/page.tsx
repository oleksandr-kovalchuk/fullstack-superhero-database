'use client';

import { useEffect, useState } from 'react';
import { useSuperheroStore } from '@/store/superheroStore';
import { Superhero } from '@/types/superhero';
import { SuperheroCard } from '@/components/SuperheroCard';
import { SuperheroForm } from '@/components/SuperheroForm';
import { SuperheroDetail } from '@/components/SuperheroDetail';
import { Pagination } from '@/components/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

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
    setCurrentSuperhero,
    setError,
  } = useSuperheroStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSuperheroes();
  }, [fetchSuperheroes]);

  const handlePageChange = (page: number) => {
    fetchSuperheroes(page, pagination.limit);
  };

  const handleCreateSuperhero = async (data: any) => {
    await createSuperhero(data);
    setViewMode('list');
  };

  const handleUpdateSuperhero = async (data: any) => {
    if (currentSuperhero) {
      await updateSuperhero({ ...data, id: currentSuperhero.id });
      setViewMode('detail');
    }
  };

  const handleViewSuperhero = (superhero: Superhero) => {
    setCurrentSuperhero(superhero);
    setViewMode('detail');
  };

  const handleEditSuperhero = (superhero: Superhero) => {
    setCurrentSuperhero(superhero);
    setViewMode('edit');
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
      if (viewMode === 'detail' && currentSuperhero?.id === deleteId) {
        setViewMode('list');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'detail':
        return currentSuperhero ? (
          <SuperheroDetail
            superhero={currentSuperhero}
            onEdit={() => setViewMode('edit')}
            onDelete={() => confirmDelete(currentSuperhero.id)}
            onClose={() => setViewMode('list')}
          />
        ) : null;

      case 'create':
      case 'edit':
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {viewMode === 'create'
                ? 'Create New Superhero'
                : 'Edit Superhero'}
            </h1>
            <SuperheroForm
              superhero={viewMode === 'edit' ? currentSuperhero : null}
              onSubmit={
                viewMode === 'create'
                  ? handleCreateSuperhero
                  : handleUpdateSuperhero
              }
              onCancel={() =>
                setViewMode(viewMode === 'edit' ? 'detail' : 'list')
              }
              loading={loading}
            />
          </div>
        );

      default:
        return (
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
              <Button onClick={() => setViewMode('create')}>
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
                  <Button onClick={() => setViewMode('create')}>
                    Create New Superhero
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {superheroes?.map((superhero) => (
                    <SuperheroCard
                      key={superhero.id}
                      superhero={superhero}
                      onView={handleViewSuperhero}
                      onEdit={handleEditSuperhero}
                      onDelete={confirmDelete}
                    />
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        {renderContent()}

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
