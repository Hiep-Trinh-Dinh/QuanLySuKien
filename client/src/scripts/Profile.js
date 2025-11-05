import axios from "axios";

const API_URL = "http://localhost:3000"; // phù hợp với server/index.js

export async function getUser(userId) {
  try {
    const res = await axios.get(`${API_URL}/user-profile`, {
      params: { user_id: userId },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
    throw error;
  }
}

// Chuẩn hoá payload trước khi gọi API update-profile
function buildUpdatePayload(userId, data = {}) {
  const payload = { user_id: userId };

  if (data.username !== undefined) payload.username = data.username;
  if (data.full_name !== undefined) payload.full_name = data.full_name;
  if (data.phone !== undefined) payload.phone = data.phone;

  // server hiện chờ trường avatar_data (có thể là data URL hoặc public URL)
  if (data.avatar_data !== undefined) {
    payload.avatar_data = data.avatar_data;
  } else if (data.avatarUrl !== undefined) {
    payload.avatar_data = data.avatarUrl;
  } else if (data.avatar_url !== undefined) {
    payload.avatar_data = data.avatar_url;
  }

  // include password if provided (client will only set this when user wants to change password)
  if (data.password !== undefined && data.password !== null && data.password !== '') {
    // server expects field named 'password' for updates
    payload.password = data.password;
  } else if (data.new_password !== undefined && data.new_password !== null && data.new_password !== '') {
    payload.password = data.new_password;
  }

  return payload;
}

// Cập nhật thông tin hồ sơ (PUT /update-profile body: { user_id, ... })
// Nếu muốn cập nhật avatar gửi avatar_data (data URL) hoặc public URL trong trường avatar_data
export async function updateUser(userId, data) {
  try {

    const payload = buildUpdatePayload(userId, data);
    console.log("Payload gửi lên update-profile:", payload);
    const res = await axios.put(`${API_URL}/update-profile`, payload);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    throw error;
  }
}

// Helper: convert File/Blob sang data URL (base64)
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// Upload avatar: chấp nhận
// - một String (public URL) => gửi trực tiếp trong avatar_data
// - một File/Blob (từ <input type="file">) => chuyển sang data URL và gửi
export async function uploadAvatar(userId, avatar) {
  try {
 
    // xử lý File/Blob từ input
    if (avatar instanceof Blob || avatar instanceof File) {
      const dataUrl = await fileToDataUrl(avatar);
      console.log("Data URL của avatar:", dataUrl);
      return await updateUser(userId, { avatar_data: dataUrl });
    }

    throw new Error("uploadAvatar nhận File/Blob hoặc URL string.");
  } catch (error) {
    console.error("Lỗi khi upload/update avatar:", error);
    throw error;
  }
}