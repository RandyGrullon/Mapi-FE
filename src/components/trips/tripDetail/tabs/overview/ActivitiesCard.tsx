import { CardButton } from "../../../../buttons";

interface Activity {
  category: string;
}

interface ActivitiesCardProps {
  activities: Activity[];
  onNavigate: () => void;
}

export const ActivitiesCard = ({
  activities,
  onNavigate,
}: ActivitiesCardProps) => {
  const categoriesText =
    activities.length > 0
      ? activities
          .slice(0, 2)
          .map((a) => a.category)
          .join(", ") + (activities.length > 2 ? "..." : "")
      : "Ninguna";

  return (
    <CardButton
      onClick={onNavigate}
      icon="🎯"
      title="Actividades"
      subtitle="Experiencias planificadas"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Total actividades</span>
        <span className="font-medium text-gray-900">{activities.length}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Categorías</span>
        <span className="text-sm text-gray-900">{categoriesText}</span>
      </div>
    </CardButton>
  );
};
