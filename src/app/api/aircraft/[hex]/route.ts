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

  const { searchParams } = new URL(request.url);
  const reg = searchParams.get('reg');

  try {
    // Lấy ảnh từ Planespotters và thông tin chuyến bay nếu có
    let photo = await getAircraftPhoto(hex);
    if (!photo && reg) {
      photo = await getAircraftPhoto(reg);
    }

    const flight = await fetchLiveFlightByHex(hex);

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
