import { Superhero } from '@/types/superhero';
import { Button } from '@/components/ui/Button';

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
          <p className="text-xl text-gray-600 mt-1">{superhero.real_name}</p>
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
            {superhero.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.alt || `${superhero.nickname} image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="flex items-center justify-center h-full text-gray-400">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    `;
                  }}
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
            {superhero.origin_description}
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
            "{superhero.catch_phrase}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};
