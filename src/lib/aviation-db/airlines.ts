import { AirlineInfo } from '@/types/flight';

export const AIRLINES: Record<string, AirlineInfo> = {
  // Hãng hàng không Việt Nam
  HVN: {
    icao: 'HVN',
    iata: 'VN',
    name: 'Vietnam Airlines',
    callsign: 'VIET NAM',
    country: 'Việt Nam',
  },
  VJC: {
    icao: 'VJC',
    iata: 'VJ',
    name: 'Vietjet Air',
    callsign: 'VIETJET',
    country: 'Việt Nam',
  },
  BAV: {
    icao: 'BAV',
    iata: 'QH',
    name: 'Bamboo Airways',
    callsign: 'BAMBOO',
    country: 'Việt Nam',
  },
  VAG: {
    icao: 'VAG',
    iata: 'VU',
    name: 'Vietravel Airlines',
    callsign: 'VIETRAVEL AIR',
    country: 'Việt Nam',
  },
  PIC: {
    icao: 'PIC',
    iata: 'BL',
    name: 'Pacific Airlines',
    callsign: 'PACIFIC',
    country: 'Việt Nam',
  },
  VNP: {
    icao: 'VNP',
    iata: 'VN',
    name: 'VASCO',
    callsign: 'VASCO AIR',
    country: 'Việt Nam',
  },

  // Hãng hàng không Châu Á & Quốc tế
  SIA: {
    icao: 'SIA',
    iata: 'SQ',
    name: 'Singapore Airlines',
    callsign: 'SINGAPORE',
    country: 'Singapore',
  },
  THA: {
    icao: 'THA',
    iata: 'TG',
    name: 'Thai Airways',
    callsign: 'THAI',
    country: 'Thái Lan',
  },
  MAS: {
    icao: 'MAS',
    iata: 'MH',
    name: 'Malaysia Airlines',
    callsign: 'MALAYSIAN',
    country: 'Malaysia',
  },
  CPA: {
    icao: 'CPA',
    iata: 'CX',
    name: 'Cathay Pacific',
    callsign: 'CATHAY',
    country: 'Hồng Kông',
  },
  KAL: {
    icao: 'KAL',
    iata: 'KE',
    name: 'Korean Air',
    callsign: 'KOREANAIR',
    country: 'Hàn Quốc',
  },
  AAR: {
    icao: 'AAR',
    iata: 'OZ',
    name: 'Asiana Airlines',
    callsign: 'ASIANA',
    country: 'Hàn Quốc',
  },
  ESR: {
    icao: 'ESR',
    iata: 'ZE',
    name: 'Eastar Jet',
    callsign: 'EASTAR JET',
    country: 'Hàn Quốc',
  },
  JNA: {
    icao: 'JNA',
    iata: 'LJ',
    name: 'Jin Air',
    callsign: 'JIN AIR',
    country: 'Hàn Quốc',
  },
  TWB: {
    icao: 'TWB',
    iata: 'TW',
    name: "T'way Air",
    callsign: 'TEEWAY',
    country: 'Hàn Quốc',
  },
  EVA: {
    icao: 'EVA',
    iata: 'BR',
    name: 'EVA Air',
    callsign: 'EVA',
    country: 'Đài Loan',
  },
  CAL: {
    icao: 'CAL',
    iata: 'CI',
    name: 'China Airlines',
    callsign: 'DYNASTY',
    country: 'Đài Loan',
  },
  CCA: {
    icao: 'CCA',
    iata: 'CA',
    name: 'Air China',
    callsign: 'AIR CHINA',
    country: 'Trung Quốc',
  },
  CES: {
    icao: 'CES',
    iata: 'MU',
    name: 'China Eastern Airlines',
    callsign: 'CHINA EASTERN',
    country: 'Trung Quốc',
  },
  CSN: {
    icao: 'CSN',
    iata: 'CZ',
    name: 'China Southern Airlines',
    callsign: 'CHINA SOUTHERN',
    country: 'Trung Quốc',
  },
  CSC: {
    icao: 'CSC',
    iata: '3U',
    name: 'Sichuan Airlines',
    callsign: 'SI CHUAN',
    country: 'Trung Quốc',
  },
  CQH: {
    icao: 'CQH',
    iata: '9C',
    name: 'Spring Airlines',
    callsign: 'AIR SPRING',
    country: 'Trung Quốc',
  },
  JAL: {
    icao: 'JAL',
    iata: 'JL',
    name: 'Japan Airlines',
    callsign: 'JAPANAIR',
    country: 'Nhật Bản',
  },
  ANA: {
    icao: 'ANA',
    iata: 'NH',
    name: 'All Nippon Airways',
    callsign: 'ALL NIPPON',
    country: 'Nhật Bản',
  },
  UAE: {
    icao: 'UAE',
    iata: 'EK',
    name: 'Emirates',
    callsign: 'EMIRATES',
    country: 'UAE',
  },
  QTR: {
    icao: 'QTR',
    iata: 'QR',
    name: 'Qatar Airways',
    callsign: 'QATARI',
    country: 'Qatar',
  },
  ETD: {
    icao: 'ETD',
    iata: 'EY',
    name: 'Etihad Airways',
    callsign: 'ETIHAD',
    country: 'UAE',
  },
  AFR: {
    icao: 'AFR',
    iata: 'AF',
    name: 'Air France',
    callsign: 'AIRFRANS',
    country: 'Pháp',
  },
  DLH: {
    icao: 'DLH',
    iata: 'LH',
    name: 'Lufthansa',
    callsign: 'LUFTHANSA',
    country: 'Đức',
  },
  BAW: {
    icao: 'BAW',
    iata: 'BA',
    name: 'British Airways',
    callsign: 'SPEEDBIRD',
    country: 'Vương Quốc Anh',
  },
  QFA: {
    icao: 'QFA',
    iata: 'QF',
    name: 'Qantas',
    callsign: 'QANTAS',
    country: 'Úc',
  },
  UAL: {
    icao: 'UAL',
    iata: 'UA',
    name: 'United Airlines',
    callsign: 'UNITED',
    country: 'Hoa Kỳ',
  },
  DAL: {
    icao: 'DAL',
    iata: 'DL',
    name: 'Delta Air Lines',
    callsign: 'DELTA',
    country: 'Hoa Kỳ',
  },
};

/**
 * Tìm hãng hàng không từ callsign hoặc flight number
 * Ví dụ: "HVN213" -> Vietnam Airlines, "VJ152" -> Vietjet Air
 */
export function identifyAirline(callsignOrFlight: string): AirlineInfo | undefined {
  if (!callsignOrFlight) return undefined;
  const cleaned = callsignOrFlight.trim().toUpperCase();

  // Thử khớp theo 3 chữ cái đầu (mã ICAO)
  if (cleaned.length >= 3) {
    const icao = cleaned.slice(0, 3);
    if (AIRLINES[icao]) return AIRLINES[icao];
  }

  // Thử khớp theo 2 chữ cái đầu (mã IATA)
  if (cleaned.length >= 2) {
    const iata = cleaned.slice(0, 2);
    for (const airline of Object.values(AIRLINES)) {
      if (airline.iata === iata) return airline;
    }
  }

  return undefined;
}
