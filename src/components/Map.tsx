import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "../lib/utils";

interface MapProps {
  className?: string;
  pickup?: string;
  dropoff?: string;
  onLocationSelect?: (location: string) => void;
}

export default function Map({ className, pickup, dropoff, onLocationSelect }: MapProps) {
  const handleMapClick = (e: React.MouseEvent) => {
    if (!onLocationSelect) return;
    
    // Simulate getting address from coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const simulatedAddress = `Location at ${x.toFixed(1)}%, ${y.toFixed(1)}%`;
    onLocationSelect(simulatedAddress);
  };

  return (
    <div 
      className={cn("relative w-full h-full bg-gray-100 overflow-hidden cursor-crosshair", className)}
      onClick={handleMapClick}
    >
      {/* Placeholder for actual map implementation */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1920/1080?blur=4')] bg-cover bg-center opacity-50" />
      
      {/* Grid overlay for map feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Markers */}
      {pickup && (
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-green-500 text-white p-2 rounded-full shadow-xl animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="mt-2 bg-white px-3 py-1 rounded-lg shadow-lg border border-gray-100">
            <span className="text-xs font-bold text-gray-900 truncate max-w-[150px] block">{pickup}</span>
          </div>
        </div>
      )}

      {pickup && dropoff && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1 bg-black/20 rounded-full rotate-12">
          <div className="absolute inset-0 bg-black rounded-full animate-pulse" />
        </div>
      )}

      {dropoff && (
        <div className="absolute top-2/3 left-2/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-black text-white p-2 rounded-full shadow-xl animate-bounce">
            <Navigation className="w-6 h-6" />
          </div>
          <div className="mt-2 bg-white px-3 py-1 rounded-lg shadow-lg border border-gray-100">
            <span className="text-xs font-bold text-gray-900 truncate max-w-[150px] block">{dropoff}</span>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-xl font-bold text-gray-700">+</span>
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-xl font-bold text-gray-700">-</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6">
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Map Context</p>
          <p className="text-xs font-medium text-gray-700">Powered by Gemini Maps Grounding</p>
        </div>
      </div>
    </div>
  );
}
