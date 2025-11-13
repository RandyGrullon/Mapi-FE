interface InfoCardProps {
  icon: string;
  title: string;
  content: string;
  subtitle?: string;
}

export const InfoCard = ({ icon, title, content, subtitle }: InfoCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-xs text-gray-600 mb-1">{title}</p>
        <p className="font-bold text-sm">{content}</p>
        {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);
