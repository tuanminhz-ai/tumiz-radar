# ✈️ Tumiz Radar - Hệ Thống Theo Dõi Chuyến Bay Thời Gian Thực

**Tumiz Radar** là website theo dõi chuyến bay trực tiếp phong cách màn hình điều hành không lưu (Navy & Cyan). Ứng dụng hiển thị dữ liệu radar ADS-B thực tế, hình ảnh tàu bay có bản quyền tác giả từ Planespotters, cơ sở dữ liệu sân bay/hãng hàng không phong phú và hỗ trợ chế độ thử nghiệm (Demo) thông minh.

Dự án được xây dựng bằng **Next.js 14, TypeScript, Tailwind CSS và Leaflet**, sẵn sàng để deploy lên **Vercel** chỉ sau vài bước đơn giản.

---

## 🌟 Tính Năng Nổi Bật

1. **Radar Thời Gian Thực (Live ADS-B)**:
   - Quét và hiển thị các máy bay đang hoạt động trong vùng trời Việt Nam và khu vực lân cận.
   - Icon máy bay SVG xoay mượt mà theo góc hướng bay thực tế (`track`).
   - Phân biệt trạng thái bay bằng màu sắc: **Xanh Cyan** (Hành trình bay bằng), **Xanh Lá** (Đang lấy độ cao), **Vàng Cam** (Đang tiếp cận/hạ cánh), **Xám** (Trên mặt đất).

2. **Hình Ảnh Tàu Bay Thực Tế (Real Aircraft Photo)**:
   - Tự động gọi API Planespotters.net để hiển thị ảnh thật của chính chiếc máy bay đó theo mã định danh ICAO24 hoặc số đăng ký.
   - Ghi nhận đầy đủ bản quyền và link đến trang của nhiếp ảnh gia.

3. **Tra Cứu & Lọc Thông Minh**:
   - Tìm kiếm nhanh theo Số hiệu chuyến bay (ví dụ: `VN 213`, `VJ 152`), Callsign (`HVN213`), Số đăng ký (`VN-A614`), Hãng bay hoặc Sân bay.
   - Lọc theo từng giai đoạn bay (Tất cả, Đang bay, Cất cánh, Hạ cánh).
   - Lọc theo hãng hàng không (Vietnam Airlines, Vietjet, Bamboo Airways, Vietravel Airlines, các hãng quốc tế).
   - Sắp xếp linh hoạt theo độ cao, vận tốc hoặc tên callsign.

4. **Bảng Thông Số Kỹ Thuật Chi Tiết**:
   - Độ cao khí áp (ft & mét), Vận tốc mặt đất (knots & km/h), Hướng la bàn, Tốc độ nâng/hạ (ft/phút).
   - Mã máy phát đáp Squawk (ví dụ: `2130`), tọa độ GPS chuẩn xác.
   - Hiển thị nhãn **"Chưa có dữ liệu"** đối với các trường thông tin mà nguồn tín hiệu chưa cung cấp (không tự bịa đặt số liệu giả).

5. **Chia Sẻ Chuyến Bay & Lưu Yêu Thích**:
   - Nút **"Chia sẻ"** tự động tạo URL chứa query parameter (`?flight=HVN213&hex=888123`) giúp bạn bè mở đúng ngay chiếc máy bay đó trên điện thoại/máy tính.
   - Nút **"Lưu yêu thích"** (Star) lưu trữ danh sách trên trình duyệt (`localStorage`) để theo dõi thường xuyên.

6. **Chế Độ Thử Nghiệm (Demo Mode) Tách Bạch**:
   - Nếu máy chủ ADS-B công cộng bị quá tải hoặc nghẽn mạng, người dùng có thể chủ động bật nút **"Chế độ Demo"** với nhãn cảnh báo rõ ràng.
   - Hệ thống mô phỏng sinh động các chuyến bay thực tế của Việt Nam (Hà Nội - Sài Gòn, Đà Nẵng, Cam Ranh, Phú Quốc, Bangkok, Singapore...).

7. **Từ Điển Thuật Ngữ Hàng Không**:
   - Modal giải thích dễ hiểu các khái niệm: *Callsign là gì, Mã ICAO24 là gì, Số đăng ký khác gì số hiệu, Mã Squawk là gì...*

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Bản đồ**: Leaflet, React-Leaflet kết hợp bản đồ CartoDB Dark Matter.
- **Backend**: Next.js API Routes (`/api/flights`, `/api/aircraft/[hex]`) làm proxy bảo mật, cache 10 giây trong bộ nhớ để bảo vệ rate limit.
- **Nguồn dữ liệu**:
  - Tọa độ ADS-B trực tiếp: `api.adsb.lol` (Open Community ADS-B feed)
  - Ảnh tàu bay: `api.planespotters.net`
  - Cơ sở dữ liệu nội bộ: Sân bay quốc tế & Việt Nam, Hãng hàng không, Dòng máy bay ICAO.

---

## 🚀 Hướng Dẫn Chạy Trên Máy Của Bạn (Local Development)

### 1. Chuẩn bị
Máy tính của bạn cần cài đặt **Node.js** (khuyến nghị phiên bản LTS từ v18 hoặc v20 trở lên).

### 2. Cài đặt các gói phụ thuộc
Mở ứng dụng Terminal (trên macOS/Linux) hoặc Command Prompt / PowerShell (trên Windows), chuyển đến thư mục dự án và chạy:
```bash
npm install
```

### 3. Khởi động môi trường phát triển
```bash
npm run dev
```
Mở trình duyệt web và truy cập địa chỉ: [http://localhost:3000](http://localhost:3000).

---

## 🌐 Hướng Dẫn Từng Bước Deploy Lên Mạng Qua Vercel (Miễn Phí 100%)

Đây là cách bạn đưa website lên internet để nhận đường link gửi cho bạn bè mà không tốn một đồng chi phí nào:

### Bước 1: Đưa mã nguồn lên GitHub
1. Truy cập [github.com](https://github.com) và đăng nhập tài khoản của bạn (nếu chưa có, hãy đăng ký miễn phí).
2. Bấm vào nút dấu cộng `+` ở góc trên cùng bên phải -> chọn **New repository**.
3. Đặt tên repository là `tumiz-radar`, để chế độ **Public** và bấm **Create repository**.
4. Trong cửa sổ dòng lệnh tại thư mục dự án, chạy các lệnh sau (thay `YOUR_USERNAME` bằng tên GitHub của bạn):
```bash
git add .
git commit -m "Khoi tao website theo doi chuyen bay Tumiz Radar"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tumiz-radar.git
git push -u origin main
```

### Bước 2: Đăng ký & Đăng nhập Vercel
1. Truy cập [vercel.com](https://vercel.com).
2. Bấm nút **Sign Up** (hoặc **Log In**) -> Chọn **Continue with GitHub**.

### Bước 3: Import dự án vào Vercel
1. Tại trang Dashboard của Vercel, bấm nút **Add New...** -> chọn **Project**.
2. Vercel sẽ tự động hiển thị danh sách repository trên GitHub của bạn. Tìm `tumiz-radar` và bấm nút **Import**.
3. Tại màn hình **Configure Project**:
   - **Framework Preset**: Mặc định là `Next.js` (giữ nguyên).
   - **Root Directory**: `./` (giữ nguyên).
   - **Environment Variables**: Dự án hoạt động ngay mà không cần bắt buộc API key nào. Nếu bạn có domain riêng, bạn có thể thêm:
     - `NEXT_PUBLIC_SITE_URL`: `https://tumiz-radar.vercel.app`
4. Bấm nút **Deploy**.

### Bước 4: Nhận link website & Chia sẻ
1. Đợi khoảng 1-2 phút trong khi Vercel tự động build.
2. Khi màn hình hiện pháo hoa chúc mừng (*Congratulations!*), bạn sẽ nhận được đường link dạng:
   `https://tumiz-radar.vercel.app` (hoặc tên tương tự do Vercel cấp).
3. Bấm vào đường link để mở website! Thử mở trên điện thoại hoặc cửa sổ ẩn danh để kiểm tra bạn bè truy cập được mượt mà mà không cần tài khoản.
4. Bấm vào bất kỳ chuyến bay nào và bấm nút **Chia sẻ** để gửi link trực tiếp cho bạn bè!

---

## 💡 Cập Nhật Website Khi Sửa Code
Mỗi khi bạn sửa code và chạy:
```bash
git add .
git commit -m "Cap nhat giao dien moi"
git push
```
Vercel sẽ tự động phát hiện và cập nhật website trực tuyến chỉ trong vài chục giây mà bạn không cần thao tác gì thêm!

---

## 📄 Bản Quyền & Nguồn Dữ Liệu
- **Dữ liệu bản đồ**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, © [CARTO](https://carto.com/attributions).
- **Dữ liệu chuyến bay ADS-B**: Cung cấp bởi mạng lưới cộng đồng ADS-B mở dưới giấy phép ODbL.
- **Hình ảnh tàu bay**: Bản quyền thuộc về các nhiếp ảnh gia trên [Planespotters.net](https://www.planespotters.net).
