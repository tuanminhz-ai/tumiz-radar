'use client';

import React, { useState, useMemo } from 'react';
import { FlightData } from '@/types/flight';
import { FlightCard } from './FlightCard';
import { Search, X, Filter, ArrowUpDown, Star, Plane } from 'lucide-react';

interface FlightListProps {
  flights: FlightData[];
  selectedFlightId: string | null;
  favoriteIds: string[];
  onSelectFlight: (flight: FlightData) => void;
  onToggleFavorite: (flightId: string, e: React.MouseEvent) => void;
  isLoading: boolean;
}

type FilterTab = 'all' | 'climbing' | 'cruising' | 'descending' | 'favorites';
type SortOption = 'altitude_desc' | 'speed_desc' | 'callsign_asc';

export function FlightList({
  flights,
  selectedFlightId,
  favoriteIds,
  onSelectFlight,
  onToggleFavorite,
  isLoading,
}: FlightListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<FilterTab>('all');
  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('altitude_desc');

  // Danh sách các hãng hàng không có trong danh sách hiện thời
  const availableAirlines = useMemo(() => {
    const map = new Map<string, string>();
    flights.forEach((f) => {
      if (f.airline) {
        map.set(f.airline.icao, f.airline.name);
      }
    });
    return Array.from(map.entries());
  }, [flights]);

  // Lọc và sắp xếp danh sách chuyến bay
  const filteredFlights = useMemo(() => {
    return flights
      .filter((f) => {
        // Lọc theo Tab trạng thái
        if (currentTab === 'favorites') {
          if (!favoriteIds.includes(f.id)) return false;
        } else if (currentTab === 'climbing') {
          if (f.status !== 'climbing') return false;
        } else if (currentTab === 'cruising') {
          if (f.status !== 'cruising') return false;
        } else if (currentTab === 'descending') {
          if (f.status !== 'descending' && f.status !== 'landing') return false;
        }

        // Lọc theo Hãng
        if (selectedAirline !== 'all') {
          if (!f.airline || f.airline.icao !== selectedAirline) return false;
        }

        // Lọc theo Từ khóa tìm kiếm
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const matchCallsign = f.callsign.toLowerCase().includes(query);
          const matchFlightNo = f.flightNumber?.toLowerCase().includes(query);
          const matchReg = f.registration.toLowerCase().includes(query);
          const matchHex = f.hex.toLowerCase().includes(query);
          const matchAirline = f.airline?.name.toLowerCase().includes(query);
          const matchOrigin = f.origin?.iata.toLowerCase().includes(query) || f.origin?.city.toLowerCase().includes(query);
          const matchDest = f.destination?.iata.toLowerCase().includes(query) || f.destination?.city.toLowerCase().includes(query);
          const matchType = f.typeCode.toLowerCase().includes(query);

          return (
            matchCallsign ||
            matchFlightNo ||
            matchReg ||
            matchHex ||
            matchAirline ||
            matchOrigin ||
            matchDest ||
            matchType
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'altitude_desc') {
          return b.altitudeFt - a.altitudeFt;
        }
        if (sortBy === 'speed_desc') {
          return b.groundSpeedKts - a.groundSpeedKts;
        }
        if (sortBy === 'callsign_asc') {
          return a.callsign.localeCompare(b.callsign);
        }
        return 0;
      });
  }, [flights, currentTab, selectedAirline, searchQuery, sortBy, favoriteIds]);

  return (
    <div className="flex flex-col h-full bg-[#070e1e] border-r border-[#1e2e4f] text-slate-200">
      {/* Search Input Box */}
      <div className="p-3 border-b border-[#1e2e4f] bg-[#070e1e]">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm số hiệu, callsign, sân bay..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg bg-[#0b1528] border border-[#1e2e4f] text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#1e2e4f] bg-[#091124] overflow-x-auto text-xs scrollbar-none">
        <button
          onClick={() => setCurrentTab('all')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
            currentTab === 'all'
              ? 'bg-[#00e5ff] text-[#060c18] font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1e2e4f]'
          }`}
        >
          Tất cả ({flights.length})
        </button>

        <button
          onClick={() => setCurrentTab('cruising')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
            currentTab === 'cruising'
              ? 'bg-[#00e5ff] text-[#060c18] font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1e2e4f]'
          }`}
        >
          Đang bay
        </button>

        <button
          onClick={() => setCurrentTab('climbing')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
            currentTab === 'climbing'
              ? 'bg-[#00e5ff] text-[#060c18] font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1e2e4f]'
          }`}
        >
          Cất cánh
        </button>

        <button
          onClick={() => setCurrentTab('descending')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
            currentTab === 'descending'
              ? 'bg-[#00e5ff] text-[#060c18] font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1e2e4f]'
          }`}
        >
          Hạ cánh
        </button>

        <button
          onClick={() => setCurrentTab('favorites')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap flex items-center gap-1 transition ${
            currentTab === 'favorites'
              ? 'bg-[#00e5ff] text-[#060c18] font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1e2e4f]'
          }`}
        >
          <Star className="w-3 h-3 fill-current" />
          Yêu thích ({favoriteIds.length})
        </button>
      </div>

      {/* Filter by Airline & Sorting */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[#1e2e4f] bg-[#070e1e] text-[11px]">
        {/* Airline Selector */}
        <div className="flex items-center gap-1 text-slate-400 min-w-0">
          <Filter className="w-3 h-3 shrink-0 text-[#00e5ff]" />
          <select
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            className="bg-[#0b1528] border border-[#1e2e4f] text-slate-200 text-xs rounded px-2 py-1 outline-none focus:border-[#00e5ff] truncate max-w-[140px]"
          >
            <option value="all">Mọi hãng bay</option>
            {availableAirlines.map(([icao, name]) => (
              <option key={icao} value={icao}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1 text-slate-400 shrink-0">
          <ArrowUpDown className="w-3 h-3 text-[#00e5ff]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#0b1528] border border-[#1e2e4f] text-slate-200 text-xs rounded px-2 py-1 outline-none focus:border-[#00e5ff]"
          >
            <option value="altitude_desc">Độ cao (Cao - Thấp)</option>
            <option value="speed_desc">Tốc độ (Nhanh - Chậm)</option>
            <option value="callsign_asc">Callsign (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Flight Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {isLoading && flights.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Đang quét tín hiệu radar không lưu...</p>
          </div>
        ) : filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              isSelected={flight.id === selectedFlightId}
              isFavorite={favoriteIds.includes(flight.id)}
              onSelect={onSelectFlight}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 px-4">
            <Plane className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium text-slate-300 mb-1">
              Không có chuyến bay nào phù hợp
            </p>
            <p className="text-[11px] text-slate-500">
              Hãy thử xóa từ khóa tìm kiếm hoặc đổi tiêu chí bộ lọc.
            </p>
          </div>
        )}
      </div>

      {/* Footer Status Count */}
      <div className="px-3 py-2 border-t border-[#1e2e4f] bg-[#070e1e] text-[11px] text-slate-400 flex items-center justify-between">
        <span>
          Hiển thị: <strong className="text-slate-200">{filteredFlights.length}</strong> / {flights.length}
        </span>
        <span className="text-[10px] text-slate-500">Múi giờ: GMT+7 (VN)</span>
      </div>
    </div>
  );
}
