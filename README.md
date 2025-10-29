# 📸 Wedding Booking App

Ứng dụng quản lý lịch chụp ảnh cưới - React + Vite + Supabase + Tailwind CSS

## ✨ Tính năng

- 📊 **Dashboard:** Thống kê tổng quan và lịch sắp tới
- 📋 **Danh sách booking:** Quản lý tất cả lịch chụp
- 📅 **Lịch:** Xem lịch theo tháng với giao diện trực quan
- ➕ **Thêm/Sửa/Xóa:** Quản lý booking dễ dàng
- 💰 **Theo dõi thanh toán:** Quản lý cọc và thanh toán
- 📱 **Responsive:** Tối ưu cho iPhone và mobile
- 🎨 **3 chế độ hiển thị:** Nhỏ, Vừa, Lớn

## 🚀 Cài đặt

### 1. Clone project

```bash
git clone <repository-url>
cd wedding-booking-app
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Supabase

1. Tạo project Supabase tại [https://supabase.com](https://supabase.com)
2. Tạo bảng `bookings` (xem chi tiết trong [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
3. Copy file `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

4. Điền thông tin Supabase vào `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173) trong browser.

## 📦 Build cho production

```bash
npm run build
```

Build output sẽ nằm trong thư mục `dist/`.

## 🗄️ Database Schema

Xem chi tiết trong [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Bảng `bookings`:
- `id` - UUID (Primary Key)
- `customer_name` - Tên khách hàng
- `phone` - Số điện thoại
- `address` - Địa chỉ chụp
- `shooting_date_time` - Ngày giờ chụp
- `price` - Tổng giá trị
- `deposit` - Tiền cọc
- `notes` - Ghi chú
- `is_completed` - Đã hoàn thành
- `is_fully_paid` - Đã thanh toán đủ
- `created_at` - Ngày tạo
- `updated_at` - Ngày cập nhật

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Supabase** - Backend & Database
- **date-fns** - Date utilities

## 📱 iPhone Optimization

App được tối ưu đặc biệt cho iPhone:
- Safe area support (notch, Dynamic Island, home indicator)
- Dynamic viewport height (100dvh)
- Touch-optimized interactions
- San Francisco font
- Smooth scrolling

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 📄 License

MIT

## 👨‍💻 Developer

Đinh Trung Hà - 2025
