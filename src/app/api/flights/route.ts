import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveFlightsByPoint } from '@/lib/providers/adsb-provider';
import { getMockFlights } from '@/lib/providers/mock-provider';
import { FlightListResponse } from '@/types/flight';

// Bộ nhớ đệm tạm trên Server (TTL 10 giây)
interface CacheEntry {
  timestamp: number;
  data: FlightListResponse;
}
const serverCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isDemo = searchParams.get('demo') === 'true';
  const latStr = searchParams.get('lat') || '16.0439'; // Mặc định tọa độ trung tâm Việt Nam (Đà Nẵng)
  const lonStr = searchParams.get('lon') || '108.1994';
  const radiusStr = searchParams.get('radius') || '250';

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);
  const radius = parseInt(radiusStr, 10);

  // Khóa cache làm tròn tọa độ theo ô lưới ~0.5 độ để tối ưu hóa lưu lượng
  const gridLat = Math.round(lat * 2) / 2;
  const gridLon = Math.round(lon * 2) / 2;
  const cacheKey = `${isDemo ? 'demo' : 'live'}_${gridLat}_${gridLon}_${radius}`;

  const cached = serverCache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      ...cached.data,
      cached: true,
    });
  }

  // Chế độ Demo được bật thủ công
  if (isDemo) {
    const demoFlights = getMockFlights();
    const responsePayload: FlightListResponse = {
      success: true,
      count: demoFlights.length,
      total: demoFlights.length,
      timestamp: now,
      source: 'demo',
      isDemo: true,
      cached: false,
      flights: demoFlights,
      message: 'Đang hiển thị dữ liệu mô phỏng (Chế độ Demo)',
    };

    serverCache.set(cacheKey, { timestamp: now, data: responsePayload });
    return NextResponse.json(responsePayload);
  }

  // Chế độ dữ liệu thực tế Live ADS-B
  try {
    const flights = await fetchLiveFlightsByPoint(lat, lon, radius);

    const responsePayload: FlightListResponse = {
      success: true,
      count: flights.length,
      total: flights.length,
      timestamp: now,
      source: 'live_adsb',
      isDemo: false,
      cached: false,
      flights,
    };

    serverCache.set(cacheKey, { timestamp: now, data: responsePayload });
    return NextResponse.json(responsePayload);
  } catch {
    // Không âm thầm chuyển sang dữ liệu giả mạo. Báo rõ lỗi kết nối để người dùng chủ động.
    return NextResponse.json(
      {
        success: false,
        count: 0,
        total: 0,
        timestamp: now,
        source: 'live_adsb',
        isDemo: false,
        cached: false,
        flights: [],
        message:
          'Không thể kết nối đến máy chủ radar ADS-B vào lúc này (vượt hạn mức hoặc nghẽn mạng). Bạn có thể bấm nút "Chế độ Demo" để xem thử nghiệm giao diện.',
      },
      { status: 502 }
    );
  }
}
