export const CancelledBanner = () => (
  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
    <span className="text-2xl">❌</span>
    <div>
      <p className="font-bold text-red-900">Viaje Cancelado</p>
      <p className="text-sm text-red-700">
        Esta reserva ha sido cancelada y no está activa.
      </p>
    </div>
  </div>
);
