interface LocationDetailsProps {
  date: string;
  time: string;
}

export const LocationDetails = ({ date, time }: LocationDetailsProps) => (
  <div className="grid grid-cols-2 gap-2 mt-3">
    <div className="bg-blue-50 rounded p-2">
      <p className="text-xs text-gray-600">Fecha</p>
      <p className="font-semibold text-sm">{date}</p>
    </div>
    <div className="bg-blue-50 rounded p-2">
      <p className="text-xs text-gray-600">Hora</p>
      <p className="font-semibold text-sm">{time}</p>
    </div>
  </div>
);
