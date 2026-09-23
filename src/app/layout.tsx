import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#060c18',
};

export const metadata: Metadata = {
  title: 'Tumiz Radar - Theo Dõi Chuyến Bay Thời Gian Thực',
  description:
    'Hệ thống theo dõi chuyến bay trực tiếp phong cách radar hàng không. Giám sát máy bay, xem tọa độ, độ cao, tốc độ và ảnh thực tế của tàu bay qua tín hiệu ADS-B.',
  keywords: [
    'Flight Tracker',
    'Theo dõi chuyến bay',
    'Radar hàng không',
    'ADS-B',
    'Vietnam Airlines',
    'Vietjet Air',
    'Bamboo Airways',
    'Tumiz Radar',
  ],
  authors: [{ name: 'Tumiz Radar' }],
  openGraph: {
    title: 'Tumiz Radar - Theo Dõi Chuyến Bay Thời Gian Thực',
    description: 'Bản đồ radar không lưu giám sát chuyến bay thời gian thực.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#060c18] text-slate-100 antialiased overflow-hidden selection:bg-[#00e5ff] selection:text-[#060c18]">
        {children}
      </body>
    </html>
  );
}
