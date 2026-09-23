'use client';

import React from 'react';
import {
  RefreshCw,
  HelpCircle,
  Radio,
  Sliders,
  Sparkles,
  Plane,
} from 'lucide-react';

interface HeaderProps {
  flightCount: number;
  isDemo: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  secondsUntilRefresh: number;
  onRefresh: () => void;
  onToggleDemo: () => void;
  onOpenGlossary: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export function Header({
  flightCount,
  isDemo,
  isRefreshing,
  lastUpdated,
  secondsUntilRefresh,
  onRefresh,
  onToggleDemo,
  onOpenGlossary,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}: HeaderProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('vi-VN', { hour12: false });
  };

  return (
    <header className="h-14 bg-[#070e1e] border-b border-[#1e2e4f] px-3 sm:px-5 flex items-center justify-between z-40 select-none shadow-md">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className={`md:hidden p-2 rounded-lg transition ${
            isMobileSidebarOpen
              ? 'bg-[#00e5ff] text-[#060c18]'
              : 'text-slate-300 hover:text-white hover:bg-[#1e2e4f]'
          }`}
          aria-label="Mở danh sách"
        >
          <Sliders className="w-5 h-5 text-[#00e5ff]" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b1528] border border-[#00e5ff]/40 shadow-[0_0_12px_rgba(0,229,255,0.25)]">
            <Radio className="w-4 h-4 text-[#00e5ff] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white">
                TUMIZ<span className="text-[#00e5ff] ml-1">RADAR</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                v1.0
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-slate-400 font-medium tracking-tight">
              Hệ Thống Giám Sát Chuyến Bay Hàng Không
            </p>
          </div>
        </div>
      </div>

      {/* Center status info (Desktop) */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-300">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1528] border border-[#1e2e4f]">
          <span
            className={`w-2 h-2 rounded-full ${
              isDemo ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
            }`}
          />
          <span className="text-slate-200">
            {isDemo ? 'Dữ liệu Mô phỏng' : 'Radar ADS-B Trực tiếp'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Plane className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>
            Đang hiển thị: <strong className="text-white">{flightCount}</strong> tàu bay
          </span>
        </div>

        <div className="text-slate-400">
          Cập nhật: <span className="text-slate-200">{formatTime(lastUpdated)}</span>
          <span className="text-slate-500 ml-1">({secondsUntilRefresh}s)</span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2">
        {/* Toggle Demo / Live */}
        <button
          onClick={onToggleDemo}
          title={isDemo ? 'Chuyển sang dữ liệu thật' : 'Chuyển sang dữ liệu mô phỏng'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
            isDemo
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
              : 'bg-[#0b1528] text-slate-300 border-[#1e2e4f] hover:border-[#00e5ff]/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{isDemo ? 'Chế độ Demo: BẬT' : 'Dữ liệu Thật'}</span>
          <span className="sm:hidden">{isDemo ? 'Demo' : 'Live'}</span>
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Làm mới dữ liệu radar"
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#0b1528] hover:bg-[#1e2e4f] text-slate-300 hover:text-white border border-[#1e2e4f] text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#00e5ff]' : ''}`} />
          <span className="hidden md:inline">Làm mới</span>
        </button>

        {/* Aviation Glossary Modal Button */}
        <button
          onClick={onOpenGlossary}
          title="Thuật ngữ hàng không"
          className="p-1.5 rounded-lg bg-[#0b1528] hover:bg-[#1e2e4f] text-slate-300 hover:text-[#00e5ff] border border-[#1e2e4f] transition"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
