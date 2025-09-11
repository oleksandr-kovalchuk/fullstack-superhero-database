import { Superhero } from '@/types/superhero';
import { Button } from '@/components/ui/Button';

interface SuperheroCardProps {
  superhero: Superhero;
  onView: (superhero: Superhero) => void;
  onEdit: (superhero: Superhero) => void;
  onDelete: (id: string) => void;
}

export const SuperheroCard = ({
  superhero,
  onView,
  onEdit,
  onDelete,
}: SuperheroCardProps) => {
  const primaryImage = superhero.images?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || superhero.nickname}
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
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {superhero.nickname}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{superhero.real_name}</p>

        <div className="flex space-x-2">
          <Button variant="primary" size="sm" onClick={() => onView(superhero)}>
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(superhero)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(superhero.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
