import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export async function eventReview(event_id, user_id, rating, name, email, phone, comment) {
  try {
    const requestData = { event_id, user_id, rating, name, email, phone, content: comment };
    const res = await axios.post('http://localhost:3000/event-review', requestData);
    return res.data;
  } catch (err) {
    if (err?.response?.data?.message && err.response.data.message.includes('Duplicate entry')) {
      throw new Error('duplicate');
    }
    return null;
  }
}

export function useEventReview() {
  const route = useRoute();
  const router = useRouter();
  const eventId = ref(route.query.id || 1);
  const eventInfo = ref(null);
  const rating = ref(0);
  const name = ref("");
  const email = ref("");
  const phone = ref("");
  const comment = ref("");
  const user = ref(null);
  const isLoggedIn = ref(false);

  // Dialog state
  const showDialog = ref(false);
  const dialogTitle = ref("");
  const dialogMessage = ref("");
  function openDialog(title, message) {
    dialogTitle.value = title;
    dialogMessage.value = message;
    showDialog.value = true;
  }
  function closeDialog() {
    showDialog.value = false;
  }

  onMounted(async () => {
    const raw = localStorage.getItem("user");
    user.value = raw ? JSON.parse(raw) : null;
    isLoggedIn.value = !!user.value;
    if (user.value) {
      email.value = user.value.email || "";
      name.value = user.value.username || "";
    }

    // Fetch thông tin event để hiển thị
    try {
      const res = await fetch(`http://localhost:3000/events/${eventId.value}`);
      if (res.ok) {
        eventInfo.value = await res.json();
      }
    } catch (e) {
      console.error("Không thể tải thông tin sự kiện:", e);
    }
  });

  function setRating(star) {
    rating.value = star;
  }

  async function handleSubmit() {
    if (!isLoggedIn.value) {
      openDialog('Thông báo', 'Bạn cần đăng nhập để gửi đánh giá!');
      return;
    }
    if (rating.value === 0) {
      openDialog('Thông báo', 'Vui lòng chọn số sao đánh giá!');
      return;
    }
    try {
      const result = await eventReview(
        eventId.value,
        user.value.id,
        rating.value,
        name.value,
        email.value,
        phone.value,
        comment.value || ''
      );
      if (result) {
        openDialog('Đánh giá', 'Đã gửi đánh giá thành công!');
        // điều hướng sau một chút để user đóng dialog
        setTimeout(() => {
          closeDialog();
          router.push(`/event-detail/${eventId.value}`);
        }, 600);
      } else {
        openDialog('Đánh giá', 'Có lỗi xảy ra khi gửi đánh giá!');
      }
    } catch (err) {
      if (err.message === 'duplicate') {
        openDialog('Đánh giá', 'Bạn đã đánh giá sự kiện này.');
      } else {
        openDialog('Đánh giá', 'Có lỗi xảy ra khi gửi đánh giá!');
      }
    }
  }

  return {
    eventInfo,
    rating,
    name,
    email,
    phone,
    comment,
    isLoggedIn,
    setRating,
    handleSubmit,
    // dialog
    showDialog,
    dialogTitle,
    dialogMessage,
    closeDialog
  };
}
