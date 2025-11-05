"use client";

interface CustomPackageFooterProps {
  selectedFlight: string | null;
  selectedHotel: string | null;
  selectedCar: string | null;
  selectedActivities: string[];
  onCreatePackage: () => void;
}

export const CustomPackageFooter = ({
  selectedFlight,
  selectedHotel,
  selectedCar,
  selectedActivities,
  onCreatePackage,
}: CustomPackageFooterProps) => {
  return (
    <div className="border-t border-gray-200 bg-white shadow-sm flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Tu selección:</span>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1.5 text-gray-500">
                <span
                  className={`flex items-center gap-1.5 ${
                    selectedFlight ? "text-gray-900 font-medium" : ""
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedFlight ? "bg-gray-900" : "bg-gray-300"
                    }`}
                  ></span>
                  {selectedFlight ? "1 vuelo" : "0 vuelos"}
                </span>
                <span
                  className={`flex items-center gap-1.5 ${
                    selectedHotel ? "text-gray-900 font-medium" : ""
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedHotel ? "bg-gray-900" : "bg-gray-300"
                    }`}
                  ></span>
                  {selectedHotel ? "1 hotel" : "0 hoteles"}
                </span>
                <span
                  className={`flex items-center gap-1.5 ${
                    selectedCar ? "text-gray-900 font-medium" : ""
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedCar ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  ></span>
                  {selectedCar ? "1 auto" : "0 autos"}
                </span>
                <span
                  className={`flex items-center gap-1.5 ${
                    selectedActivities.length > 0
                      ? "text-gray-900 font-medium"
                      : ""
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedActivities.length > 0
                        ? "bg-gray-900"
                        : "bg-gray-300"
                    }`}
                  ></span>
                  {selectedActivities.length} actividad(es)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onCreatePackage}
            disabled={!selectedFlight || !selectedHotel}
            className="w-full md:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-900 shadow-sm hover:shadow whitespace-nowrap"
          >
            Crear Paquete Personalizado
          </button>
        </div>
      </div>
    </div>
  );
};
