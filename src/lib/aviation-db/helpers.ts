import { FlightStatus } from '@/types/flight';
import { AIRPORTS } from './airports';

/**
 * Tính khoảng cách giữa hai điểm tọa độ theo công thức Haversine (km)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Chuyển đổi góc la bàn (0 - 360) sang hướng tiếng Việt
 */
export function getHeadingDirection(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const directions = [
    { label: 'Bắc (N)', min: 337.5, max: 360 },
    { label: 'Bắc (N)', min: 0, max: 22.5 },
    { label: 'Đông Bắc (NE)', min: 22.5, max: 67.5 },
    { label: 'Đông (E)', min: 67.5, max: 112.5 },
    { label: 'Đông Nam (SE)', min: 112.5, max: 157.5 },
    { label: 'Nam (S)', min: 157.5, max: 202.5 },
    { label: 'Tây Nam (SW)', min: 202.5, max: 247.5 },
    { label: 'Tây (W)', min: 247.5, max: 292.5 },
    { label: 'Tây Bắc (NW)', min: 292.5, max: 337.5 },
  ];

  for (const dir of directions) {
    if (normalized >= dir.min && normalized < dir.max) {
      return dir.label;
    }
  }
  return 'Bắc (N)';
}

/**
 * Xác định trạng thái bay dựa trên telemetry
 */
export function determineFlightStatus(
  onGround: boolean,
  altitudeFt: number,
  verticalRateFpm: number,
  groundSpeedKts: number
): { status: FlightStatus; labelVi: string } {
  if (onGround || (altitudeFt < 300 && groundSpeedKts < 50)) {
    return { status: 'ground', labelVi: 'Trên mặt đất' };
  }

  if (verticalRateFpm > 600 && altitudeFt < 25000) {
    return { status: 'climbing', labelVi: 'Đang lấy độ cao' };
  }

  if (verticalRateFpm < -600) {
    if (altitudeFt < 5000) {
      return { status: 'landing', labelVi: 'Tiếp cận hạ cánh' };
    }
    return { status: 'descending', labelVi: 'Đang hạ độ cao' };
  }

  if (altitudeFt >= 24000) {
    return { status: 'cruising', labelVi: 'Hành trình bay bằng' };
  }

  return { status: 'cruising', labelVi: 'Đang bay' };
}

/**
 * Tra cứu cặp sân bay tham khảo cho các chuyến bay phổ biến tại Việt Nam
 */
export const COMMON_FLIGHT_ROUTES: Record<string, { origin: string; dest: string }> = {
  // Trục Hà Nội - TP.HCM
  HVN211: { origin: 'HAN', dest: 'SGN' },
  HVN213: { origin: 'HAN', dest: 'SGN' },
  HVN215: { origin: 'HAN', dest: 'SGN' },
  HVN220: { origin: 'SGN', dest: 'HAN' },
  HVN222: { origin: 'SGN', dest: 'HAN' },
  VJC150: { origin: 'SGN', dest: 'HAN' },
  VJC152: { origin: 'SGN', dest: 'HAN' },
  VJC153: { origin: 'HAN', dest: 'SGN' },
  VJC160: { origin: 'SGN', dest: 'HAN' },
  BAV240: { origin: 'SGN', dest: 'HAN' },
  BAV245: { origin: 'HAN', dest: 'SGN' },

  // Đà Nẵng
  HVN120: { origin: 'DAD', dest: 'HAN' },
  HVN123: { origin: 'HAN', dest: 'DAD' },
  HVN140: { origin: 'DAD', dest: 'SGN' },
  HVN143: { origin: 'SGN', dest: 'DAD' },
  VJC510: { origin: 'DAD', dest: 'HAN' },
  VJC625: { origin: 'SGN', dest: 'DAD' },

  // Cam Ranh / Nha Trang & Phú Quốc
  HVN1356: { origin: 'SGN', dest: 'CXR' },
  HVN1556: { origin: 'HAN', dest: 'CXR' },
  VJC772: { origin: 'CXR', dest: 'HAN' },
  HVN1823: { origin: 'HAN', dest: 'PQC' },
  VJC322: { origin: 'SGN', dest: 'PQC' },

  // Quốc tế đến và đi từ Việt Nam
  HVN83: { origin: 'HAN', dest: 'AMS' },
  HVN083: { origin: 'HAN', dest: 'AMS' },
  HVN84: { origin: 'AMS', dest: 'HAN' },
  HVN084: { origin: 'AMS', dest: 'HAN' },
  SIA66: { origin: 'SIN', dest: 'SGN' },
  SIA176: { origin: 'SIN', dest: 'HAN' },
  THA560: { origin: 'BKK', dest: 'HAN' },
  THA564: { origin: 'BKK', dest: 'SGN' },
  KAL715: { origin: 'ICN', dest: 'SGN' },
  KAL717: { origin: 'ICN', dest: 'HAN' },
  AAR731: { origin: 'ICN', dest: 'HAN' },
  CPA799: { origin: 'HKG', dest: 'SGN' },
  EVA397: { origin: 'TPE', dest: 'HAN' },
  UAE394: { origin: 'DXB', dest: 'HAN' },
  QTR976: { origin: 'DOH', dest: 'HAN' },
};

/**
 * Tìm sân bay gần nhất với tọa độ cho trước
 */
export function findNearestAirport(lat: number, lon: number, maxDistanceKm = 100) {
  let nearest = null;
  let minDistance = Infinity;

  for (const airport of Object.values(AIRPORTS)) {
    const dist = calculateDistanceKm(lat, lon, airport.lat, airport.lon);
    if (dist < minDistance && dist <= maxDistanceKm) {
      minDistance = dist;
      nearest = airport;
    }
  }

  return nearest;
}
