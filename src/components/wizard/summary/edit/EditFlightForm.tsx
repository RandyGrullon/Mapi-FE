"use client";

import { useState } from "react";
import { FlightModuleData } from "@/types/wizard";

interface EditFlightFormProps {
  data: FlightModuleData;
  onSave: (data: Partial<FlightModuleData>) => void;
  onCancel: () => void;
}

export const EditFlightForm = ({
  data,
  onSave,
  onCancel,
}: EditFlightFormProps) => {
  const [segments, setSegments] = useState(data.segments || []);
  const [travelers, setTravelers] = useState(data.travelers || 1);
  const [cabinClass, setCabinClass] = useState(data.cabinClass || "economy");

  const updateSegment = (
    index: number,
    field: "from" | "to" | "date",
    value: string
  ) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setSegments(newSegments);
  };

  const handleSave = () => {
    onSave({
      segments,
      travelers,
      cabinClass,
    });
  };

  const canSave = segments.every((s) => s.from && s.to) && travelers > 0;

  return (
    <div className="space-y-6">
      {/* Segments */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Vuelos</h4>
        {segments.map((segment, index) => (
          <div key={segment.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desde
                </label>
                <input
                  type="text"
                  value={segment.from || ""}
                  onChange={(e) => updateSegment(index, "from", e.target.value)}
                  placeholder="Ciudad de origen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasta
                </label>
                <input
                  type="text"
                  value={segment.to || ""}
                  onChange={(e) => updateSegment(index, "to", e.target.value)}
                  placeholder="Ciudad de destino"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={segment.date || ""}
                onChange={(e) => updateSegment(index, "date", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Travelers & Cabin */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Viajeros
          </label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clase
          </label>
          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="economy">Económica</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">Primera Clase</option>
          </select>
        </div>
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
