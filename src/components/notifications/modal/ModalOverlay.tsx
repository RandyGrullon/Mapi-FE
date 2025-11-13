interface ModalOverlayProps {
  onClick: () => void;
}

export const ModalOverlay = ({ onClick }: ModalOverlayProps) => (
  <div
    className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
    onClick={onClick}
  />
);
