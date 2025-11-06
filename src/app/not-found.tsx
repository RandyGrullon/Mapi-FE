"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number with Animation */}
        <div className="mb-8 relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-white opacity-10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <svg
                className="w-16 h-16 md:w-20 md:h-20 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Página no encontrada
          </h2>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 backdrop-blur-sm"
          >
            ← Volver Atrás
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Ir al Inicio
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 mb-4">O explora estas páginas:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/plan"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/5 rounded-lg"
            >
              Planificar Viaje
            </Link>
            <Link
              href="/packages"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/5 rounded-lg"
            >
              Paquetes
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/5 rounded-lg"
            >
              Perfil
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-white/10 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-40 right-10 w-3 h-3 bg-white/10 rounded-full animate-pulse delay-300" />
      </div>
    </div>
  );
}
