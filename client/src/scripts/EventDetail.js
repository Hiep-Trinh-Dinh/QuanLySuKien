import axios from "axios";

// Hàm lấy 3 event khác cùng category, loại bỏ event hiện tại
export const getSimilarEvents = async (categoryId, eventId) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/events/category/${categoryId}/exclude/${eventId}`
    );

    // res.data chứa mảng 3 event
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy sự kiện tương tự:", error);
    // Tùy nhu cầu: trả về mảng rỗng nếu lỗi
    return [];
  }
};
