import { SuperheroListItem } from '@/types/superhero';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface SuperheroCardProps {
  superhero: SuperheroListItem;
  onView: (superhero: SuperheroListItem) => void;
  onEdit: (superhero: SuperheroListItem) => void;
  onDelete: (id: string) => void;
  priority?: boolean;
}

export const SuperheroCard = ({
  superhero,
  onView,
  onEdit,
  onDelete,
  priority = false,
}: SuperheroCardProps) => {
  const primaryImage = superhero.image;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {primaryImage ? (
          <Image
            src={`http://localhost:3001/uploads/${primaryImage.filename}`}
            alt={superhero.nickname}
            width={288}
            height={192}
            className="w-full h-full object-contain"
            unoptimized
            priority={priority}
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
        <p className="text-sm text-gray-600 mb-4">Click to view details</p>

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
