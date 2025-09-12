import { useEffect } from 'react';
import { Superhero, CreateSuperheroData } from '../types/superhero';
import { Modal } from './ui/Modal';
import { SuperheroViewMode } from './SuperheroViewMode';
import { SuperheroEditMode } from './SuperheroEditMode';
import { useSuperheroForm } from '../hooks/useSuperheroForm';
import { useFileUpload } from '../hooks/useFileUpload';
import { getModalTitle, getModalSize } from '../lib/formUtils';

interface SuperheroFormProps {
  isOpen: boolean;
  onClose: () => void;
  superhero?: Superhero | null;
  onSubmit: (data: CreateSuperheroData) => Promise<void>;
  onDelete?: () => void;
  loading?: boolean;
  viewMode?: 'view' | 'edit' | 'create';
}

export const SuperheroForm = ({
  isOpen,
  onClose,
  superhero,
  onSubmit,
  onDelete,
  loading = false,
  viewMode = 'create',
}: SuperheroFormProps) => {
  const {
    formData,
    errors,
    currentViewMode,
    handleInputChange,
    handleSubmit: handleFormSubmit,
    resetForm,
    handleEdit,
    handleCancel,
  } = useSuperheroForm({ superhero, viewMode, onSubmit });

  const {
    selectedFiles,
    previewUrls,
    fileErrors,
    fileInputRef,
    handleFileChange,
    removeImage,
    resetFiles,
    getFileInputProps,
    getFileInfo,
  } = useFileUpload();

  useEffect(() => {
    if (!isOpen) {
      if (currentViewMode === 'create') {
        resetForm();
        resetFiles();
      }
    }
  }, [isOpen, currentViewMode, resetForm, resetFiles]);

  const handleSubmit = (e: React.FormEvent) => {
    const additionalData =
      selectedFiles.length > 0 ? { images: selectedFiles } : {};
    handleFormSubmit(e, additionalData);
  };

  const handleCancelClick = () => {
    handleCancel(onClose);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle(currentViewMode, superhero)}
      size={getModalSize(currentViewMode)}
    >
      {currentViewMode === 'view' && superhero ? (
        <SuperheroViewMode
          superhero={superhero}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      ) : (
        <SuperheroEditMode
          formData={formData}
          errors={errors}
          superhero={superhero}
          selectedFiles={selectedFiles}
          previewUrls={previewUrls}
          fileErrors={fileErrors}
          fileInputProps={getFileInputProps()}
          fileInputRef={fileInputRef}
          fileInfo={getFileInfo()}
          loading={loading}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onRemoveImage={removeImage}
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
        />
      )}
    </Modal>
  );
};
