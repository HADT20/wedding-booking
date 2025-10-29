# 🗄️ Hướng dẫn Setup Supabase Database

## 1. Tạo Project Supabase

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng nhập hoặc tạo tài khoản mới
3. Click **"New Project"**
4. Điền thông tin:
   - **Name:** wedding-booking-app (hoặc tên bạn muốn)
   - **Database Password:** Tạo mật khẩu mạnh (lưu lại để sau này dùng)
   - **Region:** Southeast Asia (Singapore) - gần Việt Nam nhất
5. Click **"Create new project"** và đợi vài phút

## 2. Tạo Table `bookings`

1. Vào **SQL Editor** (menu bên trái)
2. Click **"New query"**
3. Copy và paste đoạn SQL sau:

```sql
-- Tạo bảng bookings
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  shooting_date_time TIMESTAMPTZ NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  deposit DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  is_fully_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tạo index để tăng tốc độ query
CREATE INDEX idx_bookings_shooting_date ON bookings(shooting_date_time);
CREATE INDEX idx_bookings_customer_name ON bookings(customer_name);
CREATE INDEX idx_bookings_is_completed ON bookings(is_completed);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để tự động cập nhật updated_at khi có thay đổi
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Thêm comment cho các cột
COMMENT ON TABLE bookings IS 'Bảng lưu trữ thông tin đặt lịch chụp ảnh cưới';
COMMENT ON COLUMN bookings.customer_name IS 'Tên khách hàng';
COMMENT ON COLUMN bookings.phone IS 'Số điện thoại';
COMMENT ON COLUMN bookings.address IS 'Địa chỉ chụp ảnh';
COMMENT ON COLUMN bookings.shooting_date_time IS 'Ngày giờ chụp ảnh';
COMMENT ON COLUMN bookings.price IS 'Tổng giá trị hợp đồng';
COMMENT ON COLUMN bookings.deposit IS 'Số tiền đã cọc';
COMMENT ON COLUMN bookings.notes IS 'Ghi chú thêm';
COMMENT ON COLUMN bookings.is_completed IS 'Đã hoàn thành chụp';
COMMENT ON COLUMN bookings.is_fully_paid IS 'Đã thanh toán đủ';
```

4. Click **"Run"** để thực thi
5. Kiểm tra kết quả: Nếu thành công sẽ hiện "Success. No rows returned"

## 3. Cấu hình Row Level Security (RLS)

### Tắt RLS để test (không khuyến khích cho production):

```sql
-- Tắt RLS (chỉ dùng cho development/testing)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

### Hoặc bật RLS với policy cho phép tất cả (khuyến khích):

```sql
-- Bật RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép SELECT (đọc)
CREATE POLICY "Allow public read access"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- Tạo policy cho phép INSERT (thêm)
CREATE POLICY "Allow public insert access"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Tạo policy cho phép UPDATE (cập nhật)
CREATE POLICY "Allow public update access"
  ON bookings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Tạo policy cho phép DELETE (xóa)
CREATE POLICY "Allow public delete access"
  ON bookings
  FOR DELETE
  TO public
  USING (true);
```

**Lưu ý:** Cấu hình trên cho phép tất cả mọi người truy cập. Trong production, bạn nên thêm authentication và giới hạn quyền truy cập.

## 4. Lấy API Keys

1. Vào **Settings** → **API** (menu bên trái)
2. Tìm và copy 2 thông tin sau:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (một chuỗi rất dài)

## 5. Cấu hình trong Project

1. Mở file `.env.local` trong project
2. Thay thế các giá trị:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Lưu file

## 6. Test kết nối

1. Khởi động lại dev server:
```bash
npm run dev
```

2. Mở browser console (F12)
3. Kiểm tra log:
   - ✅ "Supabase client đã được khởi tạo thành công!" → Kết nối OK
   - ❌ "Thiếu cấu hình Supabase!" → Kiểm tra lại file .env.local

## 7. Thêm dữ liệu mẫu (Optional)

Nếu muốn thêm dữ liệu mẫu để test:

```sql
INSERT INTO bookings (customer_name, phone, address, shooting_date_time, price, deposit, notes)
VALUES 
  ('Nguyễn Văn A & Trần Thị B', '0901234567', 'Công viên Tao Đàn, Q1, TP.HCM', '2025-11-15 08:00:00+07', 15000000, 5000000, 'Chụp ngoại cảnh buổi sáng'),
  ('Lê Văn C & Phạm Thị D', '0912345678', 'Nhà thờ Đức Bà, Q1, TP.HCM', '2025-11-20 14:00:00+07', 20000000, 8000000, 'Chụp trong nhà thờ + ngoại cảnh'),
  ('Hoàng Văn E & Võ Thị F', '0923456789', 'Bảo tàng Mỹ thuật, Q3, TP.HCM', '2025-11-25 09:00:00+07', 18000000, 6000000, 'Chụp concept nghệ thuật');
```

## 8. Kiểm tra trong App

1. Mở app trong browser
2. Vào tab **"Danh sách"**
3. Nếu thấy dữ liệu hiển thị → Thành công! 🎉
4. Thử thêm booking mới để test chức năng INSERT

## 🔒 Bảo mật (Production)

Khi deploy lên production, nên:

1. **Bật Authentication:**
   - Vào **Authentication** → **Providers**
   - Bật Email/Password hoặc OAuth (Google, Facebook...)

2. **Cập nhật RLS Policies:**
   - Chỉ cho phép user đã đăng nhập truy cập
   - Ví dụ: `USING (auth.uid() IS NOT NULL)`

3. **Giới hạn quyền:**
   - Tạo role riêng cho admin
   - Chỉ admin mới được xóa/sửa booking

## 📚 Tài liệu tham khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ❓ Troubleshooting

### Lỗi: "Supabase connection not configured"
- Kiểm tra file `.env.local` có đúng format không
- Restart dev server sau khi thay đổi .env

### Lỗi: "Failed to fetch"
- Kiểm tra Project URL có đúng không
- Kiểm tra internet connection

### Lỗi: "new row violates row-level security policy"
- Kiểm tra RLS policies
- Có thể tạm thời disable RLS để test

### Không thấy dữ liệu
- Vào Supabase Dashboard → Table Editor → bookings
- Kiểm tra xem có data không
- Kiểm tra console log trong browser

---

**Chúc bạn setup thành công! 🚀**

