# 🚀 Hướng dẫn thiết lập Supabase cho Wedding Booking App

## 📋 Mục lục
1. [Tạo tài khoản Supabase](#1-tạo-tài-khoản-supabase)
2. [Tạo project mới](#2-tạo-project-mới)
3. [Tạo bảng database](#3-tạo-bảng-database)
4. [Lấy API credentials](#4-lấy-api-credentials)
5. [Cấu hình ứng dụng](#5-cấu-hình-ứng-dụng)
6. [Kiểm tra kết nối](#6-kiểm-tra-kết-nối)

---

## 1. Tạo tài khoản Supabase

1. Truy cập: https://supabase.com
2. Click **"Start your project"** hoặc **"Sign Up"**
3. Đăng ký bằng GitHub, Google, hoặc email
4. Xác nhận email (nếu cần)

---

## 2. Tạo project mới

1. Sau khi đăng nhập, click **"New Project"**
2. Điền thông tin:
   - **Name**: `wedding-booking` (hoặc tên bạn muốn)
   - **Database Password**: Tạo mật khẩu mạnh (LƯU LẠI mật khẩu này!)
   - **Region**: Chọn `Southeast Asia (Singapore)` (gần Việt Nam nhất)
   - **Pricing Plan**: Chọn **Free** (đủ cho development)
3. Click **"Create new project"**
4. Đợi 1-2 phút để Supabase khởi tạo project

---

## 3. Tạo bảng database

### Cách 1: Dùng SQL Editor (Khuyến nghị)

1. Vào **SQL Editor** (menu bên trái)
2. Click **"New query"**
3. Copy và paste đoạn SQL sau:

```sql
-- Tạo bảng bookings
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  shooting_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0,
  deposit NUMERIC(10, 2) DEFAULT 0,
  notes TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  is_fully_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tăng tốc độ query
CREATE INDEX idx_bookings_shooting_date ON bookings(shooting_date_time);
CREATE INDEX idx_bookings_is_completed ON bookings(is_completed);

-- Bật Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép tất cả thao tác (cho development)
-- LƯU Ý: Trong production nên có authentication và policy chặt chẽ hơn
CREATE POLICY "Enable all access for development" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Thêm dữ liệu mẫu (optional)
INSERT INTO bookings (customer_name, phone, address, shooting_date_time, price, deposit, notes)
VALUES 
  ('Nguyễn Văn A', '0901234567', 'Hà Nội', '2025-11-15 14:00:00+07', 5000000, 2000000, 'Chụp ảnh cưới ngoại cảnh'),
  ('Trần Thị B', '0912345678', 'TP.HCM', '2025-11-20 09:00:00+07', 7000000, 3000000, 'Chụp ảnh studio + ngoại cảnh'),
  ('Lê Văn C', '0923456789', 'Đà Nẵng', '2025-11-25 16:00:00+07', 4000000, 2000000, 'Chụp ảnh cưới biển');
```

4. Click **"Run"** (hoặc Ctrl/Cmd + Enter)
5. Kiểm tra kết quả: Nếu thấy "Success. No rows returned" là OK!

### Cách 2: Dùng Table Editor (Giao diện)

1. Vào **Table Editor** (menu bên trái)
2. Click **"Create a new table"**
3. Tạo bảng `bookings` với các cột:
   - `id`: uuid, primary key, default: gen_random_uuid()
   - `customer_name`: text, not null
   - `phone`: text, not null
   - `address`: text, not null
   - `shooting_date_time`: timestamptz, not null
   - `price`: numeric, default: 0
   - `deposit`: numeric, default: 0
   - `notes`: text
   - `is_completed`: boolean, default: false
   - `is_fully_paid`: boolean, default: false
   - `created_at`: timestamptz, default: now()

---

## 4. Lấy API credentials

1. Vào **Settings** > **API** (menu bên trái)
2. Tìm phần **Project URL**:
   - Copy URL (dạng: `https://xxxxxxxxxxxxx.supabase.co`)
3. Tìm phần **Project API keys**:
   - Copy **anon public** key (key dài, bắt đầu bằng `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - ⚠️ **KHÔNG** dùng `service_role` key ở client-side!

---

## 5. Cấu hình ứng dụng

### Bước 1: Cập nhật file `.env.local`

1. Mở file `wedding-booking-app/.env.local`
2. Thay thế các giá trị:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Lưu file

### Bước 2: Khởi động lại dev server

```bash
# Dừng server hiện tại (Ctrl + C)
# Khởi động lại
npm run dev
```

---

## 6. Kiểm tra kết nối

### Kiểm tra trong Console

1. Mở ứng dụng trong browser
2. Mở **Developer Tools** (F12)
3. Vào tab **Console**
4. Tìm các log:
   - ✅ `Supabase client đã được khởi tạo thành công!`
   - ✅ `Đang tải bookings từ Supabase...`
   - ✅ `Đã tải X bookings từ Supabase`

### Kiểm tra trong ứng dụng

1. Vào tab **Dashboard**:
   - Nếu thấy số liệu thống kê → Kết nối thành công! ✅
2. Vào tab **Danh sách**:
   - Nếu thấy danh sách booking → Kết nối thành công! ✅
3. Thử thêm booking mới:
   - Click nút **+** ở góc dưới phải
   - Điền thông tin và lưu
   - Kiểm tra trong Supabase Table Editor xem có dữ liệu mới không

---

## 🔧 Troubleshooting

### Lỗi: "Supabase connection not configured"

**Nguyên nhân:** Chưa cấu hình `.env.local` đúng

**Giải pháp:**
1. Kiểm tra file `.env.local` có tồn tại không
2. Kiểm tra các biến môi trường có đúng tên không:
   - `VITE_SUPABASE_URL` (có prefix `VITE_`)
   - `VITE_SUPABASE_ANON_KEY` (có prefix `VITE_`)
3. Khởi động lại dev server: `npm run dev`

### Lỗi: "Failed to fetch" hoặc CORS error

**Nguyên nhân:** URL hoặc API key sai

**Giải pháp:**
1. Kiểm tra lại URL và API key trong Supabase Dashboard
2. Đảm bảo copy đúng **anon public** key (không phải service_role)
3. Kiểm tra project Supabase có đang hoạt động không

### Lỗi: "permission denied for table bookings"

**Nguyên nhân:** Chưa bật RLS hoặc chưa tạo policy

**Giải pháp:**
1. Vào **Authentication** > **Policies**
2. Chọn bảng `bookings`
3. Tạo policy mới cho phép tất cả thao tác (xem phần 3)

### Không thấy dữ liệu trong ứng dụng

**Giải pháp:**
1. Kiểm tra Console có lỗi không
2. Vào Supabase Table Editor, kiểm tra bảng `bookings` có dữ liệu không
3. Thử refresh lại trang (F5)
4. Kiểm tra Network tab xem có request đến Supabase không

---

## 📚 Tài liệu tham khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 Hoàn thành!

Nếu mọi thứ hoạt động tốt, bạn đã thiết lập thành công Supabase cho ứng dụng Wedding Booking! 🎊

**Các bước tiếp theo:**
- Thêm authentication (đăng nhập/đăng ký)
- Tạo RLS policies chặt chẽ hơn
- Deploy lên production
- Backup database định kỳ

Chúc bạn phát triển ứng dụng thành công! 💪

