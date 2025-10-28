// Khởi tạo Supabase client
import { createClient } from '@supabase/supabase-js';

// Lấy thông tin từ biến môi trường
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra xem có đủ thông tin cấu hình không
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Thiếu cấu hình Supabase!');
  console.error('Vui lòng tạo file .env.local và thêm:');
  console.error('VITE_SUPABASE_URL=your-project-url');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Tạo Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Log trạng thái kết nối
if (supabase) {
  console.log('✅ Supabase client đã được khởi tạo thành công!');
} else {
  console.warn('⚠️ Supabase client chưa được cấu hình. Vui lòng kiểm tra file .env.local');
}

