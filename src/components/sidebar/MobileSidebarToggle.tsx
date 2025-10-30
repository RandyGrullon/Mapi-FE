"use client";

interface MobileSidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileSidebarToggle = ({
  isOpen,
  onToggle,
}: MobileSidebarToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-xl"
      aria-label="Toggle sidebar"
    >
      <div className="w-6 h-6 relative">
        <span
          className={`absolute block h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out top-1 origin-center ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        ></span>
        <span
          className={`absolute block h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out top-2.5 origin-center ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        ></span>
        <span
          className={`absolute block h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out top-4 origin-center ${
            isOpen ? '-rotate-45 -translate-y-1' : ''
          }`}
        ></span>
      </div>
    </button>
  );
};
