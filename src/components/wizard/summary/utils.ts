import { ServiceType } from "@/types/wizard";

/**
 * Construye un paquete de viaje desde los módulos activos
 */
export const buildPackageFromModules = (modules: any[]) => {
  const packageData: any = {
    services: [],
    details: {},
  };

  modules.forEach((module: any) => {
    switch (module.type) {
      case ServiceType.FLIGHTS:
        packageData.services.push("flights");
        packageData.details.flights = {
          type: module.data.flightType,
          segments: module.data.segments,
          travelers: module.data.travelers,
          cabinClass: module.data.cabinClass || "economy",
        };
        break;

      case ServiceType.HOTEL:
        packageData.services.push("hotel");
        packageData.details.hotel = {
          destination: module.data.destination,
          checkIn: module.data.checkIn,
          checkOut: module.data.checkOut,
          rooms: module.data.rooms,
          guests: module.data.guests,
          type: module.data.hotelType || "any",
        };
        break;

      case ServiceType.CAR:
        packageData.services.push("car");
        packageData.details.car = {
          pickupLocation: module.data.pickupLocation,
          dropoffLocation: module.data.dropoffLocation,
          pickupDate: module.data.pickupDate,
          dropoffDate: module.data.dropoffDate,
          type: module.data.carType || "economy",
        };
        break;

      case ServiceType.ACTIVITIES:
        packageData.services.push("activities");
        packageData.details.activities = {
          citiesActivities: module.data.citiesActivities || [],
        };
        break;
    }
  });

  // Determinar el tipo de paquete basado en los servicios seleccionados
  const servicesCount = packageData.services.length;
  if (servicesCount === 4) {
    packageData.packageType = "complete";
    packageData.packageName = "Paquete Completo";
  } else if (
    packageData.services.includes("flights") &&
    packageData.services.includes("hotel")
  ) {
    packageData.packageType = "flight-hotel";
    packageData.packageName = "Vuelo + Hotel";
  } else if (servicesCount === 1) {
    packageData.packageType = packageData.services[0];
    packageData.packageName = getServiceName(packageData.services[0]);
  } else {
    packageData.packageType = "custom";
    packageData.packageName = "Paquete Personalizado";
  }

  return packageData;
};

/**
 * Obtiene el nombre de un servicio
 */
export const getServiceName = (service: string) => {
  const names: { [key: string]: string } = {
    flights: "Solo Vuelos",
    hotel: "Solo Hotel",
    car: "Solo Auto",
    activities: "Solo Actividades",
  };
  return names[service] || "Servicio";
};
