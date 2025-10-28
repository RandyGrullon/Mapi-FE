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
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
        />
      </svg>
    </button>
  );
};
