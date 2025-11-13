interface InfoCardProps {
  label: string;
  value: string | number;
}

export const InfoCard = ({ label, value }: InfoCardProps) => (
  <div className="bg-white rounded-lg p-3">
    <p className="text-xs text-gray-600">{label}</p>
    <p className="font-bold">{value}</p>
  </div>
);
