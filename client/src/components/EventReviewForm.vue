<template>
    <div class="event-review-bg">
      <div class="event-review-container">
        <h1 class="event-review-title">Đánh Giá Sự Kiện</h1>
        <div class="event-review-box">
          <h2>Chi tiết sự kiện</h2>
        <div class="event-info" v-if="eventInfo">
          <div><b>Tên sự kiện:</b> {{ eventInfo.title }}</div>
          <div><b>Mô tả:</b> {{ eventInfo.description }}</div>
        </div>
        <div class="event-info" v-else>
          <div>Đang tải thông tin sự kiện...</div>
        </div>
          <form v-if="isLoggedIn" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Đánh giá (1-5 sao):</label>
              <div class="star-rating">
                <span
                  v-for="star in 5" :key="star"
                  class="star"
                  :class="{ filled: star <= rating }"
                  @click="setRating(star)"
                  >&#9733;</span>
              </div>
            </div>
            <div class="form-group">
              <label>Họ tên:</label>
              <input type="text" v-model="name" required class="eventreview-input" />
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input type="email" v-model="email" required class="eventreview-input" />
            </div>
            <div class="form-group">
              <label>Số điện thoại:</label>
              <input type="text" v-model="phone" required class="eventreview-input" />
            </div>
            <div class="form-group">
              <label>Nhận xét (Nếu có):</label>
              <textarea v-model="comment" rows="2" class="eventreview-textarea"></textarea>
            </div>
            <button type="submit" class="submit-btn eventreview-btn">Gửi</button>
          </form>
          <div v-else class="eventreview-login-prompt">
            Bạn cần <router-link to="/login">đăng nhập</router-link> để gửi đánh giá.
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { eventReview } from "../scripts/EventReview.js";

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
    alert("Bạn cần đăng nhập để gửi đánh giá!");
    return;
  }
  
  if (rating.value === 0) {
    alert("Vui lòng chọn số sao đánh giá!");
    return;
  }
  
  
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
    alert("Đã gửi đánh giá thành công!");
    // Redirect về trang chi tiết event
    router.push(`/event-detail/${eventId.value}`);
  } else {
    alert("Có lỗi xảy ra khi gửi đánh giá!");
  }
}
</script>
  
<style src="../assets/css/event-review.css"></style>