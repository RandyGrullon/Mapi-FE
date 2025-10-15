"use client";

import { useState, useEffect } from "react";
import { useWizard } from "./WizardProvider";

export const WelcomeScreen = () => {
  const { completeCurrentStep, resetWizard, steps } = useWizard();

  // Ya no necesitamos este useEffect porque los pasos ya están predefinidos

  const popularOrigins = [
    {
      icon: "🏙️",
      title: "Nueva York",
      description: "Estados Unidos",
      origin: "Nueva York",
    },
    {
      icon: "🏝️",
      title: "Santo Domingo",
      description: "República Dominicana",
      origin: "Santo Domingo",
    },
    {
      icon: "🗼",
      title: "Tokio",
      description: "Japón",
      origin: "Tokio",
    },
    {
      icon: "🇪🇸",
      title: "Madrid",
      description: "España",
      origin: "Madrid",
    },
  ];

  const handleSelectOrigin = (origin: (typeof popularOrigins)[0]) => {
    // Reset wizard to start fresh
    resetWizard();

    // Complete first step with selected origin
    completeCurrentStep(`Perfecto! Viajarás desde ${origin.title}. ✈️`, {
      field: "origin",
      value: origin.origin,
    });
    // No need to add next step - it's already predefined and will be unlocked
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-4xl w-full animate-fade-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-3xl md:text-4xl">
                M
              </span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-3 md:mb-4">
            ¡Planifica tu viaje perfecto!
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona una ciudad de origen o escribe desde dónde quieres viajar
            en el asistente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {popularOrigins.map((origin, index) => (
            <button
              key={index}
              className="group relative p-5 md:p-8 bg-white rounded-xl md:rounded-2xl border border-gray-200 hover:border-black/20 transition-all duration-300 text-left hover:shadow-xl transform active:scale-[0.98] overflow-hidden"
              onClick={() => handleSelectOrigin(origin)}
            >
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {origin.icon}
                </div>
                <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 group-hover:text-black transition-colors">
                  {origin.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {origin.description}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-2xl transform translate-x-12 md:translate-x-16 -translate-y-12 md:-translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => resetWizard()}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-all duration-200"
          >
            Quiero comenzar desde cero
          </button>
        </div>
      </div>
    </div>
  );
};
