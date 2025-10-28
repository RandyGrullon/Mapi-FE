"use client";

import {
  CompletedTripsManager,
  CompletedTrip,
} from "../trips/CompletedTripsManager";

export class DemoTripsInitializer {
  private static readonly DEMO_INITIALIZED_KEY = "mapi_demo_trips_initialized";

  // Verificar si ya se inicializaron los viajes demo
  static isInitialized(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(this.DEMO_INITIALIZED_KEY) === "true";
  }

  // Marcar como inicializado
  static markAsInitialized(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.DEMO_INITIALIZED_KEY, "true");
  }

  // Crear viajes de demostración
  static createDemoTrips(): void {
    if (this.isInitialized()) {
      console.log("Demo trips already initialized");
      return;
    }

    const demoTrips: CompletedTrip[] = [
      // Viaje 1: París - Completado
      {
        id: "demo_trip_paris_2024",
        name: "Santo Domingo → París",
        origin: "Santo Domingo",
        destination: "París",
        startDate: "2024-08-15T00:00:00.000Z",
        endDate: "2024-08-24T00:00:00.000Z",
        travelers: 2,
        status: "completed",
        createdAt: "2024-07-10T10:30:00.000Z",
        completedAt: "2024-08-24T20:00:00.000Z",
        travelInfo: {
          origin: "Santo Domingo",
          destination: "París",
          startDate: "2024-08-15",
          endDate: "2024-08-24",
          travelers: 2,
          flightPreference: "Económico (más barato)",
          accommodationType: "Hotel de lujo (5 estrellas)",
          activities: [
            "Cultura e historia",
            "Gastronomía y restaurantes",
            "Fotografía y paisajes",
          ],
          budget: "Premium ($5,000 - $10,000 USD)",
          organizedActivities: false,
        },
        flights: {
          outbound: {
            airline: "Air France",
            flightNumber: "AF0453",
            origin: "Santo Domingo",
            destination: "París",
            departureDate: "2024-08-15",
            departureTime: "10:45",
            arrivalDate: "2024-08-16",
            arrivalTime: "01:20",
            duration: "9h 35m",
            flightClass: "Economy",
            confirmationCode: "AFPXY789",
            price: 680,
            baggage: "1 maleta de 23kg + equipaje de mano",
            type: "outbound",
          },
          return: {
            airline: "Air France",
            flightNumber: "AF0454",
            origin: "París",
            destination: "Santo Domingo",
            departureDate: "2024-08-24",
            departureTime: "14:30",
            arrivalDate: "2024-08-24",
            arrivalTime: "18:45",
            duration: "9h 15m",
            flightClass: "Economy",
            confirmationCode: "AFRET456",
            price: 680,
            baggage: "1 maleta de 23kg + equipaje de mano",
            type: "return",
          },
        },
        hotel: {
          hotelName: "Le Meurice Paris",
          category: "Hotel de lujo (5 estrellas)",
          address: "228 Rue de Rivoli, 75001 París, Francia",
          checkIn: "2024-08-16",
          checkOut: "2024-08-24",
          nights: 8,
          roomType: "Suite Deluxe con vista a la Torre Eiffel",
          guests: 2,
          amenities: [
            "WiFi gratuito de alta velocidad",
            "Desayuno buffet incluido",
            "Spa y centro de bienestar",
            "Gimnasio 24 horas",
            "Piscina cubierta climatizada",
            "Servicio de habitaciones 24h",
            "Concierge premium",
            "Bar en el hotel",
          ],
          confirmationCode: "LMPRS2468",
          totalPrice: 3200,
          pricePerNight: 400,
        },
        activities: [
          {
            id: "act_paris_1",
            name: "Tour Privado del Louvre",
            category: "Cultura e historia",
            description:
              "Recorrido exclusivo por el museo más famoso del mundo con guía experto. Incluye acceso prioritario y visita a las obras maestras.",
            date: "2024-08-17",
            time: "09:00",
            duration: "3 horas",
            location: "Museo del Louvre, París",
            price: 150,
            confirmationCode: "LOUVRE789",
            included: [
              "Guía privado",
              "Entrada prioritaria",
              "Audioguía personal",
            ],
          },
          {
            id: "act_paris_2",
            name: "Tour Gastronómico Le Marais",
            category: "Gastronomía y restaurantes",
            description:
              "Experiencia culinaria por el barrio Le Marais. Degustación de quesos, vinos, pasteles y platos tradicionales franceses.",
            date: "2024-08-19",
            time: "18:00",
            duration: "4 horas",
            location: "Le Marais, París",
            price: 120,
            confirmationCode: "MARAIS456",
            included: ["Guía gastronómico", "10 degustaciones", "Copa de vino"],
          },
          {
            id: "act_paris_3",
            name: "Sesión Fotográfica en París",
            category: "Fotografía y paisajes",
            description:
              "Sesión fotográfica profesional en los lugares más emblemáticos: Torre Eiffel, Campos Elíseos, Arco del Triunfo.",
            date: "2024-08-21",
            time: "07:00",
            duration: "3 horas",
            location: "Tour Eiffel y alrededores",
            price: 200,
            confirmationCode: "PHOTO123",
            included: [
              "Fotógrafo profesional",
              "50 fotos editadas",
              "Álbum digital",
            ],
          },
        ],
        itinerary: [
          {
            day: 1,
            date: "2024-08-16",
            title: "Llegada a París",
            activities: [],
            meals: {
              breakfast: "En el vuelo",
              dinner: "Cena de bienvenida en el hotel",
            },
            notes:
              "Check-in después de la 1:00 AM. Día libre para descansar del jet lag.",
          },
          {
            day: 2,
            date: "2024-08-17",
            title: "Día del Louvre",
            activities: [
              {
                id: "act_paris_1",
                name: "Tour Privado del Louvre",
                category: "Cultura e historia",
                description:
                  "Recorrido exclusivo por el museo más famoso del mundo",
                date: "2024-08-17",
                time: "09:00",
                duration: "3 horas",
                location: "Museo del Louvre",
                price: 150,
                confirmationCode: "LOUVRE789",
                included: ["Guía privado", "Entrada prioritaria"],
              },
            ],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
              lunch: "Café cerca del Louvre",
              dinner: "Restaurante Le Comptoir du Relais",
            },
          },
          {
            day: 3,
            date: "2024-08-18",
            title: "Montmartre y Sacré-Cœur",
            activities: [],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
              lunch: "Crêperie en Montmartre",
              dinner: "Bistró parisino",
            },
            notes: "Exploración libre del barrio artístico de Montmartre",
          },
          {
            day: 4,
            date: "2024-08-19",
            title: "Experiencia Gastronómica",
            activities: [
              {
                id: "act_paris_2",
                name: "Tour Gastronómico Le Marais",
                category: "Gastronomía y restaurantes",
                description: "Experiencia culinaria por Le Marais",
                date: "2024-08-19",
                time: "18:00",
                duration: "4 horas",
                location: "Le Marais, París",
                price: 120,
                confirmationCode: "MARAIS456",
                included: ["Guía gastronómico", "10 degustaciones"],
              },
            ],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
              lunch: "Boulangerie tradicional",
            },
          },
          {
            day: 5,
            date: "2024-08-20",
            title: "Versalles",
            activities: [],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
              lunch: "Almuerzo en Versalles",
              dinner: "Regreso a París - Cena en el hotel",
            },
            notes: "Excursión de día completo al Palacio de Versalles",
          },
          {
            day: 6,
            date: "2024-08-21",
            title: "Sesión Fotográfica",
            activities: [
              {
                id: "act_paris_3",
                name: "Sesión Fotográfica en París",
                category: "Fotografía y paisajes",
                description: "Sesión en lugares emblemáticos",
                date: "2024-08-21",
                time: "07:00",
                duration: "3 horas",
                location: "Tour Eiffel y alrededores",
                price: 200,
                confirmationCode: "PHOTO123",
                included: ["Fotógrafo profesional", "50 fotos"],
              },
            ],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
              lunch: "Picnic en los Campos de Marte",
              dinner: "Crucero por el Sena con cena",
            },
          },
          {
            day: 7,
            date: "2024-08-22",
            title: "Compras y Relax",
            activities: [],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
              lunch: "Café en los Campos Elíseos",
              dinner: "Restaurante con estrella Michelin",
            },
            notes:
              "Día libre para compras en Avenue des Champs-Élysées y spa en el hotel",
          },
          {
            day: 8,
            date: "2024-08-23",
            title: "Último día en París",
            activities: [],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
              lunch: "Bistró en Le Marais",
              dinner: "Cena de despedida en el hotel",
            },
            notes: "Últimas compras y paseo por el Sena",
          },
          {
            day: 9,
            date: "2024-08-24",
            title: "Regreso a Casa",
            activities: [],
            meals: {
              breakfast: "Desayuno buffet en el hotel",
            },
            notes: "Check-out a las 11:00. Vuelo de regreso a las 14:30",
          },
        ],
        budget: {
          flights: 1360,
          hotel: 3200,
          activities: 470,
          extras: 800,
          total: 5830,
        },
      },

      // Viaje 2: Nueva York - Completado
      {
        id: "demo_trip_nyc_2024",
        name: "Santo Domingo → Nueva York",
        origin: "Santo Domingo",
        destination: "Nueva York",
        startDate: "2024-12-20T00:00:00.000Z",
        endDate: "2024-12-26T00:00:00.000Z",
        travelers: 3,
        status: "completed",
        createdAt: "2024-11-05T14:20:00.000Z",
        completedAt: "2024-12-26T22:00:00.000Z",
        travelInfo: {
          origin: "Santo Domingo",
          destination: "Nueva York",
          startDate: "2024-12-20",
          endDate: "2024-12-26",
          travelers: 3,
          flightPreference: "Directo (sin escalas)",
          accommodationType: "Hotel confort (4 estrellas)",
          activities: [
            "Compras y shopping",
            "Vida nocturna y entretenimiento",
            "Cultura e historia",
          ],
          budget: "Confortable ($3,000 - $5,000 USD)",
          organizedActivities: false,
        },
        flights: {
          outbound: {
            airline: "JetBlue",
            flightNumber: "B6704",
            origin: "Santo Domingo",
            destination: "Nueva York (JFK)",
            departureDate: "2024-12-20",
            departureTime: "13:15",
            arrivalDate: "2024-12-20",
            arrivalTime: "17:30",
            duration: "4h 15m",
            flightClass: "Economy",
            confirmationCode: "JB7DXYZ9",
            price: 420,
            baggage: "1 maleta de 23kg + equipaje de mano",
            type: "outbound",
          },
          return: {
            airline: "JetBlue",
            flightNumber: "B6705",
            origin: "Nueva York (JFK)",
            destination: "Santo Domingo",
            departureDate: "2024-12-26",
            departureTime: "19:45",
            arrivalDate: "2024-12-27",
            arrivalTime: "00:15",
            duration: "4h 30m",
            flightClass: "Economy",
            confirmationCode: "JB8EABC1",
            price: 420,
            baggage: "1 maleta de 23kg + equipaje de mano",
            type: "return",
          },
        },
        hotel: {
          hotelName: "The Manhattan at Times Square",
          category: "Hotel confort (4 estrellas)",
          address: "790 7th Avenue, New York, NY 10019",
          checkIn: "2024-12-20",
          checkOut: "2024-12-26",
          nights: 6,
          roomType: "Habitación Familiar (2 camas Queen)",
          guests: 3,
          amenities: [
            "WiFi gratuito",
            "Desayuno continental incluido",
            "Gimnasio",
            "Centro de negocios",
            "Recepción 24 horas",
            "Servicio de conserjería",
          ],
          confirmationCode: "MTS24DEC",
          totalPrice: 1800,
          pricePerNight: 300,
        },
        activities: [
          {
            id: "act_nyc_1",
            name: "Tour de Compras en Fifth Avenue",
            category: "Compras y shopping",
            description:
              "Recorrido guiado por las mejores tiendas de la Quinta Avenida, desde boutiques de lujo hasta Apple Store.",
            date: "2024-12-21",
            time: "10:00",
            duration: "5 horas",
            location: "Fifth Avenue, Manhattan",
            price: 80,
            confirmationCode: "SHOP5TH",
            included: [
              "Guía de compras",
              "Descuentos exclusivos",
              "Mapa de tiendas",
            ],
          },
          {
            id: "act_nyc_2",
            name: "Broadway Show: El Rey León",
            category: "Vida nocturna y entretenimiento",
            description:
              "Entradas para el musical más espectacular de Broadway. Asientos en sección premium.",
            date: "2024-12-23",
            time: "20:00",
            duration: "2.5 horas",
            location: "Minskoff Theatre, Broadway",
            price: 450,
            confirmationCode: "BWLION23",
            included: [
              "3 entradas premium",
              "Programa del show",
              "Bebida en el intermedio",
            ],
          },
          {
            id: "act_nyc_3",
            name: "Tour Estatua de la Libertad y Ellis Island",
            category: "Cultura e historia",
            description:
              "Ferry a Liberty Island y Ellis Island con guía. Incluye acceso al pedestal de la estatua.",
            date: "2024-12-24",
            time: "09:30",
            duration: "4 horas",
            location: "Battery Park, Manhattan",
            price: 180,
            confirmationCode: "LIBERTY24",
            included: [
              "Ferry ida y vuelta",
              "Guía certificado",
              "Entrada a museos",
            ],
          },
        ],
        itinerary: [
          {
            day: 1,
            date: "2024-12-20",
            title: "Llegada a Nueva York",
            activities: [],
            meals: {
              breakfast: "En Santo Domingo",
              dinner: "Cena en Times Square",
            },
            notes:
              "Check-in en el hotel. Caminata nocturna por Times Square iluminado.",
          },
          {
            day: 2,
            date: "2024-12-21",
            title: "Día de Compras",
            activities: [
              {
                id: "act_nyc_1",
                name: "Tour de Compras en Fifth Avenue",
                category: "Compras y shopping",
                description: "Recorrido guiado por Fifth Avenue",
                date: "2024-12-21",
                time: "10:00",
                duration: "5 horas",
                location: "Fifth Avenue, Manhattan",
                price: 80,
                confirmationCode: "SHOP5TH",
                included: ["Guía de compras", "Descuentos"],
              },
            ],
            meals: {
              breakfast: "Desayuno en el hotel",
              lunch: "Food court en Rockefeller Center",
              dinner: "Steakhouse en Midtown",
            },
          },
          {
            day: 3,
            date: "2024-12-22",
            title: "Central Park y Museos",
            activities: [],
            meals: {
              breakfast: "Desayuno en el hotel",
              lunch: "The Loeb Boathouse en Central Park",
              dinner: "Pizza en Brooklyn",
            },
            notes:
              "Visita al American Museum of Natural History y paseo por Central Park",
          },
          {
            day: 4,
            date: "2024-12-23",
            title: "Noche de Broadway",
            activities: [
              {
                id: "act_nyc_2",
                name: "Broadway Show: El Rey León",
                category: "Vida nocturna y entretenimiento",
                description: "Musical de Broadway",
                date: "2024-12-23",
                time: "20:00",
                duration: "2.5 horas",
                location: "Minskoff Theatre",
                price: 450,
                confirmationCode: "BWLION23",
                included: ["3 entradas premium"],
              },
            ],
            meals: {
              breakfast: "Desayuno en el hotel",
              lunch: "Deli judío en Lower East Side",
              dinner: "Cena pre-teatro en Restaurant Row",
            },
          },
          {
            day: 5,
            date: "2024-12-24",
            title: "Estatua de la Libertad",
            activities: [
              {
                id: "act_nyc_3",
                name: "Tour Estatua de la Libertad",
                category: "Cultura e historia",
                description: "Ferry a Liberty Island",
                date: "2024-12-24",
                time: "09:30",
                duration: "4 horas",
                location: "Battery Park",
                price: 180,
                confirmationCode: "LIBERTY24",
                included: ["Ferry", "Guía"],
              },
            ],
            meals: {
              breakfast: "Desayuno en el hotel",
              lunch: "Almuerzo en Financial District",
              dinner: "Cena de Navidad en el hotel",
            },
            notes: "Nochebuena - Ver decoraciones navideñas en la ciudad",
          },
          {
            day: 6,
            date: "2024-12-25",
            title: "Navidad en Nueva York",
            activities: [],
            meals: {
              breakfast: "Desayuno en el hotel",
              lunch: "Brunch navideño en SoHo",
              dinner: "Cena festiva en Midtown",
            },
            notes:
              "Día de Navidad - Patinaje en Rockefeller Center, ver el árbol de Navidad",
          },
          {
            day: 7,
            date: "2024-12-26",
            title: "Último día y regreso",
            activities: [],
            meals: {
              breakfast: "Desayuno en el hotel",
              lunch: "Último almuerzo en NYC",
            },
            notes: "Check-out, últimas compras, vuelo de regreso a las 19:45",
          },
        ],
        budget: {
          flights: 1260,
          hotel: 1800,
          activities: 710,
          extras: 600,
          total: 4370,
        },
      },

      // Viaje 3: Punta Cana - En Progreso (Progress)
      {
        id: "demo_trip_puntacana_2025",
        name: "Santo Domingo → Punta Cana",
        origin: "Santo Domingo",
        destination: "Punta Cana",
        startDate: "2025-11-10T00:00:00.000Z",
        endDate: "2025-11-15T00:00:00.000Z",
        travelers: 4,
        status: "progress",
        createdAt: "2025-10-01T09:15:00.000Z",
        travelInfo: {
          origin: "Santo Domingo",
          destination: "Punta Cana",
          startDate: "2025-11-10",
          endDate: "2025-11-15",
          travelers: 4,
          flightPreference: "Flexible (cualquier opción disponible)",
          accommodationType: "Resort todo incluido",
          activities: [
            "Playas y relajación",
            "Aventura y deportes extremos",
            "Naturaleza y senderismo",
          ],
          budget: "Moderado ($1,000 - $3,000 USD)",
          organizedActivities: true,
        },
        flights: {
          outbound: {
            airline: "Arajet",
            flightNumber: "DM245",
            origin: "Santo Domingo (SDQ)",
            destination: "Punta Cana (PUJ)",
            departureDate: "2025-11-10",
            departureTime: "08:00",
            arrivalDate: "2025-11-10",
            arrivalTime: "09:00",
            duration: "1h 00m",
            flightClass: "Economy",
            confirmationCode: "ARAJPC10",
            price: 120,
            baggage: "1 maleta de 23kg incluida",
            type: "outbound",
          },
          return: {
            airline: "Arajet",
            flightNumber: "DM246",
            origin: "Punta Cana (PUJ)",
            destination: "Santo Domingo (SDQ)",
            departureDate: "2025-11-15",
            departureTime: "18:00",
            arrivalDate: "2025-11-15",
            arrivalTime: "19:00",
            duration: "1h 00m",
            flightClass: "Economy",
            confirmationCode: "ARAJSD15",
            price: 120,
            baggage: "1 maleta de 23kg incluida",
            type: "return",
          },
        },
        hotel: {
          hotelName: "Paradisus Palma Real Golf & Spa Resort",
          category: "Resort todo incluido",
          address: "Playa de Bávaro, Punta Cana 23000",
          checkIn: "2025-11-10",
          checkOut: "2025-11-15",
          nights: 5,
          roomType: "Junior Suite Familiar - Todo Incluido",
          guests: 4,
          amenities: [
            "Todo incluido (comidas y bebidas ilimitadas)",
            "WiFi gratuito en todo el resort",
            "Acceso a 5 piscinas",
            "Playa privada",
            "Spa y gimnasio",
            "Club infantil",
            "Shows nocturnos",
            "Deportes acuáticos no motorizados",
            "Campo de golf",
            "8 restaurantes temáticos",
          ],
          confirmationCode: "PRDPC2025",
          totalPrice: 2400,
          pricePerNight: 480,
        },
        activities: [
          {
            id: "act_pc_1",
            name: "Excursión a Isla Saona",
            category: "Playas y relajación",
            description:
              "Día completo en la paradisíaca Isla Saona. Incluye catamarán, almuerzo buffet en la playa, snorkel y bebidas.",
            date: "2025-11-11",
            time: "07:30",
            duration: "8 horas",
            location: "Isla Saona, Parque Nacional del Este",
            price: 360,
            confirmationCode: "SAONA11",
            included: [
              "Transporte",
              "Almuerzo",
              "Bebidas",
              "Equipo snorkel",
              "Guía",
            ],
          },
          {
            id: "act_pc_2",
            name: "Zipline Adventure Park",
            category: "Aventura y deportes extremos",
            description:
              "Circuito de 8 líneas de tirolesa sobre el dosel de la jungla, puente colgante y cenote natural.",
            date: "2025-11-13",
            time: "10:00",
            duration: "4 horas",
            location: "Scape Park, Cap Cana",
            price: 280,
            confirmationCode: "ZIPPC13",
            included: [
              "Equipo de seguridad",
              "Guía certificado",
              "Transporte",
              "Agua",
            ],
          },
          {
            id: "act_pc_3",
            name: "Trekking y Cascadas de Damajagua",
            category: "Naturaleza y senderismo",
            description:
              "Aventura de trekking hasta las 27 cascadas. Incluye saltos al agua, toboganes naturales y baño en pozas.",
            date: "2025-11-14",
            time: "08:00",
            duration: "6 horas",
            location: "Damajagua, Puerto Plata",
            price: 320,
            confirmationCode: "DAMA14PC",
            included: [
              "Transporte",
              "Guía",
              "Equipo (casco y chaleco)",
              "Almuerzo",
            ],
          },
        ],
        itinerary: [
          {
            day: 1,
            date: "2025-11-10",
            title: "Llegada al Paraíso",
            activities: [],
            meals: {
              breakfast: "En Santo Domingo",
              lunch: "Buffet en el resort",
              dinner: "Restaurante italiano del resort",
            },
            notes:
              "Check-in a las 15:00. Tarde libre para explorar el resort y la playa.",
          },
          {
            day: 2,
            date: "2025-11-11",
            title: "Isla Saona",
            activities: [
              {
                id: "act_pc_1",
                name: "Excursión a Isla Saona",
                category: "Playas y relajación",
                description: "Día completo en Isla Saona",
                date: "2025-11-11",
                time: "07:30",
                duration: "8 horas",
                location: "Isla Saona",
                price: 360,
                confirmationCode: "SAONA11",
                included: ["Transporte", "Almuerzo", "Bebidas"],
              },
            ],
            meals: {
              breakfast: "Desayuno buffet en el resort (6:30 AM)",
              lunch: "Almuerzo incluido en la excursión",
              dinner: "Restaurante japonés del resort",
            },
          },
          {
            day: 3,
            date: "2025-11-12",
            title: "Día de Playa y Relax",
            activities: [],
            meals: {
              breakfast: "Desayuno buffet en el resort",
              lunch: "Grill en la playa",
              dinner: "Restaurante mexicano del resort",
            },
            notes: "Día libre para disfrutar playa, piscina y spa",
          },
          {
            day: 4,
            date: "2025-11-13",
            title: "Aventura Extrema",
            activities: [
              {
                id: "act_pc_2",
                name: "Zipline Adventure Park",
                category: "Aventura y deportes extremos",
                description: "Tirolesa en la jungla",
                date: "2025-11-13",
                time: "10:00",
                duration: "4 horas",
                location: "Scape Park",
                price: 280,
                confirmationCode: "ZIPPC13",
                included: ["Equipo", "Guía", "Transporte"],
              },
            ],
            meals: {
              breakfast: "Desayuno buffet en el resort",
              lunch: "Snack en Scape Park",
              dinner: "Cena especial Caribbean Night en el resort",
            },
          },
          {
            day: 5,
            date: "2025-11-14",
            title: "Cascadas de Damajagua",
            activities: [
              {
                id: "act_pc_3",
                name: "Trekking Cascadas de Damajagua",
                category: "Naturaleza y senderismo",
                description: "27 cascadas",
                date: "2025-11-14",
                time: "08:00",
                duration: "6 horas",
                location: "Damajagua",
                price: 320,
                confirmationCode: "DAMA14PC",
                included: ["Transporte", "Guía", "Equipo", "Almuerzo"],
              },
            ],
            meals: {
              breakfast: "Desayuno buffet en el resort (6:30 AM)",
              lunch: "Almuerzo incluido en la excursión",
              dinner: "Restaurante steakhouse del resort",
            },
          },
          {
            day: 6,
            date: "2025-11-15",
            title: "Último día y regreso",
            activities: [],
            meals: {
              breakfast: "Desayuno buffet en el resort",
              lunch: "Última comida en el resort",
            },
            notes: "Check-out a las 12:00. Vuelo a las 18:00",
          },
        ],
        budget: {
          flights: 240,
          hotel: 2400,
          activities: 960,
          extras: 400,
          total: 4000,
        },
      },
    ];

    // Guardar todos los viajes demo
    demoTrips.forEach((trip) => {
      CompletedTripsManager.saveTrip(trip);
    });

    // Marcar como inicializado
    this.markAsInitialized();

    console.log(`✅ ${demoTrips.length} demo trips created successfully!`);
  }

  // Resetear demos (útil para desarrollo)
  static resetDemoTrips(): void {
    if (typeof window === "undefined") return;

    // Limpiar flag de inicialización
    localStorage.removeItem(this.DEMO_INITIALIZED_KEY);

    // Obtener todos los viajes
    const allTrips = CompletedTripsManager.getAllTrips();

    // Eliminar solo los viajes demo
    const demoIds = [
      "demo_trip_paris_2024",
      "demo_trip_nyc_2024",
      "demo_trip_puntacana_2025",
    ];

    demoIds.forEach((id) => {
      if (allTrips.some((trip) => trip.id === id)) {
        CompletedTripsManager.deleteTrip(id);
      }
    });
  }
}
