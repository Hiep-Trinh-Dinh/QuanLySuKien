<template>
    <div class="event-review-bg">
      <div class="event-review-container">
        <h1 class="event-review-title">Đánh Giá Sự Kiện</h1>
        <div class="event-review-box">
          <h2>Chi tiết sự kiện</h2>
          <div class="event-info">
            <div><b>Tên sự kiện:</b> Summer Music Festival</div>
            <div><b>Mô tả:</b> Hội thảo bàn luận về sự phát triển vượt trội của công nghệ AI</div>
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
import { eventReview } from "../scripts/EventReview.js";

const rating = ref(0);
const name = ref("");
const email = ref("");
const phone = ref("");
const comment = ref("");
const user = ref(null);
const isLoggedIn = ref(false);

onMounted(() => {
  const raw = localStorage.getItem("user");
  user.value = raw ? JSON.parse(raw) : null;
  isLoggedIn.value = !!user.value;
  if (user.value) {
    email.value = user.value.email || "";
    name.value = user.value.username || "";
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
  // Giả sử eventId được lấy qua props
  const eventId = 1;
  const result = await eventReview(
    eventId,
    user.value.id,
    rating.value,
    name.value,
    email.value,
    phone.value,
    comment.value
  );
  if (result) {
    alert("Đã gửi đánh giá!");
    // Reset form nếu muốn
  }
}
</script>
  
<style src="../assets/css/event-review.css"></style>