'use client';

import React from 'react';
import { X, BookOpen, Info } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlossaryModal({ isOpen, onClose }: GlossaryModalProps) {
  if (!isOpen) return null;

  const terms = [
    {
      term: 'Callsign (Hô hiệu điều hành bay)',
      definition:
        'Tên định danh âm thanh và tín hiệu được phi công sử dụng khi liên lạc vô tuyến với kiểm soát viên không lưu (ATC). Thường bao gồm 3 chữ cái đại diện hãng (ICAO) kèm số chuyến, ví dụ: HVN213 (Vietnam Airlines 213).',
    },
    {
      term: 'Số hiệu chuyến bay (Flight Number)',
      definition:
        'Số hiệu thương mại in trên vé máy bay hành khách (ví dụ: VN 213, VJ 152). Một chuyến bay thương mại có thể liên danh (codeshare) với nhiều hãng khác nhau nhưng chỉ có một Callsign hoạt động duy nhất trên không.',
    },
    {
      term: 'Mã ICAO24 (Transponder Hex Code)',
      definition:
        'Địa chỉ định danh kỹ thuật số 24-bit duy nhất trên toàn cầu được Tổ chức Hàng không Dân dụng Quốc tế (ICAO) cấp vĩnh viễn cho thiết bị phát đáp của từng thân tàu bay cụ thể (ví dụ: 888123 hoặc 71c541).',
    },
    {
      term: 'Số đăng ký (Registration)',
      definition:
        'Tương tự như biển số xe máy hoặc ô tô, được sơn trực tiếp lên đuôi máy bay. Tiền tố thể hiện quốc gia đăng ký: VN- (Việt Nam), HL (Hàn Quốc), HS- (Thái Lan), 9V- (Singapore), B- (Trung Quốc/Đài Loan), N- (Mỹ)...',
    },
    {
      term: 'Mã Squawk (Radar Beacon Code)',
      definition:
        'Mã 4 chữ số bát phân (0-7) do đài kiểm soát không lưu chỉ định cho phi công nhập vào máy phát đáp để radar mặt đất phân biệt máy bay trong vùng kiểm soát. Mã đặc biệt: 7500 (Bắt cóc), 7600 (Mất liên lạc vô tuyến), 7700 (Khẩn cấp).',
    },
    {
      term: 'Độ cao khí áp (Barometric Altitude)',
      definition:
        'Độ cao được tính dựa trên áp suất khí quyển đo bằng ống pitot của máy bay so với mực chuẩn tiêu chuẩn 1013.25 hPa. Đơn vị chuẩn quốc tế trong hàng không là Feet (1 ft ≈ 0.3048 m).',
    },
    {
      term: 'Tốc độ mặt đất (Ground Speed - GS)',
      definition:
        'Tốc độ thực tế của máy bay di chuyển so với mặt đất (đã bao gồm ảnh hưởng của gió xuôi hoặc gió ngược). Đơn vị tính là Knots (hải lý/giờ; 1 knot ≈ 1.852 km/h).',
    },
    {
      term: 'Hướng bay (Track / Heading)',
      definition:
        'Góc hướng máy bay đang di chuyển tính theo độ la bàn (0° đến 360° theo chiều kim đồng hồ, 0° là hướng Bắc thực).',
    },
    {
      term: 'ADS-B (Tự động giám sát phát sóng)',
      definition:
        'Công nghệ máy bay tự động xác định vị trí qua vệ tinh GPS và liên tục phát sóng tần số 1090 MHz xuống các trạm thu mặt đất. Nền tảng Tumiz Radar thu thập dữ liệu này để hiển thị vị trí tàu bay trực tiếp.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0b1528] border border-[#1e2e4f] rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e4f] bg-[#070e1e]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00e5ff]" />
            <h3 className="text-lg font-bold text-white tracking-wide">Thuật Ngữ Hàng Không Cơ Bản</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e2e4f] transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm leading-relaxed">
          <div className="p-3 rounded-lg bg-[#040812] border border-[#1e2e4f]/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00e5ff] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              Các thông số trên Tumiz Radar được chuẩn hóa theo tiêu chuẩn hàng không quốc tế (ICAO). Dưới đây là giải thích đơn giản giúp bạn dễ dàng theo dõi các chuyến bay.
            </p>
          </div>

          <div className="grid gap-3">
            {terms.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg bg-[#070e1e]/80 border border-[#1e2e4f] hover:border-[#00e5ff]/50 transition-colors"
              >
                <div className="font-semibold text-[#00e5ff] mb-1">{item.term}</div>
                <div className="text-slate-300 text-xs sm:text-sm">{item.definition}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1e2e4f] bg-[#070e1e] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#00e5ff] text-[#060c18] hover:bg-[#38bdf8] transition-colors font-semibold"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
