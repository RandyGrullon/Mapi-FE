"use client";

import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { WizardProvider } from "@/components/wizard/WizardProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { useNavigation } from "@/components/navigation/NavigationContext";

const HomePage = () => {
  const { navigateToLogin } = useNavigation();

  return (
    <div className="h-screen bg-gray-50">
      <div className="overflow-y-auto overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Planifica tu viaje perfecto
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Tu asistente inteligente de viajes personalizado con IA
              </p>
            </div>

            <button
              onClick={navigateToLogin}
              className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Comenzar a Planificar
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              ¿Qué puedes hacer con Mapi?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Planificación Inteligente
                </h3>
                <p className="text-gray-600">
                  Nuestra IA analiza tus preferencias y crea itinerarios
                  personalizados según tu presupuesto, intereses y estilo de
                  viaje.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Presupuestos Realistas
                </h3>
                <p className="text-gray-600">
                  Obtén estimaciones precisas de costos incluyendo vuelos,
                  hospedaje, actividades y más, adaptadas a tu presupuesto.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Destinos Personalizados
                </h3>
                <p className="text-gray-600">
                  Desde playas paradisíacas hasta ciudades culturales, encuentra
                  el destino perfecto para tus intereses específicos.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Ahorra Tiempo
                </h3>
                <p className="text-gray-600">
                  Olvídate de horas investigando. En minutos tendrás un plan
                  completo con recomendaciones expertas.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Gestión Completa
                </h3>
                <p className="text-gray-600">
                  Organiza todos tus viajes en un solo lugar. Guarda borradores,
                  compara opciones y administra tus reservas.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Experiencias Únicas
                </h3>
                <p className="text-gray-600">
                  Descubre actividades locales, restaurantes recomendados y
                  experiencias que no encontrarás en guías tradicionales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              ¿Cómo funciona?
            </h2>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    Cuéntanos tus preferencias
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Responde unas pocas preguntas sobre tu destino, presupuesto,
                    fechas y preferencias de viaje.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    Recibe tu plan personalizado
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Nuestra IA crea un itinerario completo con vuelos,
                    hospedaje, actividades y recomendaciones específicas para
                    ti.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    Disfruta tu viaje perfecto
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Viaja con confianza sabiendo que tienes el mejor plan
                    posible para tus necesidades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gray-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para planificar tu próximo viaje?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Únete a miles de viajeros que ya confían en Mapi para sus
              aventuras
            </p>
            <button
              onClick={navigateToLogin}
              className="bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Comenzar Ahora - ¡Es Gratis!
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Mapi</h3>
              <p className="text-gray-400">Tu compañero de viaje inteligente</p>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400">
                © 2025 Mapi. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <NavigationProvider>
      <WizardProvider>
        <HomePage />
      </WizardProvider>
    </NavigationProvider>
  );
}
