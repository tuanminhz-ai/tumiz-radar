import { AircraftPhoto } from '@/types/flight';

// Bộ nhớ cache tạm trong bộ nhớ cho ảnh máy bay (TTL 24 giờ)
const photoCache = new Map<string, { photo: AircraftPhoto | null; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Lấy ảnh máy bay thực tế từ Planespotters.net API theo mã hex ICAO24 hoặc registration
 */
export async function getAircraftPhoto(hexOrReg: string): Promise<AircraftPhoto | null> {
  if (!hexOrReg) return null;
  const key = hexOrReg.trim().toLowerCase();

  // Kiểm tra cache
  const cached = photoCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.photo;
  }

  try {
    const isHex = /^[0-9a-fA-F]{6}$/.test(key);
    const url = isHex
      ? `https://api.planespotters.net/pub/photos/hex/${key}`
      : `https://api.planespotters.net/pub/photos/reg/${encodeURIComponent(key)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TumizRadar/1.0 (+https://tumiz-radar.vercel.app; contact@tumiz.local)',
      },
      next: { revalidate: 86400 }, // Next.js cache 24h
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      photoCache.set(key, { photo: null, timestamp: Date.now() });
      return null;
    }

    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      const p = data.photos[0];
      const photo: AircraftPhoto = {
        url: p.thumbnail_large?.src || p.thumbnail?.src || '',
        thumbnail: p.thumbnail?.src || '',
        photographer: p.photographer || 'Không rõ',
        sourceUrl: p.link || 'https://www.planespotters.net',
        attribution: `Ảnh: ${p.photographer} / Planespotters.net`,
      };

      photoCache.set(key, { photo, timestamp: Date.now() });
      return photo;
    }

    photoCache.set(key, { photo: null, timestamp: Date.now() });
    return null;
  } catch (error) {
    // Không ném lỗi để tránh sập app nếu mạng chậm
    console.error(`Lỗi khi lấy ảnh máy bay cho ${hexOrReg}:`, error);
    return null;
  }
}
