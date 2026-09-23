'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlightData, FlightListResponse } from '@/types/flight';
import { Header } from '@/components/Header';
import { FlightMap } from '@/components/Map/FlightMap';
import { FlightList } from '@/components/Sidebar/FlightList';
import { FlightDetailPanel } from '@/components/FlightDetail/FlightDetailPanel';
import { StatusBanner } from '@/components/Common/StatusBanner';
import { GlossaryModal } from '@/components/Common/GlossaryModal';

const REFRESH_INTERVAL_SECONDS = 15;

function FlightTrackerContent() {
  const searchParams = useSearchParams();

  // State dữ liệu chuyến bay
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // State điều khiển giao diện & mạng
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState<number>(REFRESH_INTERVAL_SECONDS);

  // State điều hướng bản đồ
  const [flyToCoords, setFlyToCoords] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);

  // Modals & Panels
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState<boolean>(false);

  // Tải danh sách yêu thích từ localStorage khi mở trang
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('tumiz_favorite_flights');
      if (storedFavorites) {
        setFavoriteIds(JSON.parse(storedFavorites));
      }
      const storedDemo = localStorage.getItem('tumiz_demo_mode');
      if (storedDemo === 'true') {
        setIsDemo(true);
      }
    } catch {
      // Bỏ qua lỗi truy cập localStorage
    }
  }, []);

  // Hàm tải dữ liệu chuyến bay từ Backend API
  const fetchFlightsData = useCallback(
    async (showLoadingSpinner = false) => {
      if (showLoadingSpinner) {
        setIsRefreshing(true);
      }

      try {
        const queryParams = new URLSearchParams({
          lat: '16.0439', // Tọa độ trung tâm Việt Nam
          lon: '108.1994',
          radius: '250',
          demo: isDemo ? 'true' : 'false',
        });

        const res = await fetch(`/api/flights?${queryParams.toString()}`);
        const data: FlightListResponse = await res.json();

        if (res.ok && data.success) {
          setFlights(data.flights);
          setLastUpdated(new Date());
          setIsError(false);
          setErrorMessage('');

          // Cập nhật lại thông tin của chuyến bay đang được chọn nếu có dữ liệu mới
          if (selectedFlightId) {
            const updatedSelected = data.flights.find((f) => f.id === selectedFlightId);
            if (updatedSelected) {
              setSelectedFlight(updatedSelected);
            }
          }
        } else {
          setIsError(true);
          setErrorMessage(data.message || 'Không thể kết nối đến máy chủ ADS-B.');
        }
      } catch {
        setIsError(true);
        setErrorMessage('Lỗi kết nối mạng đến máy chủ radar.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setSecondsUntilRefresh(REFRESH_INTERVAL_SECONDS);
      }
    },
    [isDemo, selectedFlightId]
  );

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchFlightsData(true);
  }, [fetchFlightsData]);

  // Bộ đếm lùi tự động làm mới (Auto Refresh Timer) - Dừng khi tab bị ẩn
  useEffect(() => {
    const timer = setInterval(() => {
      // Tạm dừng khi tab không hoạt động
      if (document.hidden) return;

      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          fetchFlightsData(false);
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchFlightsData]);

  // Xử lý Deep Linking qua URL Query Parameters (?flight=HVN213 hoặc ?hex=888123)
  useEffect(() => {
    const queryHex = searchParams.get('hex');
    const queryFlight = searchParams.get('flight');

    if ((queryHex || queryFlight) && flights.length > 0) {
      const match = flights.find(
        (f) =>
          (queryHex && f.hex.toLowerCase() === queryHex.toLowerCase()) ||
          (queryFlight && f.callsign.toLowerCase() === queryFlight.toLowerCase())
      );

      if (match) {
        setSelectedFlightId(match.id);
        setSelectedFlight(match);
        setFlyToCoords({ lat: match.lat, lon: match.lon, zoom: 8 });
        setIsMobileDetailOpen(true);
      }
    }
  }, [searchParams, flights]);

  // Chọn chuyến bay
  const handleSelectFlight = (flight: FlightData) => {
    setSelectedFlightId(flight.id);
    setSelectedFlight(flight);
    setFlyToCoords({ lat: flight.lat, lon: flight.lon, zoom: 8 });
    setIsMobileSidebarOpen(false); // Thu gọn menu danh sách trên mobile
    setIsMobileDetailOpen(true); // Mở bảng chi tiết trên mobile
  };

  // Đóng bảng chi tiết
  const handleCloseDetail = () => {
    setSelectedFlightId(null);
    setSelectedFlight(null);
    setIsMobileDetailOpen(false);
  };

  // Bật/tắt lưu chuyến bay yêu thích
  const handleToggleFavorite = (flightId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const isFav = prev.includes(flightId);
      const next = isFav ? prev.filter((id) => id !== flightId) : [...prev, flightId];
      try {
        localStorage.setItem('tumiz_favorite_flights', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Bật/tắt chế độ Demo
  const handleToggleDemo = () => {
    setIsDemo((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tumiz_demo_mode', next ? 'true' : 'false');
      } catch {}
      return next;
    });
    setIsLoading(true);
  };

  // Theo dõi máy bay trên bản đồ (Fly to)
  const handleFollowAircraft = (flight: FlightData) => {
    setFlyToCoords({ lat: flight.lat, lon: flight.lon, zoom: 9 });
  };

  // Kiểm tra dữ liệu cũ hơn 60 giây
  const isDataStale = lastUpdated ? Date.now() - lastUpdated.getTime() > 60000 : false;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#060c18] font-sans">
      {/* 1. Thanh Header Điều Hướng */}
      <Header
        flightCount={flights.length}
        isDemo={isDemo}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        secondsUntilRefresh={secondsUntilRefresh}
        onRefresh={() => fetchFlightsData(true)}
        onToggleDemo={handleToggleDemo}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* 2. Banner Trạng Thái (Demo, Mất kết nối, Dữ liệu cũ) */}
      <StatusBanner
        isDemo={isDemo}
        isError={isError}
        isStale={isDataStale}
        errorMessage={errorMessage}
        onToggleDemo={handleToggleDemo}
        onRefresh={() => fetchFlightsData(true)}
        isRefreshing={isRefreshing}
      />

      {/* 3. Vùng Nội Dung Chính (Sidebar + Bản Đồ + Bảng Chi Tiết) */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar Bên Trái (Desktop: Cố định; Mobile: Drawer trượt) */}
        <aside
          className={`
            absolute md:relative z-30 h-full w-80 sm:w-88 md:w-80 lg:w-96 shrink-0 transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <FlightList
            flights={flights}
            selectedFlightId={selectedFlightId}
            favoriteIds={favoriteIds}
            onSelectFlight={handleSelectFlight}
            onToggleFavorite={handleToggleFavorite}
            isLoading={isLoading}
          />
        </aside>

        {/* Backdrop che mờ khi mở Sidebar trên Mobile */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Vùng Bản Đồ Radar Trung Tâm */}
        <main className="flex-1 relative h-full">
          <FlightMap
            flights={flights}
            selectedFlight={selectedFlight}
            onSelectFlight={handleSelectFlight}
            flyToCoords={flyToCoords}
          />
        </main>

        {/* Bảng Thông Tin Chi Tiết Chuyến Bay */}
        {/* Desktop: Cột bên phải */}
        {selectedFlight && (
          <aside className="hidden md:block w-88 lg:w-96 shrink-0 z-20 h-full animate-in slide-in-from-right duration-200">
            <FlightDetailPanel
              flight={selectedFlight}
              onClose={handleCloseDetail}
              isFavorite={favoriteIds.includes(selectedFlight.id)}
              onToggleFavorite={handleToggleFavorite}
              onFollowAircraft={handleFollowAircraft}
            />
          </aside>
        )}

        {/* Mobile: Bottom Sheet có thể cuộn trượt từ dưới lên */}
        {selectedFlight && isMobileDetailOpen && (
          <div className="md:hidden fixed inset-x-0 bottom-0 z-40 max-h-[75vh] flex flex-col rounded-t-2xl overflow-hidden shadow-2xl border-t border-[#1e2e4f] animate-in slide-in-from-bottom duration-300">
            <FlightDetailPanel
              flight={selectedFlight}
              onClose={handleCloseDetail}
              isFavorite={favoriteIds.includes(selectedFlight.id)}
              onToggleFavorite={handleToggleFavorite}
              onFollowAircraft={handleFollowAircraft}
            />
          </div>
        )}
      </div>

      {/* 4. Modal Giải Thích Thuật Ngữ Hàng Không */}
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#060c18] text-slate-300">
          <div className="w-10 h-10 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold tracking-wider text-[#00e5ff]">
            TUMIZ RADAR
          </p>
          <p className="text-xs text-slate-500 mt-1">Đang khởi tạo hệ thống radar...</p>
        </div>
      }
    >
      <FlightTrackerContent />
    </Suspense>
  );
}
