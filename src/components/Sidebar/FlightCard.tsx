'use client';

import React from 'react';
import { FlightData } from '@/types/flight';
import { Plane, ArrowUpRight, ArrowDownRight, Minus, Star } from 'lucide-react';

interface FlightCardProps {
  flight: FlightData;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (flight: FlightData) => void;
  onToggleFavorite: (flightId: string, e: React.MouseEvent) => void;
}

export function FlightCard({
  flight,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: FlightCardProps) {
  // Biểu tượng tốc độ nâng/hạ
  const renderVerticalIcon = () => {
    if (flight.verticalRateFpm > 200) {
      return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (flight.verticalRateFpm < -200) {
      return <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  // Màu sắc theo trạng thái
  const getStatusColor = () => {
    switch (flight.status) {
      case 'climbing':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
      case 'descending':
      case 'landing':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/30';
      case 'ground':
        return 'text-slate-400 border-slate-600 bg-slate-900/40';
      default:
        return 'text-[#00e5ff] border-[#00e5ff]/30 bg-[#00e5ff]/10';
    }
  };

  return (
    <div
      onClick={() => onSelect(flight)}
      className={`p-3 rounded-lg border transition-all cursor-pointer select-none relative ${
        isSelected
          ? 'bg-[#0f2142] border-[#00e5ff] shadow-[0_0_16px_rgba(0,229,255,0.2)]'
          : 'bg-[#0b1528] border-[#1e2e4f] hover:border-[#00e5ff]/40 hover:bg-[#0d1a33]'
      }`}
    >
      {/* Row 1: Callsign, Flight Number & Favorite Button */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className="p-1 rounded bg-[#070e1e] border border-[#1e2e4f] text-[#00e5ff]"
            style={{ transform: `rotate(${flight.track}deg)` }}
          >
            <Plane className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
              <span>{flight.callsign}</span>
              {flight.flightNumber && flight.flightNumber !== flight.callsign && (
                <span className="text-xs font-semibold text-[#00e5ff]">
                  ({flight.flightNumber})
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
              {flight.airline ? flight.airline.name : 'Không rõ hãng'}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => onToggleFavorite(flight.id, e)}
          className={`p-1.5 rounded-lg transition ${
            isFavorite
              ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
              : 'text-slate-500 hover:text-slate-300 hover:bg-[#1e2e4f]'
          }`}
          title={isFavorite ? 'Bỏ lưu' : 'Lưu chuyến bay'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Row 2: Route & Aircraft type */}
      <div className="flex items-center justify-between text-xs py-1.5 border-y border-[#1e2e4f]/60 text-slate-300">
        <div className="flex items-center gap-1 font-mono font-medium">
          {flight.origin ? (
            <span className="text-white font-semibold">{flight.origin.iata}</span>
          ) : (
            <span className="text-slate-500">???</span>
          )}
          <span className="text-slate-500">➔</span>
          {flight.destination ? (
            <span className="text-white font-semibold">{flight.destination.iata}</span>
          ) : (
            <span className="text-slate-500">???</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-[#070e1e] text-[10px] font-mono font-medium text-slate-300 border border-[#1e2e4f]">
            {flight.typeCode || 'Tàu bay'}
          </span>
          {flight.registration && (
            <span className="text-[10px] font-mono text-slate-400">
              {flight.registration}
            </span>
          )}
        </div>
      </div>

      {/* Row 3: Altitude, Speed, Status */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1">
            {renderVerticalIcon()}
            <span className="text-slate-200">{flight.altitudeFt.toLocaleString()} ft</span>
          </div>
          <div>
            <span className="text-slate-200">{flight.groundSpeedKts} kts</span>
          </div>
        </div>

        <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor()}`}>
          {flight.statusLabelVi}
        </div>
      </div>
    </div>
  );
}
