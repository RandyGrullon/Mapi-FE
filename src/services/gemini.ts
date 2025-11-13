/**
 * Servicio de Gemini AI
 * Integración con Google Gemini para búsqueda inteligente de opciones de viaje
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Obtener API key de variables de entorno (recomendado para producción)
const GEMINI_API_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "AIzaSyCBSN-F1jGQurbG9SMHOhOZ3X-s9LrNylo";

// Validar que la API key existe
if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
  console.error("❌ GEMINI_API_KEY no está configurada");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Tipos para las respuestas estructuradas
export interface FlightOption {
  airline: string;
  flightNumber: string;
  // Campos de ubicación (ciudades/aeropuertos)
  departure: string; // Ciudad/aeropuerto de origen (ej: "Santo Domingo")
  arrival: string; // Ciudad/aeropuerto de destino (ej: "Barcelona")
  origin?: string; // Alias para departure (para mayor claridad)
  destination?: string; // Alias para arrival (para mayor claridad)
  // Campos de tiempo
  departureTime: string; // Hora de salida (ej: "14:30")
  arrivalTime: string; // Hora de llegada (ej: "22:15")
  departureDate?: string; // Fecha de salida (ej: "2024-03-15")
  arrivalDate?: string; // Fecha de llegada (ej: "2024-03-16")
  duration: string;
  price: number;
  stops: number;
  class: "Economy" | "Business" | "First";
  bookingUrl: string;
  details?: string;
  segmentIndex?: number; // Índice del segmento (0 = ida, 1 = regreso, etc.)
  segmentType?: "outbound" | "return"; // Tipo de segmento para ida y vuelta
}

export interface HotelOption {
  name: string;
  stars: number;
  location: string;
  amenities: string[];
  pricePerNight: number;
  rating: number;
  reviews: number;
  description?: string;
  bookingUrl: string;
}

export interface CarRentalOption {
  company: string;
  carType: string;
  carModel: string;
  transmission: "automatic" | "manual";
  seats: number;
  pricePerDay: number;
  totalDays: number;
  totalPrice: number;
  features: string[];
  rating: number;
  bookingUrl: string;
}

export interface ActivityOption {
  name: string;
  category: string;
  duration: string;
  price: number;
  rating: number;
  included: string[];
  description: string;
  schedule?: string;
  bookingUrl: string;
}

export interface PackageBenefits {
  cancellation: string;
  payment: string;
  support: string;
}

export interface TravelSearchResult {
  flights: FlightOption[];
  hotels: HotelOption[];
  carRentals: CarRentalOption[];
  activities: ActivityOption[];
  benefits: PackageBenefits;
  summary: string;
}

interface TravelSearchParams {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  flightPreference?: string;
  accommodationType?: string;
  activities?: string[];
  budget?: string;
  selectedServices?: string[]; // Servicios que el usuario seleccionó
  flightType?: "one-way" | "round-trip" | "multi-city"; // Tipo de vuelo
  flightSegments?: Array<{ from: string; to: string; date?: string }>; // Segmentos de vuelo para multi-ciudad
}

/**
 * Construye el prompt para Gemini basado en las preferencias del usuario
 */
function buildSearchPrompt(params: TravelSearchParams): string {
  const {
    origin,
    destination,
    startDate,
    endDate,
    travelers,
    flightPreference,
    accommodationType,
    activities,
    budget,
    selectedServices = ["flights", "hotel", "car", "activities"], // Por defecto todos
    flightType = "round-trip", // Por defecto ida y vuelta
    flightSegments = [], // Segmentos para multi-ciudad
  } = params;

  // Calcular duración del viaje
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determinar qué servicios solicitar
  const needsFlights = selectedServices.includes("flights");
  const needsHotel = selectedServices.includes("hotel");
  const needsCar = selectedServices.includes("car");
  const needsActivities = selectedServices.includes("activities");

  // Determinar el texto del tipo de vuelo y las instrucciones específicas
  let flightTypeText = "";
  let flightInstructions = "";

  if (needsFlights) {
    switch (flightType) {
      case "one-way":
        flightTypeText = "Solo ida";
        flightInstructions = `
- **TIPO DE VUELO:** Solo ida (ONE-WAY)
- Proporciona ÚNICAMENTE opciones de vuelo de ${origin} a ${destination}
- NO incluyas vuelos de regreso
- Cada opción debe ser un vuelo directo de ida`;
        break;

      case "round-trip":
        const seg0 = flightSegments[0] || { from: origin, to: destination };
        const seg1 = flightSegments[1] || { from: destination, to: origin };
        flightTypeText = "Ida y vuelta";
        flightInstructions = `
- **TIPO DE VUELO:** Ida y vuelta (ROUND-TRIP)
- Proporciona opciones que incluyan tanto el vuelo de ida como el de regreso
- Vuelo de ida (segmentIndex: 0): ${seg0.from} → ${seg0.to} (${startDate})
- Vuelo de regreso (segmentIndex: 1): ${seg1.from} → ${seg1.to} (${endDate})
- El precio debe incluir ambos vuelos
- IMPORTANTE: Para cada opción de vuelo de IDA, el campo "departure" debe ser "${seg0.from}" y "arrival" debe ser "${seg0.to}"
- IMPORTANTE: Para cada opción de vuelo de REGRESO, el campo "departure" debe ser "${seg1.from}" y "arrival" debe ser "${seg1.to}"`;
        break;

      case "multi-city":
        flightTypeText = "Varias ciudades";
        const segmentsText = flightSegments
          .map(
            (seg, idx) =>
              `  ${idx + 1}. ${seg.from} → ${seg.to}${
                seg.date ? ` (${seg.date})` : ""
              }`
          )
          .join("\n");
        flightInstructions = `
- **TIPO DE VUELO:** Varias ciudades (MULTI-CITY)
- El viaje incluye múltiples segmentos:
${segmentsText}
- Proporciona opciones que conecten todas estas ciudades
- El precio debe incluir TODOS los segmentos de vuelo
- Asegúrate de que las conexiones sean lógicas y factibles`;
        break;
    }
  }

  // Construir el objeto JSON según los servicios seleccionados
  let jsonStructure = "{\n";

  if (needsFlights) {
    // Estructura diferente según el tipo de vuelo
    if (flightType === "one-way") {
      const seg0 = flightSegments[0] || { from: origin, to: destination };
      jsonStructure += `  "flights": [
    {
      "airline": "Nombre de aerolínea real",
      "flightNumber": "Código de vuelo",
      "departure": "${seg0.from}",
      "arrival": "${seg0.to}",
      "departureTime": "HH:MM",
      "arrivalTime": "HH:MM",
      "departureDate": "${startDate}",
      "arrivalDate": "YYYY-MM-DD",
      "duration": "Xh XXm",
      "price": número,
      "stops": número (0 para directo),
      "class": "Economy" | "Business" | "First",
      "details": "Información adicional breve",
      "bookingUrl": "https://sitio-oficial-de-la-aerolinea.com/reserva",
      "segmentIndex": 0
    }
  ],\n`;
    } else if (flightType === "round-trip") {
      // Usar los segmentos específicos para ida y vuelta
      const seg0 = flightSegments[0] || { from: origin, to: destination };
      const seg1 = flightSegments[1] || { from: destination, to: origin };

      // Para ida y vuelta, especificar claramente ambos vuelos
      jsonStructure += `  "flights": [
    // VUELOS DE IDA (${seg0.from} → ${seg0.to})
    {
      "airline": "Nombre de aerolínea real",
      "flightNumber": "Código de vuelo",
      "departure": "${seg0.from}",
      "arrival": "${seg0.to}",
      "departureTime": "HH:MM",
      "arrivalTime": "HH:MM",
      "departureDate": "${startDate}",
      "arrivalDate": "YYYY-MM-DD (puede ser el mismo día o día siguiente según vuelo)",
      "duration": "Xh XXm",
      "price": número,
      "stops": número (0 para directo),
      "class": "Economy" | "Business" | "First",
      "details": "Vuelo de ida",
      "bookingUrl": "https://sitio-oficial-de-la-aerolinea.com/reserva",
      "segmentIndex": 0,
      "segmentType": "outbound"
    },
    // VUELOS DE REGRESO (${seg1.from} → ${seg1.to})
    {
      "airline": "Nombre de aerolínea real",
      "flightNumber": "Código de vuelo",
      "departure": "${seg1.from}",
      "arrival": "${seg1.to}",
      "departureTime": "HH:MM",
      "arrivalTime": "HH:MM",
      "departureDate": "${endDate}",
      "arrivalDate": "YYYY-MM-DD (puede ser el mismo día o día siguiente según vuelo)",
      "duration": "Xh XXm",
      "price": número,
      "stops": número (0 para directo),
      "class": "Economy" | "Business" | "First",
      "details": "Vuelo de regreso",
      "bookingUrl": "https://sitio-oficial-de-la-aerolinea.com/reserva",
      "segmentIndex": 1,
      "segmentType": "return"
    }
  ],\n`;
    } else {
      // Multi-ciudad
      const segmentExamples = flightSegments
        .map(
          (seg, idx) =>
            `    // Vuelo ${idx + 1}: ${seg.from} → ${seg.to}
    {
      "airline": "Nombre de aerolínea real",
      "flightNumber": "Código de vuelo",
      "departure": "${seg.from}",
      "arrival": "${seg.to}",
      "departureTime": "HH:MM",
      "arrivalTime": "HH:MM",
      "departureDate": "${seg.date || "YYYY-MM-DD"}",
      "arrivalDate": "YYYY-MM-DD",
      "duration": "Xh XXm",
      "price": número,
      "stops": número (0 para directo),
      "class": "Economy" | "Business" | "First",
      "details": "Vuelo ${idx + 1}",
      "bookingUrl": "https://sitio-oficial-de-la-aerolinea.com/reserva",
      "segmentIndex": ${idx}
    }`
        )
        .join(",\n");

      jsonStructure += `  "flights": [\n${segmentExamples}\n  ],\n`;
    }
  } else {
    jsonStructure += `  "flights": [],\n`;
  }

  if (needsHotel) {
    jsonStructure += `  "hotels": [
    {
      "name": "Nombre del hotel real",
      "stars": número (1-5),
      "location": "Ubicación específica en ${destination}",
      "amenities": ["servicio1", "servicio2", "servicio3"],
      "pricePerNight": número,
      "rating": número (1-5 con decimales),
      "reviews": número de reseñas,
      "description": "Descripción breve del hotel",
      "bookingUrl": "https://www.booking.com/hotel/xx/nombre-hotel.html"
    }
  ],\n`;
  } else {
    jsonStructure += `  "hotels": [],\n`;
  }

  if (needsCar) {
    jsonStructure += `  "carRentals": [
    {
      "company": "Empresa de alquiler real (Hertz, Avis, etc)",
      "carType": "Tipo de vehículo",
      "carModel": "Modelo específico",
      "transmission": "automatic" | "manual",
      "seats": número,
      "pricePerDay": número,
      "totalDays": ${duration},
      "totalPrice": número (pricePerDay * totalDays),
      "features": ["característica1", "característica2"],
      "rating": número (1-5 con decimales),
      "bookingUrl": "https://www.hertz.com/rentacar/reservation?location=XXX"
    }
  ],\n`;
  } else {
    jsonStructure += `  "carRentals": [],\n`;
  }

  if (needsActivities) {
    jsonStructure += `  "activities": [
    {
      "name": "Nombre de la actividad",
      "category": "Categoría (tours, aventura, cultural, etc)",
      "duration": "Xh XXm",
      "price": número por persona,
      "rating": número (1-5 con decimales),
      "included": ["incluido1", "incluido2"],
      "description": "Descripción detallada",
      "schedule": "Horario disponible",
      "bookingUrl": "https://www.getyourguide.com/activity-url o https://www.viator.com/tours/xxx"
    }
  ],\n`;
  } else {
    jsonStructure += `  "activities": [],\n`;
  }

  // Beneficios siempre se incluyen
  jsonStructure += `  "benefits": {
    "cancellation": "Política de cancelación (ej: Cancelación gratuita hasta X horas antes)",
    "payment": "Opciones de pago (ej: Pago en X cuotas sin interés, tarjetas aceptadas)",
    "support": "Soporte disponible (ej: Soporte 24/7 durante el viaje, asistencia multilingüe)"
  },\n`;

  jsonStructure += `  "summary": "Resumen breve de las mejores opciones encontradas"
}`;

  // Construir criterios de selección según servicios activos
  let selectionCriteria = "\n**CRITERIOS DE SELECCIÓN:**\n";
  if (needsFlights) {
    if (flightType === "one-way") {
      const seg0 = flightSegments[0] || { from: origin, to: destination };
      selectionCriteria +=
        "- Proporciona al menos 3 opciones de vuelos de ida (económico, medio, premium)\n";
      selectionCriteria +=
        "- Todos los vuelos deben ser de " + seg0.from + " a " + seg0.to + "\n";
    } else if (flightType === "round-trip") {
      const seg0 = flightSegments[0] || { from: origin, to: destination };
      const seg1 = flightSegments[1] || { from: destination, to: origin };
      selectionCriteria +=
        "- Proporciona al menos 3 opciones de vuelos de IDA (" +
        seg0.from +
        " → " +
        seg0.to +
        ")\n";
      selectionCriteria +=
        "- Proporciona al menos 3 opciones de vuelos de REGRESO (" +
        seg1.from +
        " → " +
        seg1.to +
        ")\n";
      selectionCriteria +=
        "- ⚠️ CRÍTICO: Los vuelos de IDA deben tener departure='" +
        seg0.from +
        "' y arrival='" +
        seg0.to +
        "'\n";
      selectionCriteria +=
        "- ⚠️ CRÍTICO: Los vuelos de REGRESO deben tener departure='" +
        seg1.from +
        "' y arrival='" +
        seg1.to +
        "'\n";
      selectionCriteria +=
        "- Los vuelos de ida y regreso deben ser opciones INDEPENDIENTES (el usuario elegirá uno de ida y uno de regreso)\n";
      selectionCriteria +=
        "- Cada vuelo debe tener su propio precio individual\n";
      selectionCriteria +=
        "- El campo 'segmentIndex' debe ser 0 para vuelos de ida y 1 para vuelos de regreso\n";
      selectionCriteria +=
        "- El campo 'segmentType' debe ser 'outbound' para vuelos de ida y 'return' para vuelos de regreso\n";
    } else {
      selectionCriteria +=
        "- Proporciona al menos 3 opciones para CADA segmento del viaje:\n";
      flightSegments.forEach((seg, idx) => {
        selectionCriteria += `  - Segmento ${idx + 1}: ${seg.from} → ${
          seg.to
        }\n`;
      });
      selectionCriteria +=
        "- Cada vuelo debe tener el campo 'segmentIndex' indicando a qué segmento pertenece\n";
    }
    selectionCriteria += flightInstructions + "\n";
  }
  if (needsHotel) {
    selectionCriteria +=
      "- Proporciona al menos 3 opciones de hoteles (diferentes rangos de estrellas)\n";
  }
  if (needsCar) {
    selectionCriteria +=
      "- Proporciona al menos 2 opciones de alquiler de auto\n";
  }
  if (needsActivities) {
    selectionCriteria += `- Proporciona al menos 5 actividades populares en ${destination} que coincidan con los intereses: ${
      activities && activities.length > 0 ? activities.join(", ") : "variadas"
    }\n`;
  }

  const serviciosSolicitados = selectedServices
    .map((s) => {
      switch (s) {
        case "flights":
          return "✈️ Vuelos";
        case "hotel":
          return "🏨 Hotel";
        case "car":
          return "🚗 Auto de renta";
        case "activities":
          return "🎯 Actividades";
        default:
          return s;
      }
    })
    .join(", ");

  return `Eres un experto agente de viajes con acceso a información actualizada. 
Tu tarea es buscar y devolver las MEJORES opciones reales de viaje basadas en las siguientes preferencias del usuario:

**INFORMACIÓN DEL VIAJE:**
- Origen: ${origin}
- Destino: ${destination}
- Fecha de inicio: ${startDate}
- Fecha de fin: ${endDate}
- Duración: ${duration} días
- Número de viajeros: ${travelers}
${needsFlights ? `- Tipo de vuelo: ${flightTypeText}` : ""}
${flightPreference ? `- Preferencia de clase: ${flightPreference}` : ""}
${accommodationType ? `- Tipo de alojamiento: ${accommodationType}` : ""}
${
  activities && activities.length > 0
    ? `- Actividades de interés: ${activities.join(", ")}`
    : ""
}
${budget ? `- Presupuesto: ${budget}` : ""}

**🎯 SERVICIOS SOLICITADOS:** ${serviciosSolicitados}

---

### 🧠 REGLAS ESPECIALES PARA LOS ENLACES (\`bookingUrl\`)
- Cada campo \`bookingUrl\` DEBE contener una URL real y funcional hacia el sitio oficial o distribuidor confiable:
  - **Vuelos:** dominios oficiales de aerolíneas o agregadores conocidos (ej: \`https://www.kayak.com/flights\`, \`https://www.skyscanner.com\`, \`https://www.google.com/flights\`)
  - **Hoteles:** \`https://www.booking.com\`, \`https://www.expedia.com\`, \`https://www.hotels.com\` o sitio oficial del hotel
  - **Autos:** \`https://www.hertz.com\`, \`https://www.avis.com\`, \`https://www.budget.com\`, \`https://www.enterprise.com\`, \`https://www.rentalcars.com\`
  - **Actividades:** \`https://www.tripadvisor.com\`, \`https://www.viator.com\`, \`https://www.getyourguide.com\`
- NO inventes dominios. Si no hay URL exacta disponible, usa un enlace genérico del proveedor real.
- Todos los enlaces deben comenzar con \`https://\` y estar correctamente formateados como strings.

---

**INSTRUCCIONES IMPORTANTES:**
1. Busca y proporciona opciones REALES y ACTUALES que existan en el mercado
2. Los precios deben ser realistas y acordes al mercado actual (en USD)
3. Las aerolíneas, hoteles y empresas deben ser reales y verificables
4. **🔗 CADA opción DEBE incluir un campo "bookingUrl" con un enlace directo y funcional**
${
  needsActivities
    ? `5. Las actividades deben estar disponibles en ${destination}`
    : ""
}
${
  needsActivities ? "6" : "5"
}. ⚠️ IMPORTANTE: SOLO proporciona información para los servicios solicitados
${!needsFlights ? '   - NO incluyas vuelos (array vacío: "flights": [])' : ""}
${!needsHotel ? '   - NO incluyas hoteles (array vacío: "hotels": [])' : ""}
${
  !needsCar
    ? '   - NO incluyas autos de renta (array vacío: "carRentals": [])'
    : ""
}
${
  !needsActivities
    ? '   - NO incluyas actividades (array vacío: "activities": [])'
    : ""
}

**FORMATO DE RESPUESTA (JSON estricto):**
Debes responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:

${jsonStructure}
${selectionCriteria}

**📋 IMPORTANTE SOBRE LAS URLs:**
- Las URLs deben ser válidas y seguir el formato del sitio real
- Incluye parámetros relevantes en la URL cuando sea posible (fechas, ubicación, número de personas)
- Si no tienes la URL exacta, usa el formato típico del sitio principal + búsqueda
- **Ejemplos de URLs válidas:**
  - Vuelo: \`https://www.kayak.com/flights/${origin}-${destination}/${startDate}/${endDate}\`
  - Hotel: \`https://www.booking.com/searchresults.html?ss=${destination}&checkin=${startDate}&checkout=${endDate}\`
  - Auto: \`https://www.rentalcars.com/SearchResults.do?puYear=${
    startDate.split("-")[0]
  }&puMonth=${startDate.split("-")[1]}&puDay=${startDate.split("-")[2]}\`
  - Actividad: \`https://www.getyourguide.com/${destination.toLowerCase()}-l16/\`

**BENEFICIOS DEL PAQUETE:**
Proporciona información realista sobre los beneficios que ofrecen las empresas de viaje:
- "cancellation": Política de cancelación real (ej: "Cancelación gratuita hasta 24-72h antes", "Reembolso total hasta X días antes")
- "payment": Opciones de pago disponibles (ej: "Pago en 3-12 cuotas sin interés", "Acepta todas las tarjetas principales", "PayPal y transferencia disponibles")
- "support": Tipo de soporte ofrecido (ej: "Soporte 24/7 en español e inglés", "Asistencia al viajero incluida", "Chat en vivo durante el viaje")

**IMPORTANTE:** 
- NO incluyas texto adicional fuera del JSON
- Los precios deben ser números sin símbolos de moneda
- Asegúrate de que el JSON sea válido y pueda parsearse directamente
- Usa información real y actualizada del mercado de viajes
- Los beneficios deben ser realistas según las prácticas comunes de la industria
- Si un servicio NO fue solicitado, su array debe estar vacío []
- **TODOS los objetos deben tener su campo "bookingUrl"**`;
}

/**
 * Función auxiliar para esperar un tiempo determinado
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extrae el tiempo de reintento del error de Gemini si está disponible
 */
function extractRetryDelay(error: any): number {
  try {
    // Si el error es null o undefined, retornar 0
    if (!error) return 0;

    // Buscar en el mensaje del error
    const message = error?.message || error?.toString() || "";
    const retryMatch = message.match(/retry in ([\d.]+)s/i);
    if (retryMatch) {
      return Math.ceil(parseFloat(retryMatch[1]) * 1000);
    }

    // Buscar en error.error (estructura de GoogleGenerativeAIError)
    if (error?.error?.message) {
      const errorMessage = error.error.message;
      const retryMatch2 = errorMessage.match(/retry in ([\d.]+)s/i);
      if (retryMatch2) {
        return Math.ceil(parseFloat(retryMatch2[1]) * 1000);
      }
    }

    // Buscar en los detalles del error (error.error.details)
    const details = error?.error?.details || error?.details;
    if (Array.isArray(details)) {
      const retryInfo = details.find((d: any) =>
        d?.["@type"]?.includes("RetryInfo")
      );
      if (retryInfo?.retryDelay) {
        const delay = retryInfo.retryDelay;
        if (typeof delay === "string") {
          const seconds = parseFloat(delay.replace("s", ""));
          if (!isNaN(seconds)) {
            return Math.ceil(seconds * 1000);
          }
        }
      }
    }
  } catch (e) {
    // Si hay error parseando, ignorar silenciosamente
    console.log("⚠️ No se pudo extraer tiempo de reintento:", e);
  }
  return 0;
}

/**
 * Realiza la búsqueda de opciones de viaje usando Gemini AI
 * Con reintentos automáticos en caso de error 429
 */
export async function searchTravelOptions(
  params: TravelSearchParams,
  maxRetries: number = 3
): Promise<TravelSearchResult> {
  let lastError: any = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Intentar extraer el tiempo de reintento del error previo
        const suggestedDelay = extractRetryDelay(lastError);
        const waitTime =
          suggestedDelay > 0 ? suggestedDelay : Math.pow(2, attempt) * 2000; // Espera exponencial más larga: 4s, 8s, 16s

        console.log(
          `⏳ Intento ${attempt + 1}/${maxRetries} - Esperando ${Math.ceil(
            waitTime / 1000
          )}s antes de reintentar...`
        );
        await sleep(waitTime);
      }

      console.log("🤖 Consultando Gemini AI...");
      console.log("📋 Parámetros:", JSON.stringify(params, null, 2));
      console.log(
        "🔑 API Key configurada:",
        GEMINI_API_KEY
          ? `${GEMINI_API_KEY.substring(0, 10)}...`
          : "NO CONFIGURADA"
      );

      // Configurar el modelo con safety settings más permisivos
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      const prompt = buildSearchPrompt(params);

      console.log("📤 Enviando solicitud a Gemini...");
      console.log("📏 Longitud del prompt:", prompt.length, "caracteres");

      const result = await model.generateContent(prompt);
      const response = await result.response;

      // Verificar si la respuesta fue bloqueada por filtros de seguridad
      if (!response.candidates || response.candidates.length === 0) {
        console.error("❌ Respuesta bloqueada por filtros de seguridad");
        throw new Error(
          "🛡️ Contenido bloqueado por filtros de seguridad. Intenta con otros parámetros."
        );
      }

      const text = response.text();

      console.log("📝 Respuesta de Gemini:", text.substring(0, 500) + "...");

      // Extraer el JSON de la respuesta
      let jsonText = text.trim();

      // Limpiar markdown code blocks si existen
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/g, "");
      }

      // Parsear el JSON
      const parsedResult: TravelSearchResult = JSON.parse(jsonText);

      // Validar que tenga la estructura correcta
      if (
        !parsedResult.flights ||
        !parsedResult.hotels ||
        !parsedResult.carRentals ||
        !parsedResult.activities
      ) {
        throw new Error("Respuesta de Gemini no tiene la estructura esperada");
      }

      console.log("✅ Opciones encontradas:", {
        flights: parsedResult.flights.length,
        hotels: parsedResult.hotels.length,
        carRentals: parsedResult.carRentals.length,
        activities: parsedResult.activities.length,
      });

      return parsedResult;
    } catch (error) {
      lastError = error;
      console.error(`❌ Error en intento ${attempt + 1}/${maxRetries}:`, error);

      // Extraer mensaje de error de diferentes estructuras posibles
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        // Estructura de GoogleGenerativeAIError: error.error.message
        errorMessage =
          (error as any)?.error?.message || (error as any)?.message || "";
      }

      const errorStr = errorMessage.toLowerCase();
      const is429 =
        errorStr.includes("429") ||
        errorStr.includes("quota") ||
        errorStr.includes("resource exhausted") ||
        errorStr.includes("resource_exhausted") ||
        errorStr.includes("exceeded your current quota");

      if (is429) {
        console.log("🔄 Error 429 (cuota excedida) detectado.");

        if (attempt < maxRetries - 1) {
          const retryDelay = extractRetryDelay(error);
          if (retryDelay > 0) {
            console.log(
              `⏱️  Gemini sugiere reintentar en ${Math.ceil(
                retryDelay / 1000
              )}s`
            );
          }
          console.log("🔄 Reintentando automáticamente...");
          continue; // Reintentar
        } else {
          console.log(
            "⚠️  Se agotaron los reintentos. Por favor espera 1-2 minutos."
          );
        }
      }

      // Si no es 429 o es el último intento, salir del loop
      break;
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  console.error("❌ Error al buscar opciones con Gemini:", lastError);

  // Intentar serializar el error de forma segura
  try {
    console.error("❌ Error detallado:", JSON.stringify(lastError, null, 2));
  } catch {
    console.error("❌ Error detallado (no serializable):", lastError);
  }

  // Detectar el tipo de error y dar mensaje específico
  let errorMessage = "No se pudieron obtener opciones de viaje.";

  // Extraer mensaje del error (manejar diferentes estructuras)
  let errorStr = "";
  let errorName = "";

  if (lastError instanceof Error) {
    errorStr = lastError.message.toLowerCase();
    errorName = lastError.name?.toLowerCase() || "";
  } else if (typeof lastError === "object" && lastError !== null) {
    // GoogleGenerativeAIError tiene estructura: error.error.message
    const msg =
      (lastError as any)?.error?.message || (lastError as any)?.message || "";
    errorStr = typeof msg === "string" ? msg.toLowerCase() : "";
    errorName = (lastError as any)?.name?.toLowerCase() || "";
  }

  console.log("🔍 Tipo de error:", errorName || "unknown");
  console.log("🔍 Mensaje:", errorStr || "sin mensaje");

  // Error de API Key
  if (
    errorStr.includes("api key") ||
    errorStr.includes("invalid key") ||
    errorStr.includes("unauthorized") ||
    errorStr.includes("401")
  ) {
    errorMessage =
      "🔑 API Key de Gemini inválida o expirada. Verifica la configuración en Google AI Studio.";
  }
  // Error de cuota/límite
  else if (
    errorStr.includes("quota") ||
    errorStr.includes("limit") ||
    errorStr.includes("429") ||
    errorStr.includes("resource exhausted") ||
    errorStr.includes("resource_exhausted") ||
    errorStr.includes("exceeded your current quota")
  ) {
    // Intentar extraer el mensaje completo del error
    const fullErrorMsg =
      lastError instanceof Error
        ? lastError.message
        : (lastError as any)?.error?.message ||
          (lastError as any)?.message ||
          "";

    errorMessage =
      `⏱️ Límite de cuota de Gemini alcanzado (Error 429).\n\n` +
      "🔍 **Causa:** Has excedido el límite del tier gratuito de Gemini.\n\n" +
      "💡 **Soluciones inmediatas:**\n" +
      "1. ⏰ Espera 1-2 minutos y vuelve a intentar\n" +
      "2. 🔄 El sistema reintentará automáticamente 3 veces\n" +
      "3. 📊 Revisa tu uso en: https://ai.dev/usage\n\n" +
      "💡 **Soluciones a largo plazo:**\n" +
      "• El tier gratuito permite ~15 requests/minuto\n" +
      "• Considera espaciar tus búsquedas\n" +
      "• Para uso intensivo, actualiza al plan de pago en Google AI Studio\n\n" +
      `📝 **Detalles técnicos:**\n${fullErrorMsg}`;
  }
  // Error de red
  else if (
    errorStr.includes("fetch") ||
    errorStr.includes("network") ||
    errorStr.includes("connection") ||
    errorName.includes("fetch")
  ) {
    errorMessage =
      "🌐 Error de conexión con Gemini. Verifica tu internet e intenta de nuevo.";
  }
  // Error de modelo
  else if (
    errorStr.includes("model") ||
    errorStr.includes("not found") ||
    errorStr.includes("404")
  ) {
    errorMessage =
      "🤖 Modelo de Gemini no disponible. El modelo 'gemini-2.0-flash-exp' puede no estar accesible.";
  }
  // Error de parsing JSON
  else if (errorStr.includes("json") || errorStr.includes("parse")) {
    errorMessage = "📋 Error procesando respuesta de Gemini. Intenta de nuevo.";
  }
  // Errores de contenido bloqueado/seguridad
  else if (
    errorStr.includes("blocked") ||
    errorStr.includes("safety") ||
    errorStr.includes("content")
  ) {
    errorMessage =
      "🛡️ Contenido bloqueado por filtros de seguridad de Gemini. Intenta con otros parámetros.";
  }
  // Otros errores
  else if (errorStr) {
    errorMessage = `⚠️ ${errorStr}`;
  }

  throw new Error(errorMessage);
}

/**
 * Servicio principal de búsqueda
 */
export const geminiService = {
  searchTravelOptions,
};
