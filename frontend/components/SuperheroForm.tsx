import { useState, useEffect } from 'react';
import {
  Superhero,
  CreateSuperheroData,
  SuperheroImage,
} from '@/types/superhero';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

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
    real_name: '',
    origin_description: '',
    superpowers: '',
    catch_phrase: '',
  });
  const [images, setImages] = useState<Omit<SuperheroImage, 'id'>[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (superhero) {
      setFormData({
        nickname: superhero.nickname,
        real_name: superhero.real_name,
        origin_description: superhero.origin_description,
        superpowers: superhero.superpowers,
        catch_phrase: superhero.catch_phrase,
      });
      setImages(
        superhero.images.map((img) => ({ url: img.url, alt: img.alt }))
      );
    }
  }, [superhero]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nickname.trim()) newErrors.nickname = 'Nickname is required';
    if (!formData.real_name.trim())
      newErrors.real_name = 'Real name is required';
    if (!formData.origin_description.trim())
      newErrors.origin_description = 'Origin description is required';
    if (!formData.superpowers.trim())
      newErrors.superpowers = 'Superpowers are required';
    if (!formData.catch_phrase.trim())
      newErrors.catch_phrase = 'Catch phrase is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        images,
      });
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

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [
        ...prev,
        { url: newImageUrl.trim(), alt: newImageAlt.trim() },
      ]);
      setNewImageUrl('');
      setNewImageAlt('');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
        value={formData.real_name}
        onChange={(e) => handleInputChange('real_name', e.target.value)}
        error={errors.real_name}
        placeholder="e.g., Clark Kent"
      />

      <Textarea
        label="Origin Description *"
        value={formData.origin_description}
        onChange={(e) =>
          handleInputChange('origin_description', e.target.value)
        }
        error={errors.origin_description}
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
        value={formData.catch_phrase}
        onChange={(e) => handleInputChange('catch_phrase', e.target.value)}
        error={errors.catch_phrase}
        placeholder="e.g., Look, up in the sky!"
      />

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Images</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="Image Alt Text (optional)"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            placeholder="Description of the image"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={addImage}
          disabled={!newImageUrl.trim()}
        >
          Add Image
        </Button>

        {images.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Current Images:</h5>
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={image.url}
                    alt={image.alt || 'Superhero image'}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.url}
                    </p>
                    {image.alt && (
                      <p className="text-xs text-gray-500">{image.alt}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
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
