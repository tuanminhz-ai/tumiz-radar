import { FlightData } from '@/types/flight';
import { identifyAirline } from '../aviation-db/airlines';
import { identifyAircraftType } from '../aviation-db/aircraft-types';
import { determineFlightStatus, COMMON_FLIGHT_ROUTES } from '../aviation-db/helpers';
import { AIRPORTS } from '../aviation-db/airports';

interface AdsbAircraftRaw {
  hex: string;
  type?: string;
  flight?: string;
  r?: string; // registration
  t?: string; // aircraft type code
  alt_baro?: number | 'ground';
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  geom_rate?: number;
  squawk?: string;
  category?: string;
  lat?: number;
  lon?: number;
  seen?: number;
}

interface AdsbApiResponse {
  ac?: AdsbAircraftRaw[];
  total?: number;
  now?: number;
  msg?: string;
}

/**
 * Chuẩn hóa một bản ghi thô từ ADS-B sang FlightData chuẩn của Tumiz Radar
 */
function normalizeAdsbAircraft(raw: AdsbAircraftRaw): FlightData | null {
  if (typeof raw.lat !== 'number' || typeof raw.lon !== 'number' || !raw.hex) {
    return null;
  }

  const callsign = (raw.flight || '').trim().toUpperCase();
  const hex = raw.hex.toLowerCase();
  const registration = (raw.r || '').trim();
  const typeCode = (raw.t || '').trim().toUpperCase();

  const onGround = raw.alt_baro === 'ground';
  const altitudeFt = typeof raw.alt_baro === 'number' ? raw.alt_baro : 0;
  const altitudeGeomFt = typeof raw.alt_geom === 'number' ? raw.alt_geom : undefined;
  const groundSpeedKts = typeof raw.gs === 'number' ? Math.round(raw.gs) : 0;
  const track = typeof raw.track === 'number' ? Math.round(raw.track) : 0;
  const verticalRateFpm = typeof raw.baro_rate === 'number' ? raw.baro_rate : (typeof raw.geom_rate === 'number' ? raw.geom_rate : 0);

  const airline = identifyAirline(callsign);
  const aircraftType = typeCode ? identifyAircraftType(typeCode) : undefined;
  const { status, labelVi } = determineFlightStatus(onGround, altitudeFt, verticalRateFpm, groundSpeedKts);

  // Tra cứu tuyến đường tham khảo nếu khớp với bảng chuyến bay phổ biến
  let origin = undefined;
  let destination = undefined;
  let flightNumber = undefined;

  if (callsign) {
    const route = COMMON_FLIGHT_ROUTES[callsign];
    if (route) {
      origin = AIRPORTS[route.origin];
      destination = AIRPORTS[route.dest];
    }

    // Tách số hiệu chuyến bay thương mại nếu có thể (ví dụ: HVN213 -> VN 213)
    if (airline && airline.iata && callsign.startsWith(airline.icao)) {
      flightNumber = `${airline.iata} ${callsign.slice(airline.icao.length)}`;
    }
  }

  const now = Date.now();

  return {
    id: hex,
    hex,
    callsign: callsign || 'N/A',
    flightNumber,
    registration: registration || '',
    airline,
    aircraftType,
    typeCode,
    lat: raw.lat,
    lon: raw.lon,
    altitudeFt,
    altitudeM: Math.round(altitudeFt * 0.3048),
    altitudeGeomFt,
    groundSpeedKts,
    groundSpeedKmh: Math.round(groundSpeedKts * 1.852),
    track,
    verticalRateFpm,
    squawk: raw.squawk || undefined,
    onGround,
    status,
    statusLabelVi: labelVi,
    origin,
    destination,
    isReferenceRoute: true,
    lastContact: Math.floor(now / 1000) - (raw.seen || 0),
    updatedAt: new Date(now).toISOString(),
    dataSource: 'live_adsb',
  };
}

/**
 * Lấy danh sách máy bay trong bán kính quanh một tọa độ tâm
 * @param lat Vĩ độ (-90 đến 90)
 * @param lon Kinh độ (-180 đến 180)
 * @param radiusNm Bán kính theo hải lý (tối đa 250nm)
 */
export async function fetchLiveFlightsByPoint(lat: number, lon: number, radiusNm = 250): Promise<FlightData[]> {
  const safeRadius = Math.min(250, Math.max(10, radiusNm));
  const url = `https://api.adsb.lol/v2/point/${lat.toFixed(4)}/${lon.toFixed(4)}/${safeRadius}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TumizRadar/1.0 (+https://tumiz-radar.vercel.app)',
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`ADS-B API error: ${res.status} ${res.statusText}`);
    }

    const data: AdsbApiResponse = await res.json();
    if (!data.ac || !Array.isArray(data.ac)) {
      return [];
    }

    const flights: FlightData[] = [];
    for (const raw of data.ac) {
      const flight = normalizeAdsbAircraft(raw);
      if (flight) {
        flights.push(flight);
      }
    }

    return flights;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu từ ADS-B API:', error);
    throw error;
  }
}

/**
 * Lấy thông tin chuyến bay cụ thể theo Callsign
 */
export async function fetchLiveFlightByCallsign(callsign: string): Promise<FlightData | null> {
  const clean = callsign.trim().toUpperCase();
  const url = `https://api.adsb.lol/v2/callsign/${encodeURIComponent(clean)}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TumizRadar/1.0' },
    });
    if (!res.ok) return null;
    const data: AdsbApiResponse = await res.json();
    if (data.ac && data.ac.length > 0) {
      return normalizeAdsbAircraft(data.ac[0]);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Lấy thông tin chuyến bay cụ thể theo mã hex ICAO24
 */
export async function fetchLiveFlightByHex(hex: string): Promise<FlightData | null> {
  const clean = hex.trim().toLowerCase();
  const url = `https://api.adsb.lol/v2/hex/${encodeURIComponent(clean)}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TumizRadar/1.0' },
    });
    if (!res.ok) return null;
    const data: AdsbApiResponse = await res.json();
    if (data.ac && data.ac.length > 0) {
      return normalizeAdsbAircraft(data.ac[0]);
    }
    return null;
  } catch {
    return null;
  }
}
