import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortablePage({ page }: { page: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: page });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="selected-page"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <span>☰</span>
      <strong>Page {page}</strong>
    </div>
  );
}
