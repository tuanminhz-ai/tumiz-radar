import { NextRequest, NextResponse } from 'next/server';
import { getAircraftPhoto } from '@/lib/providers/planespotters-provider';
import { fetchLiveFlightByHex } from '@/lib/providers/adsb-provider';

export async function GET(
  request: NextRequest,
  { params }: { params: { hex: string } }
) {
  const hex = params.hex;
  if (!hex) {
    return NextResponse.json({ error: 'Mã ICAO24 (hex) không hợp lệ' }, { status: 400 });
  }

  try {
    // Lấy ảnh từ Planespotters và thông tin chuyến bay nếu có
    const [photo, flight] = await Promise.all([
      getAircraftPhoto(hex),
      fetchLiveFlightByHex(hex),
    ]);

    return NextResponse.json({
      success: true,
      hex,
      photo,
      flight,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi tra cứu thông tin tàu bay';
    return NextResponse.json(
      {
        success: false,
        hex,
        photo: null,
        flight: null,
        error: message,
      },
      { status: 500 }
    );
  }
}
