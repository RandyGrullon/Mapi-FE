interface ActivityHeaderProps {
  name: string;
  category: string;
  price: number;
}

export const ActivityHeader = ({
  name,
  category,
  price,
}: ActivityHeaderProps) => (
  <div className="flex items-start justify-between mb-3">
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-lg mb-1 text-gray-900 truncate">{name}</h4>
      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
        {category}
      </span>
    </div>
    <span className="text-xl font-bold text-gray-900 ml-2 flex-shrink-0">
      ${price}
    </span>
  </div>
);
