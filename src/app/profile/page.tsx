"use client";

import { useState } from "react";
import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { WizardProvider } from "@/components/wizard/WizardProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { Sidebar } from "@/components/sidebar/Sidebar";

interface UserStats {
  totalTrips: number;
  countriesVisited: number;
  progressTrips: number;
  savedAmount: number;
}

interface TripHistory {
  id: string;
  destination: string;
  date: string;
  status: "completed" | "progress" | "cancelled";
  image: string;
  duration: string;
  price: number;
}

const ProfilePageContent = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "settings"
  >("overview");

  // Mock data - Replace with real data from Firebase
  const userStats: UserStats = {
    totalTrips: 12,
    countriesVisited: 8,
    progressTrips: 2,
    savedAmount: 45000,
  };

  const tripHistory: TripHistory[] = [
    {
      id: "1",
      destination: "Punta Cana, República Dominicana",
      date: "15-20 Dic 2024",
      status: "progress",
      image: "https://source.unsplash.com/800x600/?punta-cana,beach",
      duration: "5 días",
      price: 35000,
    },
    {
      id: "2",
      destination: "Madrid, España",
      date: "10-18 Sep 2024",
      status: "completed",
      image: "https://source.unsplash.com/800x600/?madrid,spain",
      duration: "8 días",
      price: 52000,
    },
    {
      id: "3",
      destination: "Nueva York, USA",
      date: "5-12 Jul 2024",
      status: "completed",
      image: "https://source.unsplash.com/800x600/?new-york,city",
      duration: "7 días",
      price: 48000,
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-2 border-black/5">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-black to-black-olive flex items-center justify-center shadow-2xl ring-4 ring-white">
                <span className="text-white font-bold text-4xl md:text-5xl">
                  U
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-black mb-2">Usuario</h2>
              <p className="text-black/60 mb-4">usuario@email.com</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-4 py-2 bg-black/5 rounded-full text-sm font-medium text-black/70">
                  🌍 Explorador
                </span>
                <span className="px-4 py-2 bg-black/5 rounded-full text-sm font-medium text-black/70">
                  ⭐ Premium
                </span>
                <span className="px-4 py-2 bg-black/5 rounded-full text-sm font-medium text-black/70">
                  🎯 Aventurero
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="p-3 rounded-xl bg-black text-white hover:bg-black-olive transition-all duration-300 shadow-lg">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <button className="p-3 rounded-xl bg-white border-2 border-black/10 hover:bg-black/5 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 shadow-lg border-2 border-black/5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-black to-black-olive text-white shadow-lg"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-black to-black-olive text-white shadow-lg"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="hidden sm:inline">Historial</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-black to-black-olive text-white shadow-lg"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="hidden sm:inline">Configuración</span>
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-black/5 hover:border-black/20 transition-all duration-300 hover:shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-black-olive flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-black mb-1">
                    {userStats.totalTrips}
                  </p>
                  <p className="text-sm text-black/60">Viajes Totales</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-black/5 hover:border-black/20 transition-all duration-300 hover:shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-black-olive flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-black mb-1">
                    {userStats.countriesVisited}
                  </p>
                  <p className="text-sm text-black/60">Países Visitados</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-black/5 hover:border-black/20 transition-all duration-300 hover:shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-black-olive flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-black mb-1">
                    {userStats.progressTrips}
                  </p>
                  <p className="text-sm text-black/60">Próximos Viajes</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-black/5 hover:border-black/20 transition-all duration-300 hover:shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-black-olive flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-black mb-1">
                    ${(userStats.savedAmount / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-black/60">Ahorrado con Mapi</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-black/5">
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  {tripHistory.slice(0, 3).map((trip) => (
                    <div
                      key={trip.id}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-black/10 to-black-olive/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-black/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-black">
                          {trip.destination}
                        </p>
                        <p className="text-sm text-black/60">
                          {trip.date} • {trip.duration}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trip.status === "progress"
                            ? "bg-green-100 text-green-700"
                            : trip.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {trip.status === "progress"
                          ? "En Progreso"
                          : trip.status === "completed"
                          ? "Completado"
                          : "Cancelado"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-black">
                  Historial de Viajes
                </h3>
                <select className="px-4 py-2 rounded-xl border-2 border-black/10 bg-white text-black font-medium hover:border-black/30 transition-all duration-300 cursor-pointer">
                  <option>Todos</option>
                  <option>Completados</option>
                  <option>Próximos</option>
                  <option>Cancelados</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-2xl overflow-hidden border-2 border-black/5 hover:border-black/20 transition-all duration-300 hover:shadow-xl cursor-pointer group"
                  >
                    <div className="relative h-48 bg-gray-200">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            trip.status === "progress"
                              ? "bg-green-500/90 text-white"
                              : trip.status === "completed"
                              ? "bg-blue-500/90 text-white"
                              : "bg-gray-500/90 text-white"
                          }`}
                        >
                          {trip.status === "progress"
                            ? "En Progreso"
                            : trip.status === "completed"
                            ? "Completado"
                            : "Cancelado"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-lg text-black mb-2 group-hover:text-black-olive transition-colors">
                        {trip.destination}
                      </h4>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-black/60 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {trip.date}
                        </p>
                        <p className="text-sm text-black/60 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {trip.duration}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-black/10">
                        <span className="text-2xl font-bold text-black">
                          ${trip.price.toLocaleString()}
                        </span>
                        <button className="p-2 rounded-lg bg-black text-white hover:bg-black-olive transition-all duration-300">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-black/5">
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black/70 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      defaultValue="Usuario"
                      className="w-full px-4 py-3 rounded-xl border-2 border-black/10 focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black/70 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="usuario@email.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-black/10 focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black/70 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 809 555 1234"
                      className="w-full px-4 py-3 rounded-xl border-2 border-black/10 focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black/70 mb-2">
                      País
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border-2 border-black/10 focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300">
                      <option>República Dominicana</option>
                      <option>Estados Unidos</option>
                      <option>España</option>
                      <option>México</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="px-6 py-3 bg-gradient-to-r from-black to-black-olive text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Guardar Cambios
                  </button>
                  <button className="px-6 py-3 bg-white border-2 border-black/10 text-black rounded-xl font-semibold hover:bg-black/5 transition-all duration-300">
                    Cancelar
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-black/5">
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Preferencias
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-black/5 transition-all duration-300">
                    <div>
                      <p className="font-semibold text-black">
                        Notificaciones por Email
                      </p>
                      <p className="text-sm text-black/60">
                        Recibir actualizaciones de viajes
                      </p>
                    </div>
                    <button className="w-14 h-8 bg-black rounded-full relative transition-all duration-300">
                      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-black/5 transition-all duration-300">
                    <div>
                      <p className="font-semibold text-black">
                        Notificaciones Push
                      </p>
                      <p className="text-sm text-black/60">
                        Alertas de ofertas y descuentos
                      </p>
                    </div>
                    <button className="w-14 h-8 bg-gray-300 rounded-full relative transition-all duration-300">
                      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-black/5 transition-all duration-300">
                    <div>
                      <p className="font-semibold text-black">Modo Oscuro</p>
                      <p className="text-sm text-black/60">
                        Cambiar tema de la aplicación
                      </p>
                    </div>
                    <button className="w-14 h-8 bg-gray-300 rounded-full relative transition-all duration-300">
                      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-red-200">
                <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Zona Peligrosa
                </h3>
                <div className="space-y-4">
                  <button className="w-full px-6 py-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar Cuenta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfilePageLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <ProfilePageContent />
      </div>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <NavigationProvider>
      <WizardProvider>
        <SidebarProvider>
          <ProfilePageLayout />
        </SidebarProvider>
      </WizardProvider>
    </NavigationProvider>
  );
}
