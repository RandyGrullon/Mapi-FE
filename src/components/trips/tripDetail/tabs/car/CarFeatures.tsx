import { CheckIcon } from "./CheckIcon";

interface CarFeaturesProps {
  features?: string[];
}

export const CarFeatures = ({ features }: CarFeaturesProps) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <h4 className="font-bold mb-3">Características del Vehículo</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
