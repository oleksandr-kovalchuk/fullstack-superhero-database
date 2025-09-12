import { useState, useEffect, useRef } from 'react';
import { Superhero, CreateSuperheroData } from '@/types/superhero';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FILE_CONFIG } from '@/lib/constants';
import { validateFiles, getImageUrl, validateSuperheroForm, createPreviewUrl, revokePreviewUrl, removeItemAtIndex, addItemsToArray } from '@/lib/utils';
import Image from 'next/image';

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
  const [formData, setFormData] = useState({
    nickname: '',
    realName: '',
    originDescription: '',
    superpowers: '',
    catchPhrase: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentViewMode, setCurrentViewMode] = useState<'view' | 'edit' | 'create'>('create');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentViewMode(viewMode);
    if (superhero) {
      setFormData({
        nickname: superhero.nickname,
        realName: superhero.realName,
        originDescription: superhero.originDescription,
        superpowers: superhero.superpowers,
        catchPhrase: superhero.catchPhrase,
      });
    } else {
      // Reset form when no superhero (create mode)
      setFormData({
        nickname: '',
        realName: '',
        originDescription: '',
        superpowers: '',
        catchPhrase: '',
      });
    }
    // Always reset files and previews when mode changes
    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrors({});
  }, [superhero, viewMode]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(revokePreviewUrl);
    };
  }, [previewUrls]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors = validateSuperheroForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        ...(superhero && { id: superhero.id }),
        ...(selectedFiles.length > 0 && { images: selectedFiles }),
      };
      await onSubmit(submitData);
      
      // Reset form after successful submission
      if (currentViewMode === 'create') {
        resetForm();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const { valid, errors: validationErrors } = validateFiles(files);

    if (validationErrors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: validationErrors.join(' '),
      }));
      return;
    }

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }));
    }

    setSelectedFiles((prev) => addItemsToArray(prev, valid));

    const newPreviewUrls = valid.map(createPreviewUrl);
    setPreviewUrls((prev) => addItemsToArray(prev, newPreviewUrls));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    revokePreviewUrl(previewUrls[index]);

    setSelectedFiles((prev) => removeItemAtIndex(prev, index));
    setPreviewUrls((prev) => removeItemAtIndex(prev, index));
  };

  const handleEdit = () => {
    setCurrentViewMode('edit');
  };

  const resetForm = () => {
    setFormData({
      nickname: '',
      realName: '',
      originDescription: '',
      superpowers: '',
      catchPhrase: '',
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    if (currentViewMode === 'edit' && superhero) {
      setCurrentViewMode('view');
      // Reset form to original superhero data
      setFormData({
        nickname: superhero.nickname,
        realName: superhero.realName,
        originDescription: superhero.originDescription,
        superpowers: superhero.superpowers,
        catchPhrase: superhero.catchPhrase,
      });
    } else {
      onClose();
    }
  };

  const getModalTitle = () => {
    switch (currentViewMode) {
      case 'view':
        return superhero?.nickname || 'Superhero Details';
      case 'edit':
        return 'Edit Superhero';
      case 'create':
        return 'Create New Superhero';
      default:
        return 'Superhero';
    }
  };

  const renderViewMode = () => {
    if (!superhero) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {superhero.nickname}
            </h1>
            <p className="text-lg text-gray-600 mt-1">{superhero.realName}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleEdit}>
              Edit
            </Button>
            {onDelete && (
              <Button variant="danger" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>

        {superhero.images && superhero.images.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {superhero.images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={getImageUrl(image.filename)}
                    alt={image.originalName}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Origin Story
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {superhero.originDescription}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Superpowers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {superhero.superpowers}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Catch Phrase
            </h2>
            <blockquote className="text-lg italic text-gray-600 border-l-4 border-blue-500 pl-4">
              &ldquo;{superhero.catchPhrase}&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    );
  };

  const renderEditMode = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nickname *"
          value={formData.nickname}
          onChange={(e) => handleInputChange('nickname', e.target.value)}
          error={errors.nickname}
          placeholder="e.g., Superman"
        />

        <Input
          label="Real Name *"
          value={formData.realName}
          onChange={(e) => handleInputChange('realName', e.target.value)}
          error={errors.realName}
          placeholder="e.g., Clark Kent"
        />

        <Textarea
          label="Origin Description *"
          value={formData.originDescription}
          onChange={(e) => handleInputChange('originDescription', e.target.value)}
          error={errors.originDescription}
          placeholder="Describe the superhero's origin story..."
          rows={4}
        />

        <Textarea
          label="Superpowers *"
          value={formData.superpowers}
          onChange={(e) => handleInputChange('superpowers', e.target.value)}
          error={errors.superpowers}
          placeholder="List the superhero's powers..."
          rows={3}
        />

        <Input
          label="Catch Phrase *"
          value={formData.catchPhrase}
          onChange={(e) => handleInputChange('catchPhrase', e.target.value)}
          error={errors.catchPhrase}
          placeholder="e.g., Look, up in the sky!"
        />

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Images</h4>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Images (optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={FILE_CONFIG.ALLOWED_TYPES.join(',')}
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            {errors.images && (
              <p className="text-sm text-red-600">{errors.images}</p>
            )}
            <p className="text-xs text-gray-500">
              Accepted formats:{' '}
              {FILE_CONFIG.ALLOWED_TYPES.map((type) =>
                type.split('/')[1].toUpperCase()
              ).join(', ')}
              . Maximum size: {Math.round(FILE_CONFIG.MAX_SIZE / (1024 * 1024))}MB
              per file.
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Selected Images:</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative group bg-gray-50 p-2 rounded-md"
                  >
                    <Image
                      src={previewUrls[index]}
                      alt={`Preview ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-24 object-contain rounded bg-gray-100"
                      style={{ width: 'auto', height: 'auto' }}
                      unoptimized
                    />
                    <div className="mt-1 text-xs text-gray-600 truncate">
                      {file.name}
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {superhero && superhero.images.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Current Images:</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {superhero.images.map((image) => (
                  <div key={image.id} className="bg-gray-50 p-2 rounded-md">
                    <Image
                      src={getImageUrl(image.filename)}
                      alt={image.originalName}
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded"
                      style={{ width: 'auto', height: 'auto' }}
                      unoptimized
                    />
                    <div className="mt-1 text-xs text-gray-600 truncate">
                      {image.originalName}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                To update images, upload new ones above. Current images will be
                replaced.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {superhero ? 'Update' : 'Create'} Superhero
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size={currentViewMode === 'view' ? 'xl' : 'lg'}
    >
      {currentViewMode === 'view' ? renderViewMode() : renderEditMode()}
    </Modal>
  );
};
