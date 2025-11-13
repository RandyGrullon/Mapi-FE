export class TripUtils {
  // Generar ID único
  static generateId(): string {
    return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generar código de confirmación
  static generateConfirmationCode(prefix: string): string {
    return `${prefix}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  // Calcular número de noches entre dos fechas
  static calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Formatear fecha para mostrar
  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Crear URL de booking genérica
  static createBookingUrl(
    type: "flight" | "hotel" | "activity",
    params: any
  ): string {
    switch (type) {
      case "flight":
        return `https://www.kayak.com/flights/${params.origin}-${params.destination}/${params.date}`;
      case "hotel":
        return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
          params.destination
        )}`;
      case "activity":
        return `https://www.viator.com/searchResults/all?pid=P00055329&mcid=42383`;
      default:
        return "";
    }
  }
}
