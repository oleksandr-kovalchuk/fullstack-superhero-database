import { Superhero } from '../types/superhero';
import { Button } from './ui/Button';
import { getImageUrl } from '../lib/utils';

interface SuperheroViewModeProps {
  superhero: Superhero;
  onEdit: () => void;
  onDelete?: (() => void) | undefined;
}

export const SuperheroViewMode = ({
  superhero,
  onEdit,
  onDelete,
}: SuperheroViewModeProps) => {
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
          <Button variant="secondary" onClick={onEdit}>
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
                <img
                  src={getImageUrl(image.filename)}
                  alt={image.originalName}
                  className="w-full h-full object-contain"
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
