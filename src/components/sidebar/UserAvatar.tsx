interface UserAvatarProps {
  initials: string;
  name: string;
  email?: string;
  isCollapsed: boolean;
}

export const UserAvatar = ({
  initials,
  name,
  email,
  isCollapsed,
}: UserAvatarProps) => {
  return (
    <a
      href="/profile"
      className={`flex ${
        isCollapsed ? "justify-center" : "items-center gap-3 p-2 flex-1"
      } rounded-lg hover:bg-gray-100 transition-all duration-200`}
      title={isCollapsed ? `${name} - ${email}` : ""}
    >
      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
        {initials}
      </div>
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{name}</p>
          {email && <p className="text-xs text-gray-500 truncate">{email}</p>}
        </div>
      )}
    </a>
  );
};
