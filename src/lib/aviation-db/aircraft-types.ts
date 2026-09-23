import { AircraftTypeInfo } from '@/types/flight';

export const AIRCRAFT_TYPES: Record<string, AircraftTypeInfo> = {
  // Airbus
  A220: { code: 'A220', manufacturer: 'Airbus', model: 'A220-300', family: 'A220' },
  BCS3: { code: 'BCS3', manufacturer: 'Airbus', model: 'A220-300', family: 'A220' },
  A319: { code: 'A319', manufacturer: 'Airbus', model: 'A319-100', family: 'A320' },
  A320: { code: 'A320', manufacturer: 'Airbus', model: 'A320-200ceo', family: 'A320' },
  A20N: { code: 'A20N', manufacturer: 'Airbus', model: 'A320neo', family: 'A320neo' },
  A321: { code: 'A321', manufacturer: 'Airbus', model: 'A321-200ceo', family: 'A320' },
  A21N: { code: 'A21N', manufacturer: 'Airbus', model: 'A321neo ACF', family: 'A320neo' },
  A332: { code: 'A332', manufacturer: 'Airbus', model: 'A330-200', family: 'A330' },
  A333: { code: 'A333', manufacturer: 'Airbus', model: 'A330-300', family: 'A330' },
  A339: { code: 'A339', manufacturer: 'Airbus', model: 'A330-900neo', family: 'A330neo' },
  A359: { code: 'A359', manufacturer: 'Airbus', model: 'A350-900 XWB', family: 'A350' },
  A35K: { code: 'A35K', manufacturer: 'Airbus', model: 'A350-1000 XWB', family: 'A350' },
  A388: { code: 'A388', manufacturer: 'Airbus', model: 'A380-800 Superjumbo', family: 'A380' },

  // Boeing
  B737: { code: 'B737', manufacturer: 'Boeing', model: '737 Next-Gen', family: '737' },
  B738: { code: 'B738', manufacturer: 'Boeing', model: '737-800', family: '737' },
  B739: { code: 'B739', manufacturer: 'Boeing', model: '737-900ER', family: '737' },
  B38M: { code: 'B38M', manufacturer: 'Boeing', model: '737 MAX 8', family: '737 MAX' },
  B39M: { code: 'B39M', manufacturer: 'Boeing', model: '737 MAX 9', family: '737 MAX' },
  B744: { code: 'B744', manufacturer: 'Boeing', model: '747-400 Queen of the Skies', family: '747' },
  B748: { code: 'B748', manufacturer: 'Boeing', model: '747-8 Intercontinental', family: '747' },
  B772: { code: 'B772', manufacturer: 'Boeing', model: '777-200ER', family: '777' },
  B77W: { code: 'B77W', manufacturer: 'Boeing', model: '777-300ER', family: '777' },
  B788: { code: 'B788', manufacturer: 'Boeing', model: '787-8 Dreamliner', family: '787' },
  B789: { code: 'B789', manufacturer: 'Boeing', model: '787-9 Dreamliner', family: '787' },
  B78X: { code: 'B78X', manufacturer: 'Boeing', model: '787-10 Dreamliner', family: '787' },

  // ATR & Embraer
  AT72: { code: 'AT72', manufacturer: 'ATR', model: 'ATR 72-500', family: 'ATR 72' },
  AT76: { code: 'AT76', manufacturer: 'ATR', model: 'ATR 72-600', family: 'ATR 72' },
  E190: { code: 'E190', manufacturer: 'Embraer', model: 'E190', family: 'E-Jet' },
  E195: { code: 'E195', manufacturer: 'Embraer', model: 'E195', family: 'E-Jet' },
  E295: { code: 'E295', manufacturer: 'Embraer', model: 'E195-E2', family: 'E-Jet E2' },
};

export function identifyAircraftType(typeCode: string): AircraftTypeInfo | undefined {
  if (!typeCode) return undefined;
  const cleaned = typeCode.trim().toUpperCase();
  if (AIRCRAFT_TYPES[cleaned]) return AIRCRAFT_TYPES[cleaned];

  // Nếu không có trong danh mục chính xác, tạo thông tin cơ bản
  return {
    code: cleaned,
    manufacturer: cleaned.startsWith('A') ? 'Airbus' : cleaned.startsWith('B') ? 'Boeing' : 'Chưa xác định',
    model: `Dòng ${cleaned}`,
  };
}
