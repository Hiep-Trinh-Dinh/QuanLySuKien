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
          <form @submit.prevent="handleSubmit">
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
              <input type="text" v-model="name" required />
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input type="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label>Số điện thoại:</label>
              <input type="text" v-model="phone" required />
            </div>
            <div class="form-group">
              <label>Nhận xét (Nếu có):</label>
              <textarea v-model="comment" rows="2"></textarea>
            </div>
            <button type="submit" class="submit-btn">Gửi</button>
          </form>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref } from "vue";

const rating = ref(0);
const name = ref("");
const email = ref("");
const phone = ref("");
const comment = ref("");

function setRating(star) {
  rating.value = star;
}

function handleSubmit() {
  // Xử lý gửi form ở đây
  alert("Đã gửi đánh giá!");
}
</script>
  
<style src="../assets/css/event-review.css"></style>