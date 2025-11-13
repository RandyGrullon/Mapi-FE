"use client";

import { useState } from "react";
import { HotelModuleData } from "@/types/wizard";

interface EditHotelFormProps {
  data: HotelModuleData;
  onSave: (data: Partial<HotelModuleData>) => void;
  onCancel: () => void;
}

export const EditHotelForm = ({
  data,
  onSave,
  onCancel,
}: EditHotelFormProps) => {
  const [destination, setDestination] = useState(data.destination || "");
  const [checkIn, setCheckIn] = useState(data.checkIn || "");
  const [checkOut, setCheckOut] = useState(data.checkOut || "");
  const [rooms, setRooms] = useState(data.rooms || 1);
  const [guests, setGuests] = useState(data.guests || 2);
  const [hotelType, setHotelType] = useState(data.hotelType || "standard");

  const handleSave = () => {
    onSave({
      destination,
      checkIn,
      checkOut,
      rooms,
      guests,
      hotelType,
    });
  };

  const canSave = destination && checkIn && checkOut && rooms > 0 && guests > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destino
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ej: París, Francia"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habitaciones
          </label>
          <input
            type="number"
            min="1"
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Huéspedes
          </label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de hotel
        </label>
        <select
          value={hotelType}
          onChange={(e) => setHotelType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="economy">Económico</option>
          <option value="standard">Estándar</option>
          <option value="comfort">Confort</option>
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
