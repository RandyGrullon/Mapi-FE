"use client";

import { useState, useEffect } from "react";

type ProgressBarProps = {
  isActive: boolean;
  duration?: number; // in milliseconds
  onComplete?: () => void;
};

export const ProgressBar = ({
  isActive,
  duration = 1500,
  onComplete,
}: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    const interval = 50; // Update every 50ms for smoother animation
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        setIsComplete(true);
        onComplete?.();
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, duration, onComplete]);

  if (!isActive && progress === 0) {
    return null;
  }

  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
      <div
        className={`h-full rounded-full transition-all duration-100 ease-out ${
          isComplete ? "bg-green-500" : "bg-black"
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export const ThinkingIndicator = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center gap-3 text-gray-500 py-2 px-4 rounded-lg bg-gray-50 inline-flex mt-4">
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-black/60 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-black/60 rounded-full animate-bounce"
          style={{ animationDelay: "200ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-black/60 rounded-full animate-bounce"
          style={{ animationDelay: "400ms" }}
        ></div>
      </div>
      <span className="text-sm">Pensando...</span>
    </div>
  );
};
