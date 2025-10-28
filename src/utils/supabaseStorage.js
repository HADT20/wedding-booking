// Quản lý dữ liệu booking với Supabase
import { supabase } from '../lib/supabaseClient';

/**
 * Lấy tất cả bookings từ Supabase
 * @returns {Promise<Array>} Danh sách bookings
 */
export const getBookings = async () => {
  // Kiểm tra kết nối Supabase
  if (!supabase) {
    console.error('❌ Không có kết nối Supabase! Vui lòng kiểm tra file .env.local');
    throw new Error('Supabase connection not configured');
  }

  try {
    console.log('🔄 Đang tải bookings từ Supabase...');
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('shooting_date_time', { ascending: true });

    if (error) {
      console.error('❌ Lỗi khi lấy bookings:', error);
      throw error;
    }

    console.log(`✅ Đã tải ${data.length} bookings từ Supabase`);

    // Chuyển đổi tên cột từ snake_case sang camelCase
    return data.map(booking => ({
      id: booking.id,
      customerName: booking.customer_name,
      phone: booking.phone,
      address: booking.address,
      shootingDateTime: booking.shooting_date_time,
      price: parseFloat(booking.price) || 0,
      deposit: parseFloat(booking.deposit) || 0,
      notes: booking.notes || '',
      isCompleted: booking.is_completed || false,
      isFullyPaid: booking.is_fully_paid || false,
      createdAt: booking.created_at,
    }));
  } catch (error) {
    console.error('❌ Lỗi không mong đợi:', error);
    throw error;
  }
};

/**
 * Thêm booking mới vào Supabase
 * @param {Object} booking - Dữ liệu booking
 * @returns {Promise<Object|null>} Booking mới được tạo
 */
export const addBooking = async (booking) => {
  // Kiểm tra kết nối Supabase
  if (!supabase) {
    console.error('❌ Không có kết nối Supabase!');
    throw new Error('Supabase connection not configured');
  }

  try {
    console.log('➕ Đang thêm booking vào Supabase...');
    // Chuyển đổi từ camelCase sang snake_case cho database
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_name: booking.customerName,
          phone: booking.phone,
          address: booking.address,
          shooting_date_time: booking.shootingDateTime,
          price: booking.price || 0,
          deposit: booking.deposit || 0,
          notes: booking.notes || '',
          is_completed: false,
          is_fully_paid: false,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Lỗi khi thêm booking:', error);
      throw error;
    }

    console.log('✅ Đã thêm booking:', data.id);

    // Chuyển đổi lại sang camelCase
    return {
      id: data.id,
      customerName: data.customer_name,
      phone: data.phone,
      address: data.address,
      shootingDateTime: data.shooting_date_time,
      price: parseFloat(data.price) || 0,
      deposit: parseFloat(data.deposit) || 0,
      notes: data.notes || '',
      isCompleted: data.is_completed || false,
      isFullyPaid: data.is_fully_paid || false,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('❌ Lỗi không mong đợi:', error);
    throw error;
  }
};

/**
 * Cập nhật booking trong Supabase
 * @param {string} id - ID của booking
 * @param {Object} updatedData - Dữ liệu cần cập nhật
 * @returns {Promise<Object|null>} Booking đã được cập nhật
 */
export const updateBooking = async (id, updatedData) => {
  try {
    // Chuyển đổi từ camelCase sang snake_case
    const updatePayload = {};

    if (updatedData.customerName !== undefined) updatePayload.customer_name = updatedData.customerName;
    if (updatedData.phone !== undefined) updatePayload.phone = updatedData.phone;
    if (updatedData.address !== undefined) updatePayload.address = updatedData.address;
    if (updatedData.shootingDateTime !== undefined) updatePayload.shooting_date_time = updatedData.shootingDateTime;
    if (updatedData.price !== undefined) updatePayload.price = updatedData.price;
    if (updatedData.deposit !== undefined) updatePayload.deposit = updatedData.deposit;
    if (updatedData.notes !== undefined) updatePayload.notes = updatedData.notes;
    if (updatedData.isCompleted !== undefined) updatePayload.is_completed = updatedData.isCompleted;
    if (updatedData.isFullyPaid !== undefined) updatePayload.is_fully_paid = updatedData.isFullyPaid;

    const { data, error } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Lỗi khi cập nhật booking:', error);
      return null;
    }

    // Chuyển đổi lại sang camelCase
    return {
      id: data.id,
      customerName: data.customer_name,
      phone: data.phone,
      address: data.address,
      shootingDateTime: data.shooting_date_time,
      price: parseFloat(data.price) || 0,
      deposit: parseFloat(data.deposit) || 0,
      notes: data.notes || '',
      isCompleted: data.is_completed || false,
      isFullyPaid: data.is_fully_paid || false,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('❌ Lỗi không mong đợi:', error);
    return null;
  }
};

/**
 * Xóa booking khỏi Supabase
 * @param {string} id - ID của booking
 * @returns {Promise<boolean>} True nếu xóa thành công
 */
export const deleteBooking = async (id) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Lỗi khi xóa booking:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Lỗi không mong đợi:', error);
    return false;
  }
};

