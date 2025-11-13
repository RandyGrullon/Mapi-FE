"use client";

import { useState } from "react";
import { CarModuleData } from "@/types/wizard";

interface EditCarFormProps {
  data: CarModuleData;
  onSave: (data: Partial<CarModuleData>) => void;
  onCancel: () => void;
}

export const EditCarForm = ({ data, onSave, onCancel }: EditCarFormProps) => {
  const [pickupLocation, setPickupLocation] = useState(
    data.pickupLocation || ""
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    data.dropoffLocation || ""
  );
  const [pickupDate, setPickupDate] = useState(data.pickupDate || "");
  const [dropoffDate, setDropoffDate] = useState(data.dropoffDate || "");
  const [carType, setCarType] = useState(data.carType || "economy");

  const handleSave = () => {
    onSave({
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      carType,
    });
  };

  const canSave =
    pickupLocation && dropoffLocation && pickupDate && dropoffDate;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lugar de recogida
          </label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Ej: Aeropuerto de París"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lugar de devolución
          </label>
          <input
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            placeholder="Ej: Aeropuerto de París"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de recogida
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de devolución
          </label>
          <input
            type="date"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            min={pickupDate}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de vehículo
        </label>
        <select
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="economy">Económico</option>
          <option value="compact">Compacto</option>
          <option value="midsize">Mediano</option>
          <option value="suv">SUV</option>
          <option value="luxury">Lujo</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              canSave
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};
