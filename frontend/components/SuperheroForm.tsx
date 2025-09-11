import { useState, useEffect, useRef } from 'react';
import {
  Superhero,
  CreateSuperheroData,
} from '@/types/superhero';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface SuperheroFormProps {
  superhero?: Superhero | null;
  onSubmit: (data: CreateSuperheroData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const SuperheroForm = ({
  superhero,
  onSubmit,
  onCancel,
  loading = false,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (superhero) {
      setFormData({
        nickname: superhero.nickname,
        realName: superhero.realName,
        originDescription: superhero.originDescription,
        superpowers: superhero.superpowers,
        catchPhrase: superhero.catchPhrase,
      });
      // For editing, we don't pre-populate files, user needs to upload new ones if needed
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [superhero]);

  // Cleanup preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nickname.trim()) newErrors.nickname = 'Nickname is required';
    if (!formData.realName.trim())
      newErrors.realName = 'Real name is required';
    if (!formData.originDescription.trim())
      newErrors.originDescription = 'Origin description is required';
    if (!formData.superpowers.trim())
      newErrors.superpowers = 'Superpowers are required';
    if (!formData.catchPhrase.trim())
      newErrors.catchPhrase = 'Catch phrase is required';

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
    
    // Validate file types
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      setErrors(prev => ({
        ...prev,
        images: 'Only JPEG, PNG, GIF, and WebP images are allowed.'
      }));
      return;
    }

    // Validate file sizes (5MB limit)
    const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'File size must be less than 10MB.'
      }));
      return;
    }

    // Clear any previous errors
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }

    // Update selected files
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

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
        onChange={(e) =>
          handleInputChange('originDescription', e.target.value)
        }
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
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
            Accepted formats: JPEG, PNG, GIF, WebP. Maximum size: 10MB per file.
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
                    src={`http://localhost:3001/uploads/${image.filename}`}
                    alt={image.originalName}
                    width={96}
                    height={96}
                    className="w-full h-24 object-cover rounded"
                    unoptimized
                  />
                  <div className="mt-1 text-xs text-gray-600 truncate">
                    {image.originalName}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              To update images, upload new ones above. Current images will be replaced.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
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
