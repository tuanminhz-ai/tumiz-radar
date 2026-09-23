'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { FlightData } from '@/types/flight';
import { Radio } from 'lucide-react';

interface FlightMapProps {
  flights: FlightData[];
  selectedFlight: FlightData | null;
  onSelectFlight: (flight: FlightData) => void;
  flyToCoords: { lat: number; lon: number; zoom?: number } | null;
}

// Tải FlightMapInternal hoàn toàn phía Client để tránh lỗi Leaflet SSR
const DynamicFlightMapInternal = dynamic(() => import('./FlightMapInternal'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#060c18] text-slate-400">
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-[#00e5ff]/30 mb-3">
        <Radio className="w-6 h-6 text-[#00e5ff] animate-ping opacity-75" />
      </div>
      <p className="text-sm font-medium text-slate-300">Đang khởi tạo bản đồ không lưu...</p>
      <p className="text-xs text-slate-500 mt-1">Tumiz Radar CartoDB Dark Matter</p>
    </div>
  ),
});

export function FlightMap(props: FlightMapProps) {
  return <DynamicFlightMapInternal {...props} />;
}
