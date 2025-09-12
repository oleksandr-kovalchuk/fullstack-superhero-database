import { Superhero } from '../types/superhero';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { getImageUrl } from '../lib/utils';

interface FormData {
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
}

interface FileInputProps {
  type: 'file';
  accept: string;
  multiple: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
}

interface SuperheroEditModeProps {
  formData: FormData;
  errors: Record<string, string>;
  superhero?: Superhero | null | undefined;
  selectedFiles: File[];
  previewUrls: string[];
  fileErrors: string;
  fileInputProps: FileInputProps;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInfo: { acceptedFormats: string; maxSize: number };
  loading?: boolean;
  onInputChange: (field: string, value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const SuperheroEditMode = ({
  formData,
  errors,
  superhero,
  selectedFiles,
  previewUrls,
  fileErrors,
  fileInputProps,
  fileInputRef,
  fileInfo,
  loading = false,
  onInputChange,
  onRemoveImage,
  onSubmit,
  onCancel,
}: SuperheroEditModeProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        label="Nickname *"
        value={formData.nickname}
        onChange={(e) => onInputChange('nickname', e.target.value)}
        error={errors.nickname}
        placeholder="e.g., Superman"
      />

      <Input
        label="Real Name *"
        value={formData.realName}
        onChange={(e) => onInputChange('realName', e.target.value)}
        error={errors.realName}
        placeholder="e.g., Clark Kent"
      />

      <Textarea
        label="Origin Description *"
        value={formData.originDescription}
        onChange={(e) => onInputChange('originDescription', e.target.value)}
        error={errors.originDescription}
        placeholder="Describe the superhero's origin story..."
        rows={4}
      />

      <Textarea
        label="Superpowers *"
        value={formData.superpowers}
        onChange={(e) => onInputChange('superpowers', e.target.value)}
        error={errors.superpowers}
        placeholder="List the superhero's powers..."
        rows={3}
      />

      <Input
        label="Catch Phrase *"
        value={formData.catchPhrase}
        onChange={(e) => onInputChange('catchPhrase', e.target.value)}
        error={errors.catchPhrase}
        placeholder="e.g., Look, up in the sky!"
      />

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Images</h4>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Images (optional)
          </label>
          <input {...fileInputProps} ref={fileInputRef} />
          {fileErrors && <p className="text-sm text-red-600">{fileErrors}</p>}
          <p className="text-xs text-gray-500">
            Accepted formats: {fileInfo.acceptedFormats}. Maximum size:{' '}
            {fileInfo.maxSize}MB per file.
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
                  <img
                    src={previewUrls[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-contain rounded bg-gray-100"
                  />
                  <div className="mt-1 text-xs text-gray-600 truncate">
                    {file.name}
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => onRemoveImage(index)}
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
                  <img
                    src={getImageUrl(image.filename)}
                    alt={image.originalName}
                    className="w-full h-24 object-cover rounded"
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
