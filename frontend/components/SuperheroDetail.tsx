import { Superhero } from '@/types/superhero';
import { Button } from '@/components/ui/Button';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

interface SuperheroDetailProps {
  superhero: Superhero;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const SuperheroDetail = ({
  superhero,
  onEdit,
  onDelete,
  onClose,
}: SuperheroDetailProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {superhero.nickname}
          </h1>
          <p className="text-xl text-gray-600 mt-1">{superhero.realName}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {superhero.images && superhero.images.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {superhero.images.map((image) => (
              <div
                key={image.id}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
              >
                <Image
                  src={getImageUrl(image.filename)}
                  alt={image.originalName}
                  width={300}
                  height={300}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Origin Story
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {superhero.originDescription}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Superpowers
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {superhero.superpowers}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
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
