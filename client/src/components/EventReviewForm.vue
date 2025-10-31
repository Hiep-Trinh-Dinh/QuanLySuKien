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

      <!-- Modal thông báo -->
      <div v-if="showDialog" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-title">{{ dialogTitle }}</div>
          <div class="modal-body">{{ dialogMessage }}</div>
          <div class="modal-actions">
            <button class="modal-btn" @click="closeDialog">Đóng</button>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { useEventReview } from "../scripts/EventReview.js";

const {
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
} = useEventReview();
</script>
  
<style src="../assets/css/event-review.css"></style>