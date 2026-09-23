'use client';

import React, { useState, useEffect } from 'react';
import { FlightData, AircraftPhoto } from '@/types/flight';
import { getHeadingDirection } from '@/lib/aviation-db/helpers';
import {
  X,
  Share2,
  Star,
  ExternalLink,
  Navigation,
  Compass,
  Gauge,
  ArrowUp,
  Camera,
  Check,
  Plane,
  Radio,
} from 'lucide-react';

interface FlightDetailPanelProps {
  flight: FlightData | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (flightId: string, e: React.MouseEvent) => void;
  onFollowAircraft: (flight: FlightData) => void;
}

export function FlightDetailPanel({
  flight,
  onClose,
  isFavorite,
  onToggleFavorite,
  onFollowAircraft,
}: FlightDetailPanelProps) {
  const [photo, setPhoto] = useState<AircraftPhoto | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tải ảnh thực tế của tàu bay từ API khi chọn máy bay
  useEffect(() => {
    if (!flight) {
      setPhoto(null);
      return;
    }

    let isMounted = true;
    setPhotoLoading(true);

    fetch(`/api/aircraft/${flight.hex}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.photo) {
            setPhoto(data.photo);
          } else {
            setPhoto(null);
          }
          setPhotoLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPhoto(null);
          setPhotoLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [flight]);

  if (!flight) return null;

  // Sao chép liên kết chia sẻ chuyến bay
  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('hex', flight.hex);
    if (flight.callsign && flight.callsign !== 'N/A') {
      url.searchParams.set('flight', flight.callsign);
    }

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const headingText = getHeadingDirection(flight.track);

  return (
    <div className="flex flex-col h-full bg-[#070e1e] border-l border-[#1e2e4f] text-slate-200 select-none shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-[#1e2e4f] bg-[#091124] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0b1528] border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff]">
            <Plane className="w-5 h-5" style={{ transform: `rotate(${flight.track}deg)` }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-wide">
                {flight.callsign}
              </h2>
              {flight.flightNumber && flight.flightNumber !== flight.callsign && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] font-bold border border-[#00e5ff]/30">
                  {flight.flightNumber}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400">
              {flight.airline ? flight.airline.name : 'Không rõ hãng khai thác'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => onToggleFavorite(flight.id, e)}
            className={`p-2 rounded-lg transition ${
              isFavorite
                ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                : 'text-slate-400 hover:text-white hover:bg-[#1e2e4f]'
            }`}
            title={isFavorite ? 'Bỏ lưu yêu thích' : 'Lưu vào danh sách'}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e2e4f] transition"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Aircraft Photo Banner */}
        <div className="relative rounded-xl overflow-hidden bg-[#0b1528] border border-[#1e2e4f] aspect-[16/9]">
          {photoLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <Camera className="w-6 h-6 animate-pulse mb-2 text-[#00e5ff]" />
              <span className="text-xs">Đang tìm ảnh tàu bay...</span>
            </div>
          ) : photo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`${flight.registration} - ${flight.typeCode}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-[10px] text-slate-300">
                <span className="truncate pr-2">Ảnh: {photo.photographer}</span>
                <a
                  href={photo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00e5ff] hover:underline flex items-center gap-0.5 shrink-0"
                >
                  Planespotters <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-500 bg-[#070e1e]">
              <Plane className="w-10 h-10 text-slate-600 mb-2 opacity-50" />
              <p className="text-xs text-slate-400 font-medium">Chưa có ảnh tàu bay</p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Mã ICAO24: {flight.hex.toUpperCase()} • Đăng ký: {flight.registration || 'N/A'}
              </p>
            </div>
          )}
        </div>

        {/* Route Card */}
        <div className="p-3.5 rounded-xl bg-[#0b1528] border border-[#1e2e4f]">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-medium">Lộ Trình Chuyến Bay</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              Tuyến tham khảo
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Origin */}
            <div className="flex-1 text-left">
              <div className="text-xl font-mono font-extrabold text-white">
                {flight.origin ? flight.origin.iata : '---'}
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {flight.origin ? flight.origin.city : 'Chưa rõ điểm đi'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {flight.origin ? flight.origin.name : 'Chưa có dữ liệu'}
              </div>
            </div>

            {/* Flight arrow indicator */}
            <div className="flex flex-col items-center px-3">
              <Plane className="w-4 h-4 text-[#00e5ff] rotate-90" />
              <div className="w-16 h-0.5 bg-[#1e2e4f] mt-1 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-[#00e5ff]" />
              </div>
            </div>

            {/* Destination */}
            <div className="flex-1 text-right">
              <div className="text-xl font-mono font-extrabold text-white">
                {flight.destination ? flight.destination.iata : '---'}
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {flight.destination ? flight.destination.city : 'Chưa rõ điểm đến'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {flight.destination ? flight.destination.name : 'Chưa có dữ liệu'}
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Altitude */}
          <div className="p-3 rounded-lg bg-[#0b1528] border border-[#1e2e4f]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Gauge className="w-3.5 h-3.5 text-[#00e5ff]" />
              Độ Cao (Khí Áp)
            </div>
            <div className="text-base font-mono font-bold text-white">
              {flight.altitudeFt.toLocaleString()} <span className="text-xs text-slate-400">ft</span>
            </div>
            <div className="text-[10px] text-slate-400">
              ≈ {flight.altitudeM.toLocaleString()} mét
            </div>
          </div>

          {/* Ground Speed */}
          <div className="p-3 rounded-lg bg-[#0b1528] border border-[#1e2e4f]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Navigation className="w-3.5 h-3.5 text-[#00e5ff]" />
              Tốc Độ Mặt Đất
            </div>
            <div className="text-base font-mono font-bold text-white">
              {flight.groundSpeedKts} <span className="text-xs text-slate-400">kts</span>
            </div>
            <div className="text-[10px] text-slate-400">
              ≈ {flight.groundSpeedKmh} km/h
            </div>
          </div>

          {/* Track Heading */}
          <div className="p-3 rounded-lg bg-[#0b1528] border border-[#1e2e4f]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Compass className="w-3.5 h-3.5 text-[#00e5ff]" />
              Hướng Bay
            </div>
            <div className="text-base font-mono font-bold text-white">
              {flight.track}°
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {headingText}
            </div>
          </div>

          {/* Vertical Rate */}
          <div className="p-3 rounded-lg bg-[#0b1528] border border-[#1e2e4f]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <ArrowUp className="w-3.5 h-3.5 text-[#00e5ff]" />
              Tốc Độ Nâng/Hạ
            </div>
            <div className="text-base font-mono font-bold text-white">
              {flight.verticalRateFpm > 0 ? `+${flight.verticalRateFpm}` : flight.verticalRateFpm}{' '}
              <span className="text-xs text-slate-400">fpm</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {flight.statusLabelVi}
            </div>
          </div>
        </div>

        {/* Technical Aircraft Specifications */}
        <div className="p-3.5 rounded-xl bg-[#0b1528] border border-[#1e2e4f] space-y-2.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-[#1e2e4f] pb-2">
            <Radio className="w-3.5 h-3.5 text-[#00e5ff]" />
            Thông Tin Kỹ Thuật Tàu Bay
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Dòng máy bay</span>
              <span className="font-semibold text-white">
                {flight.aircraftType?.model || flight.typeCode || 'Chưa có dữ liệu'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Nhà sản xuất</span>
              <span className="font-semibold text-white">
                {flight.aircraftType?.manufacturer || 'Chưa có dữ liệu'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Số đăng ký (Registration)</span>
              <span className="font-mono font-semibold text-[#00e5ff]">
                {flight.registration || 'Chưa có dữ liệu'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Mã ICAO24 (Hex)</span>
              <span className="font-mono font-semibold text-white">
                {flight.hex.toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Mã Radar Squawk</span>
              <span className="font-mono font-semibold text-white">
                {flight.squawk || 'Chưa có dữ liệu'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Cổng / Ga / Băng chuyền</span>
              <span className="text-slate-400 italic">Chưa có dữ liệu</span>
            </div>
          </div>
        </div>

        {/* Telemetry Position GPS */}
        <div className="p-2.5 rounded-lg bg-[#040812] border border-[#1e2e4f] text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            Tọa độ: <strong className="text-slate-200 font-mono">{flight.lat.toFixed(4)}°, {flight.lon.toFixed(4)}°</strong>
          </span>
          <span className="text-[10px] text-slate-500">
            Nguồn: {flight.dataSource === 'live_adsb' ? 'ADS-B Trực tiếp' : 'Mô phỏng'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-[#1e2e4f] bg-[#070e1e] flex items-center gap-2">
        <button
          onClick={() => onFollowAircraft(flight)}
          className="flex-1 py-2 px-3 rounded-lg bg-[#00e5ff] hover:bg-[#38bdf8] text-[#060c18] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-[0_0_12px_rgba(0,229,255,0.2)]"
        >
          <Navigation className="w-3.5 h-3.5" />
          Định vị trên bản đồ
        </button>

        <button
          onClick={handleShare}
          className="py-2 px-3 rounded-lg bg-[#0b1528] hover:bg-[#1e2e4f] border border-[#1e2e4f] text-white font-medium text-xs flex items-center gap-1.5 transition"
          title="Chia sẻ chuyến bay này"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Đã chép link!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-300" />
              <span>Chia sẻ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
