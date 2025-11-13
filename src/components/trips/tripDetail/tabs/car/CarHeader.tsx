interface CarHeaderProps {
  company: string;
  carType: string;
  carModel: string;
  imageUrl?: string;
  confirmationCode: string;
}

export const CarHeader = ({
  company,
  carType,
  carModel,
  imageUrl,
  confirmationCode,
}: CarHeaderProps) => (
  <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
      <h3 className="text-2xl font-bold mb-1">{company}</h3>
      <p className="text-blue-700 font-medium text-lg">
        {carType} - {carModel}
      </p>

      {imageUrl && (
        <div className="mt-4 mb-4">
          <img
            src={imageUrl}
            alt={`${carType} - ${carModel}`}
            className="w-full max-w-md rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-600">Confirmación</p>
      <p className="text-lg font-bold text-blue-600">{confirmationCode}</p>
    </div>
  </div>
);
