<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";

import {
  QrCodeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  TicketIcon,
  UsersIcon,
  CreditCardIcon,
  HashtagIcon,
  ClockIcon,
  BriefcaseIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/vue/24/outline";

import "../assets/css/TicketInformation.css";

const route = useRoute();
const ticket = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/ticket-detail`, {
      params: { ticket_id: route.params.id }
    });
    ticket.value = res.data; // trả đúng 1 vé
  } catch (err) {
    console.error("Lỗi lấy chi tiết vé:", err);
  }
});
</script>

<template>
  <div class="ticket-page" v-if="ticket">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span>Trang chủ</span> &gt; <span>Vé của tôi</span> &gt; <span>{{ ticket.title }}</span>
    </div>

    <!-- Header -->
    <div class="header">
      <h1>{{ ticket.title }}</h1>
      <button class="download-btn">Tải vé</button>
    </div>

    <!-- Top cards -->
    <div class="cards">
      <div class="card">
        <QrCodeIcon class="icon"/>
        <h3>Mã QR</h3>
        <p>{{ ticket.qr_code }}</p>
      </div>

      <div class="card">
        <CalendarDaysIcon class="icon"/>
        <h3>Thời gian sự kiện</h3>
        <p>{{ new Date(ticket.start_time).toLocaleString("vi-VN") }}</p>
        <p>{{ ticket.venue_name }}</p>
      </div>

      <div class="card">
        <CheckCircleIcon class="icon"/>
        <h3>Trạng thái</h3>
        <p>{{ ticket.status }}</p>
      </div>
    </div>

    <!-- Event Information -->
    <h2>Thông tin sự kiện</h2>
    <p>
      {{ ticket.title }} là {{ ticket.description }}
      Trải nghiệm những màn trình diễn tuyệt vời, cùng các gian hàng ẩm thực, nghệ thuật và nhiều hơn nữa.
    </p>
    
    <h2>Thông tin vé</h2>
    <ul class="info-list">
      <li><TicketIcon class="icon"/> Loại vé: {{ ticket.Type }}</li>
      <li><UsersIcon class="icon"/> Ghế: {{ ticket.seat_number || "Không có" }}</li>
      <li><CreditCardIcon class="icon"/> Giá: {{ ticket.price.toLocaleString("vi-VN") }} VND</li>
      <li><HashtagIcon class="icon"/> Mã: {{ ticket.ticket_id }}</li>
    </ul>

    <h2>Hành động</h2>
    <div class="actions">
      <div class="action-card">
        <ArrowRightOnRectangleIcon class="icon"/>
        <h3>Chuyển vé</h3>
        <button>Chuyển</button>
      </div>

      <div class="action-card">
        <CalendarIcon class="icon"/>
        <h3>Thêm vào lịch</h3>
        <button>Thêm</button>
      </div>

      <div class="action-card">
        <ChatBubbleLeftRightIcon class="icon"/>
        <h3>Liên hệ hỗ trợ</h3>
        <button>Liên hệ</button>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    Đang tải thông tin vé...
  </div>
</template>
