interface FuelPolicyProps {
  policy: string;
}

export const FuelPolicy = ({ policy }: FuelPolicyProps) => (
  <div className="bg-white rounded-lg p-4 mb-4">
    <h4 className="font-bold mb-2">Política de Combustible</h4>
    <p className="text-gray-700">{policy}</p>
  </div>
);
