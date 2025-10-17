interface CardButtonProps {
  onClick: () => void;
  icon: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  className?: string;
}

export const CardButton = ({
  onClick,
  icon,
  title,
  subtitle,
  children,
  className = "",
}: CardButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
      {children && <div className="space-y-2">{children}</div>}
    </div>
  );
};
