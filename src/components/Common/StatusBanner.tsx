'use client';

import React from 'react';
import { AlertTriangle, WifiOff, Sparkles, RefreshCw } from 'lucide-react';

interface StatusBannerProps {
  isDemo: boolean;
  isError: boolean;
  isStale: boolean;
  errorMessage?: string;
  onToggleDemo: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function StatusBanner({
  isDemo,
  isError,
  isStale,
  errorMessage,
  onToggleDemo,
  onRefresh,
  isRefreshing,
}: StatusBannerProps) {
  if (isError) {
    return (
      <div className="bg-rose-950/90 border-b border-rose-500/50 px-4 py-2 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg z-30">
        <div className="flex items-center gap-2 overflow-hidden">
          <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="truncate">
            {errorMessage || 'Mất kết nối đến máy chủ radar ADS-B (quá tải hoặc hết hạn mức mạng).'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white font-medium text-xs flex items-center gap-1 transition"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Thử lại
          </button>
          <button
            onClick={onToggleDemo}
            className="px-2.5 py-1 rounded bg-[#00e5ff] text-[#060c18] font-bold text-xs hover:bg-[#38bdf8] transition"
          >
            Bật Chế độ Demo
          </button>
        </div>
      </div>
    );
  }

  if (isDemo) {
    return (
      <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-1.5 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Chế độ Thử nghiệm (Demo):</strong> Đang mô phỏng các chuyến bay thực tế tại Việt Nam theo thời gian thực.
          </span>
        </div>
        <button
          onClick={onToggleDemo}
          className="px-2.5 py-1 rounded bg-amber-800/80 hover:bg-amber-700 text-white font-medium text-xs shrink-0 transition"
        >
          Chuyển sang Dữ liệu Thực (Live)
        </button>
      </div>
    );
  }

  if (isStale) {
    return (
      <div className="bg-sky-950/80 border-b border-sky-500/40 px-4 py-1.5 text-sky-200 text-xs sm:text-sm flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Tín hiệu radar chưa cập nhật hơn 60 giây qua.</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-2.5 py-1 rounded bg-sky-800 hover:bg-sky-700 text-white font-medium text-xs flex items-center gap-1 shrink-0 transition"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          Làm mới ngay
        </button>
      </div>
    );
  }

  return null;
}
