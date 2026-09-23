export interface AirportInfo {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone?: string;
}

export interface AirlineInfo {
  iata?: string;
  icao: string;
  name: string;
  callsign?: string;
  country: string;
  logo?: string;
}

export interface AircraftPhoto {
  url: string;
  thumbnail: string;
  photographer: string;
  sourceUrl: string;
  attribution: string;
}

export interface AircraftTypeInfo {
  code: string;
  manufacturer: string;
  model: string;
  family?: string;
  engineCount?: number;
}

export type FlightStatus =
  | 'scheduled'
  | 'climbing'
  | 'cruising'
  | 'descending'
  | 'landing'
  | 'landed'
  | 'ground'
  | 'unknown';

export interface FlightData {
  // Định danh tàu bay & chuyến bay
  id: string; // icao24 hex
  hex: string; // ICAO24 (ví dụ: "71c541" hoặc "888123")
  callsign: string; // Callsign điều hành bay (ví dụ: "HVN213", "VJC152")
  flightNumber?: string; // Số hiệu thương mại (ví dụ: "VN 213", "VJ 152")
  registration: string; // Số đăng ký tàu bay (ví dụ: "VN-A614", "HL8541")
  
  // Thông tin hãng & tàu bay
  airline?: AirlineInfo;
  aircraftType?: AircraftTypeInfo;
  typeCode: string; // Mã ICAO loại máy bay (ví dụ: "A321", "B789", "B38M")
  
  // Dữ liệu đo đạc trực tiếp (Telemetry)
  lat: number;
  lon: number;
  altitudeFt: number; // Độ cao theo feet
  altitudeM: number; // Độ cao theo mét
  altitudeGeomFt?: number; // Độ cao hình học GPS
  groundSpeedKts: number; // Tốc độ mặt đất (hải lý/giờ)
  groundSpeedKmh: number; // Tốc độ mặt đất (km/h)
  track: number; // Hướng di chuyển (0 - 360 độ)
  verticalRateFpm: number; // Tốc độ nâng/hạ (feet/phút)
  squawk?: string; // Mã nhận dạng radar chuyển tiếp (ví dụ: "6171")
  onGround: boolean;
  
  // Trạng thái & Tuyến bay
  status: FlightStatus;
  statusLabelVi: string;
  
  // Sân bay đi và đến (nếu xác định được hoặc từ cơ sở dữ liệu đường bay)
  origin?: AirportInfo;
  destination?: AirportInfo;
  isReferenceRoute: boolean; // Đánh dấu tuyến đường tham khảo hay vết bay thật
  
  // Dữ liệu ảnh thực tế
  photo?: AircraftPhoto;
  
  // Thời gian
  lastContact: number; // Unix timestamp
  updatedAt: string; // ISO String
  
  // Nguồn dữ liệu
  dataSource: 'live_adsb' | 'opensky' | 'demo';
}

export interface FlightListResponse {
  success: boolean;
  count: number;
  total: number;
  timestamp: number;
  source: 'live_adsb' | 'opensky' | 'demo';
  isDemo: boolean;
  cached: boolean;
  flights: FlightData[];
  message?: string;
}

export interface FlightDetailResponse {
  success: boolean;
  flight: FlightData;
  photo?: AircraftPhoto;
}
