interface PanelOverlayProps {
  onClick: () => void;
}

export const PanelOverlay = ({ onClick }: PanelOverlayProps) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
    onClick={onClick}
  />
);
