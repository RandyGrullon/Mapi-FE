"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      router.push("/plan");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Hero Section Compact */}
      <section className="relative bg-black text-white py-8 px-6 flex-shrink-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border border-white rounded-full"></div>
          <div className="absolute bottom-4 left-8 w-10 h-10 border border-white rounded-full"></div>
          <div className="absolute bottom-8 right-4 w-8 h-8 border border-white rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Bienvenido de vuelta
          </h1>
          <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-400">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
              Planes personalizados
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
              IA avanzada
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1.5"></div>
              Soporte 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Centered and Flexible */}
      <div className="flex-1 flex flex-col justify-center px-6 py-4">
        <div className="max-w-md mx-auto w-full">
          {/* Login Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl mb-6">
            {/* Logo/Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-full mb-3">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600 text-sm">
                Accede a tu cuenta de Mapi
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 text-sm border-2 border-gray-200 focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Contraseña
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 text-sm border-2 border-gray-200 focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-black focus:ring-black w-3 h-3"
                  />
                  <span className="ml-2 text-xs text-gray-600">Recordarme</span>
                </label>
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-black-olive px-6 py-3 rounded-full font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">
                    o continúa con
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>
              <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Continuar con Twitter
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-xs">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>

          {/* Compact Features */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              ¿Por qué elegir Mapi?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-white text-xs">✈️</span>
                </div>
                <p className="text-xs text-gray-600 leading-tight">
                  Planificación Inteligente
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-white text-xs">💰</span>
                </div>
                <p className="text-xs text-gray-600 leading-tight">
                  Presupuestos Realistas
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-white text-xs">🌍</span>
                </div>
                <p className="text-xs text-gray-600 leading-tight">
                  Experiencias Únicas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Minimal */}
      <footer className="bg-gray-900 text-white py-3 px-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold">Mapi</span>
              <span className="text-gray-400 ml-2">© 2025</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-white transition-colors flex items-center text-xs"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Inicio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
