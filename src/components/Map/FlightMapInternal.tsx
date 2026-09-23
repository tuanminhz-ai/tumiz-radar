'use client';

import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { FlightData } from '@/types/flight';
import { Locate, ZoomIn, ZoomOut } from 'lucide-react';

interface FlightMapInternalProps {
  flights: FlightData[];
  selectedFlight: FlightData | null;
  onSelectFlight: (flight: FlightData) => void;
  flyToCoords: { lat: number; lon: number; zoom?: number } | null;
}

// Hàm tạo icon máy bay SVG xoay theo hướng bay
function createAircraftIcon(flight: FlightData, isSelected: boolean) {
  let fillColor = '#00e5ff'; // Cruising cyan
  if (flight.status === 'climbing') fillColor = '#10b981'; // Emerald
  else if (flight.status === 'descending' || flight.status === 'landing') fillColor = '#f59e0b'; // Amber
  else if (flight.status === 'ground') fillColor = '#94a3b8'; // Slate

  const size = isSelected ? 34 : 26;
  const haloClass = isSelected
    ? 'ring-2 ring-[#00e5ff] shadow-[0_0_18px_#00e5ff] rounded-full'
    : '';

  const html = `
    <div class="relative flex items-center justify-center ${haloClass}" style="width: ${size}px; height: ${size}px;">
      <div style="transform: rotate(${flight.track}deg); transition: transform 0.3s ease;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${fillColor}" stroke="#070e1e" stroke-width="1.2">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
      ${
        isSelected
          ? `<div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-[#0b1528] text-[#00e5ff] border border-[#00e5ff] text-[10px] font-bold font-mono shadow-md">
              ${flight.callsign}
            </div>`
          : ''
      }
    </div>
  `;

  return L.divIcon({
    html,
    className: 'aircraft-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// Icon sân bay cho điểm đi và đến
function createAirportIcon(code: string, isOrigin: boolean) {
  const bgColor = isOrigin ? '#0284c7' : '#10b981';
  const html = `
    <div class="flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-white shadow-lg border border-white/40" style="background-color: ${bgColor}; transform: translate(-50%, -50%);">
      ${code}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'airport-marker-icon',
    iconSize: [36, 20],
    iconAnchor: [18, 10],
  });
}

// Thành phần hỗ trợ di chuyển bản đồ (Pan/FlyTo)
function MapController({
  flyToCoords,
}: {
  flyToCoords: { lat: number; lon: number; zoom?: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (flyToCoords) {
      map.flyTo([flyToCoords.lat, flyToCoords.lon], flyToCoords.zoom || 9, {
        duration: 1.2,
      });
    }
  }, [flyToCoords, map]);

  return null;
}

export default function FlightMapInternal({
  flights,
  selectedFlight,
  onSelectFlight,
  flyToCoords,
}: FlightMapInternalProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Đường bay tham khảo khi chọn chuyến bay
  const referenceRouteCoords: [number, number][] = [];
  if (selectedFlight) {
    if (selectedFlight.origin) {
      referenceRouteCoords.push([selectedFlight.origin.lat, selectedFlight.origin.lon]);
    }
    referenceRouteCoords.push([selectedFlight.lat, selectedFlight.lon]);
    if (selectedFlight.destination) {
      referenceRouteCoords.push([
        selectedFlight.destination.lat,
        selectedFlight.destination.lon,
      ]);
    }
  }

  // Tọa độ trung tâm mặc định: Vùng trời Việt Nam
  const defaultCenter: [number, number] = [16.0439, 108.1994];
  const defaultZoom = 6;

  const handleResetVietnamView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(defaultCenter, defaultZoom, { duration: 1.0 });
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-full bg-[#060c18] overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
        className="w-full h-full"
        ref={mapRef}
      >
        <MapController flyToCoords={flyToCoords} />

        {/* TileLayer CartoDB Dark Matter */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        {/* Tuyến bay tham khảo (Reference Polyline) */}
        {referenceRouteCoords.length >= 2 && (
          <>
            <Polyline
              positions={referenceRouteCoords}
              pathOptions={{
                color: '#00e5ff',
                weight: 2.5,
                opacity: 0.85,
                dashArray: '8, 8',
              }}
            >
              <Tooltip sticky>
                <span className="font-sans text-xs">
                  Tuyến bay tham khảo ({selectedFlight?.origin?.iata} ➔ {selectedFlight?.destination?.iata})
                </span>
              </Tooltip>
            </Polyline>

            {/* Marker sân bay khởi hành */}
            {selectedFlight?.origin && (
              <Marker
                position={[selectedFlight.origin.lat, selectedFlight.origin.lon]}
                icon={createAirportIcon(selectedFlight.origin.iata, true)}
              >
                <Popup>
                  <div className="p-2 text-xs">
                    <div className="font-bold text-sky-400">Sân bay đi (Origin)</div>
                    <div className="font-semibold text-white">{selectedFlight.origin.name}</div>
                    <div className="text-slate-300">{selectedFlight.origin.city}, {selectedFlight.origin.country}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Marker sân bay hạ cánh */}
            {selectedFlight?.destination && (
              <Marker
                position={[selectedFlight.destination.lat, selectedFlight.destination.lon]}
                icon={createAirportIcon(selectedFlight.destination.iata, false)}
              >
                <Popup>
                  <div className="p-2 text-xs">
                    <div className="font-bold text-emerald-400">Sân bay đến (Destination)</div>
                    <div className="font-semibold text-white">{selectedFlight.destination.name}</div>
                    <div className="text-slate-300">{selectedFlight.destination.city}, {selectedFlight.destination.country}</div>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Danh sách các Marker máy bay */}
        {flights.map((flight) => {
          const isSelected = selectedFlight?.id === flight.id;
          return (
            <Marker
              key={flight.id}
              position={[flight.lat, flight.lon]}
              icon={createAircraftIcon(flight, isSelected)}
              eventHandlers={{
                click: () => onSelectFlight(flight),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div className="text-[11px] font-mono">
                  <span className="font-bold text-[#00e5ff]">{flight.callsign}</span>
                  <span className="text-slate-300 ml-1.5">{flight.altitudeFt.toLocaleString()} ft</span>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Controls on Top-Right */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleResetVietnamView}
          className="p-2.5 rounded-lg bg-[#0b1528]/90 hover:bg-[#1e2e4f] text-[#00e5ff] border border-[#1e2e4f] shadow-lg transition backdrop-blur-sm"
          title="Toàn cảnh Vùng trời Việt Nam"
        >
          <Locate className="w-4 h-4" />
        </button>

        <div className="flex flex-col rounded-lg bg-[#0b1528]/90 border border-[#1e2e4f] shadow-lg overflow-hidden backdrop-blur-sm">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-300 hover:text-white hover:bg-[#1e2e4f] transition border-b border-[#1e2e4f]"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-300 hover:text-white hover:bg-[#1e2e4f] transition"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend on Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#070e1e]/90 border border-[#1e2e4f] text-[11px] text-slate-300 backdrop-blur-sm shadow-md">
        <span className="text-slate-400 font-medium">Trạng thái:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span>Cất cánh</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
          <span>Bay bằng</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span>Hạ cánh</span>
        </div>
      </div>
    </div>
  );
}
