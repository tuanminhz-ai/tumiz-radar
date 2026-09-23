import { FlightData } from '@/types/flight';
import { AIRPORTS } from '../aviation-db/airports';
import { identifyAirline } from '../aviation-db/airlines';
import { identifyAircraftType } from '../aviation-db/aircraft-types';
import { determineFlightStatus } from '../aviation-db/helpers';

interface DemoFlightTemplate {
  hex: string;
  callsign: string;
  flightNumber: string;
  registration: string;
  typeCode: string;
  originIata: string;
  destIata: string;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  baseAltitude: number;
  baseSpeed: number;
  squawk: string;
  progressOffset: number; // 0 to 1
  speedFactor: number;
}

const DEMO_TEMPLATES: DemoFlightTemplate[] = [
  {
    hex: '888083',
    callsign: 'HVN83',
    flightNumber: 'VN 83',
    registration: 'VN-A868',
    typeCode: 'B789',
    originIata: 'HAN',
    destIata: 'AMS',
    startLat: 21.2212,
    startLon: 105.8072,
    endLat: 52.3105,
    endLon: 4.7683,
    baseAltitude: 39000,
    baseSpeed: 495,
    squawk: '0833',
    progressOffset: 0.32,
    speedFactor: 0.00004,
  },
  {
    hex: '888123',
    callsign: 'HVN213',
    flightNumber: 'VN 213',
    registration: 'VN-A614',
    typeCode: 'A321',
    originIata: 'HAN',
    destIata: 'SGN',
    startLat: 21.2212,
    startLon: 105.8072,
    endLat: 10.8188,
    endLon: 106.6519,
    baseAltitude: 33000,
    baseSpeed: 450,
    squawk: '2130',
    progressOffset: 0.45,
    speedFactor: 0.00008,
  },
  {
    hex: '888152',
    callsign: 'VJC152',
    flightNumber: 'VJ 152',
    registration: 'VN-A699',
    typeCode: 'A321',
    originIata: 'SGN',
    destIata: 'HAN',
    startLat: 10.8188,
    startLon: 106.6519,
    endLat: 21.2212,
    endLon: 105.8072,
    baseAltitude: 36000,
    baseSpeed: 465,
    squawk: '1520',
    progressOffset: 0.65,
    speedFactor: 0.00009,
  },
  {
    hex: '888245',
    callsign: 'BAV245',
    flightNumber: 'QH 245',
    registration: 'VN-A588',
    typeCode: 'B789',
    originIata: 'HAN',
    destIata: 'SGN',
    startLat: 21.2212,
    startLon: 105.8072,
    endLat: 10.8188,
    endLon: 106.6519,
    baseAltitude: 38000,
    baseSpeed: 490,
    squawk: '2455',
    progressOffset: 0.20,
    speedFactor: 0.000085,
  },
  {
    hex: '888120',
    callsign: 'HVN123',
    flightNumber: 'VN 123',
    registration: 'VN-A899',
    typeCode: 'A359',
    originIata: 'HAN',
    destIata: 'DAD',
    startLat: 21.2212,
    startLon: 105.8072,
    endLat: 16.0439,
    endLon: 108.1994,
    baseAltitude: 26000,
    baseSpeed: 420,
    squawk: '1234',
    progressOffset: 0.55,
    speedFactor: 0.0001,
  },
  {
    hex: '888625',
    callsign: 'VJC625',
    flightNumber: 'VJ 625',
    registration: 'VN-A652',
    typeCode: 'A320',
    originIata: 'DAD',
    destIata: 'SGN',
    startLat: 16.0439,
    startLon: 108.1994,
    endLat: 10.8188,
    endLon: 106.6519,
    baseAltitude: 31000,
    baseSpeed: 440,
    squawk: '6251',
    progressOffset: 0.35,
    speedFactor: 0.000095,
  },
  {
    hex: '888772',
    callsign: 'VJC772',
    flightNumber: 'VJ 772',
    registration: 'VN-A540',
    typeCode: 'A321',
    originIata: 'CXR',
    destIata: 'HAN',
    startLat: 11.9981,
    startLon: 109.2194,
    endLat: 21.2212,
    endLon: 105.8072,
    baseAltitude: 34000,
    baseSpeed: 460,
    squawk: '7723',
    progressOffset: 0.70,
    speedFactor: 0.00008,
  },
  {
    hex: '76cc12',
    callsign: 'SIA66',
    flightNumber: 'SQ 66',
    registration: '9V-SHF',
    typeCode: 'A359',
    originIata: 'SIN',
    destIata: 'SGN',
    startLat: 1.3644,
    startLon: 103.9915,
    endLat: 10.8188,
    endLon: 106.6519,
    baseAltitude: 39000,
    baseSpeed: 480,
    squawk: '0661',
    progressOffset: 0.80,
    speedFactor: 0.00007,
  },
  {
    hex: '8852e2',
    callsign: 'THA564',
    flightNumber: 'TG 564',
    registration: 'HS-THK',
    typeCode: 'A359',
    originIata: 'BKK',
    destIata: 'HAN',
    startLat: 13.6900,
    startLon: 100.7501,
    endLat: 21.2212,
    endLon: 105.8072,
    baseAltitude: 37000,
    baseSpeed: 475,
    squawk: '5642',
    progressOffset: 0.60,
    speedFactor: 0.00008,
  },
  {
    hex: '71c541',
    callsign: 'ESR518',
    flightNumber: 'ZE 518',
    registration: 'HL8541',
    typeCode: 'B38M',
    originIata: 'HAN',
    destIata: 'ICN',
    startLat: 21.2212,
    startLon: 105.8072,
    endLat: 37.4602,
    endLon: 126.4407,
    baseAltitude: 35000,
    baseSpeed: 452,
    squawk: '6171',
    progressOffset: 0.15,
    speedFactor: 0.00006,
  },
  {
    hex: '781b79',
    callsign: 'CSC3774',
    flightNumber: '3U 3774',
    registration: 'B-30CP',
    typeCode: 'A321',
    originIata: 'SGN',
    destIata: 'CAN',
    startLat: 10.8188,
    startLon: 106.6519,
    endLat: 23.3924,
    endLon: 113.2988,
    baseAltitude: 36000,
    baseSpeed: 470,
    squawk: '3774',
    progressOffset: 0.40,
    speedFactor: 0.000075,
  },
];

/**
 * Tạo danh sách chuyến bay giả lập di chuyển thời gian thực phục vụ chế độ Demo
 */
export function getMockFlights(): FlightData[] {
  const now = Date.now();

  return DEMO_TEMPLATES.map((tmpl) => {
    // Tính tiến độ bay theo thời gian (chu kỳ lặp lại)
    const rawProgress = (tmpl.progressOffset + (now * tmpl.speedFactor) % 1) % 1;
    const progress = Math.max(0.01, Math.min(0.99, rawProgress));

    // Tính tọa độ hiện tại nội suy giữa điểm đi và điểm đến
    const lat = tmpl.startLat + (tmpl.endLat - tmpl.startLat) * progress;
    const lon = tmpl.startLon + (tmpl.endLon - tmpl.startLon) * progress;

    // Tính góc hướng bay (Track heading)
    const dLon = ((tmpl.endLon - tmpl.startLon) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((tmpl.endLat * Math.PI) / 180);
    const x =
      Math.cos((tmpl.startLat * Math.PI) / 180) * Math.sin((tmpl.endLat * Math.PI) / 180) -
      Math.sin((tmpl.startLat * Math.PI) / 180) *
        Math.cos((tmpl.endLat * Math.PI) / 180) *
        Math.cos(dLon);
    let track = (Math.atan2(y, x) * 180) / Math.PI;
    track = (track + 360) % 360;

    // Tính độ cao & tốc độ leo
    let altitudeFt = tmpl.baseAltitude;
    let verticalRateFpm = 0;
    if (progress < 0.15) {
      altitudeFt = Math.round(5000 + (tmpl.baseAltitude - 5000) * (progress / 0.15));
      verticalRateFpm = 1800;
    } else if (progress > 0.85) {
      altitudeFt = Math.round(tmpl.baseAltitude * ((1 - progress) / 0.15));
      verticalRateFpm = -1500;
    }

    const { status, labelVi } = determineFlightStatus(false, altitudeFt, verticalRateFpm, tmpl.baseSpeed);

    const origin = AIRPORTS[tmpl.originIata];
    const destination = AIRPORTS[tmpl.destIata];
    const airline = identifyAirline(tmpl.callsign);
    const aircraftType = identifyAircraftType(tmpl.typeCode);

    return {
      id: tmpl.hex,
      hex: tmpl.hex,
      callsign: tmpl.callsign,
      flightNumber: tmpl.flightNumber,
      registration: tmpl.registration,
      airline,
      aircraftType,
      typeCode: tmpl.typeCode,
      lat: Number(lat.toFixed(4)),
      lon: Number(lon.toFixed(4)),
      altitudeFt,
      altitudeM: Math.round(altitudeFt * 0.3048),
      groundSpeedKts: tmpl.baseSpeed,
      groundSpeedKmh: Math.round(tmpl.baseSpeed * 1.852),
      track: Math.round(track),
      verticalRateFpm,
      squawk: tmpl.squawk,
      onGround: false,
      status,
      statusLabelVi: labelVi,
      origin,
      destination,
      isReferenceRoute: true,
      lastContact: Math.floor(now / 1000),
      updatedAt: new Date(now).toISOString(),
      dataSource: 'demo',
    };
  });
}
