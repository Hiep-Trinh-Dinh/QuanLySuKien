<template>
  <div class="ticket-page">

    <div v-if="!ticket" class="loading">
      Đang tải thông tin vé...
    </div>

    <div v-else ref="ticketRef">

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        Trang chủ / Vé của tôi / <span>{{ ticket.title }}</span>
      </div>

      <!-- Header -->
      <div class="header">
        <h1>{{ ticket.title }}</h1>
        <button class="download-btn" @click="downloadTicket">Tải vé</button>
      </div>

      <!-- Banner -->
      <div class="ticket-header">
        <img :src="ticket.image_url" class="header-img" />
        <div class="header-overlay"></div>
        <div class="header-text">
          <h2>{{ ticket.title }}</h2>
          <p>{{ formatDate(ticket.start_time) }}</p>
        </div>
      </div>

      <!-- Cards -->
      <div class="cards">
        <div class="card">
          <h3>Mã QR</h3>
          <div class="qr-box"><canvas ref="qrContainer"></canvas></div>
        </div>

        <div class="card">
          <h3>Thời gian & Địa điểm</h3>
          <p class="main">{{ formatDate(ticket.start_time) }}</p>
          <p class="sub">{{ ticket.venue_name }}, {{ ticket.venue_address }}</p>
        </div>

        <div class="card">
          <h3>Trạng thái vé</h3>
          <p :class="ticket.status === 'sold' ? 'status sold' : 'status pending' ">
            {{ ticket.status === 'sold' ? 'Đã mua' : 'Chưa xác nhận' }}
          </p>
        </div>
      </div>

      <!-- DESCRIPTIONS -->
      <section>
        <h2>Thông tin sự kiện</h2>
        <p class="description">{{ ticket.description }}</p>
      </section>

      <section>
        <h2>Thông tin vé</h2>
        <ul class="info-list">
          <li><TicketIcon class="icon"/> Loại vé: <b>{{ ticket.Type }}</b></li>
          <li><UsersIcon class="icon"/> Ghế: <b>{{ ticket.seat_number || "Không có" }}</b></li>
          <li><CreditCardIcon class="icon"/> Giá: <b>{{ ticket.price.toLocaleString("vi-VN") }} VND</b></li>
          <li><HashtagIcon class="icon"/> Mã vé: <b>{{ ticket.ticket_id }}</b></li>
        </ul>
      </section>

      <section>
        <h2>Thông tin quan trọng</h2>
        <ul class="important">
          <li><ClockIcon class="icon"/><div><b>Mở cửa</b><p>{{ formatDate(ticket.start_time) }}</p></div></li>
          <li><BriefcaseIcon class="icon"/><div><b>Chính sách túi xách</b><p>Chỉ túi nhỏ (dưới 30×30 cm)</p></div></li>
          <li><TruckIcon class="icon"/><div><b>Bãi đỗ xe</b><p>Có sẵn tại địa điểm tổ chức</p></div></li>
        </ul>
      </section>

      <h2>Hành động</h2>
      <div class="actions">
        <div class="action-card"><ArrowRightOnRectangleIcon class="icon"/><h3>Chuyển vé</h3><button>Chuyển</button></div>
        <div class="action-card"><CalendarIcon class="icon"/><h3>Thêm vào lịch</h3><button>Thêm</button></div>
        <div class="action-card"><ChatBubbleLeftRightIcon class="icon"/><h3>Liên hệ hỗ trợ</h3><button>Liên hệ</button></div>
      </div>

    </div>

    <!-- Toast -->
    <div ref="toast" class="toast">🎉 Tải vé thành công!</div>

  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

import {
  TicketIcon, UsersIcon, CreditCardIcon, HashtagIcon,
  ClockIcon, BriefcaseIcon, TruckIcon,
  ArrowRightOnRectangleIcon, CalendarIcon, ChatBubbleLeftRightIcon
} from "@heroicons/vue/24/outline";

const route = useRoute();
const ticket = ref(null);
const ticketRef = ref(null);
const qrContainer = ref(null);
const toast = ref(null);

const formatDate = (d) => new Date(d).toLocaleString("vi-VN", { hour:"2-digit", minute:"2-digit", day:"2-digit", month:"2-digit", year:"numeric" });

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/ticket-detail", { params: { ticket_id: route.params.id }});
  ticket.value = res.data;
});

watch(ticket, async (t) => {
  if (t && qrContainer.value) QRCode.toCanvas(qrContainer.value, t.qr_code || t.ticket_id, { width: 120 });
});

const downloadTicket = async () => {
  const canvas = await html2canvas(ticketRef.value, { scale: 2 });
  const pdf = new jsPDF("p","mm","a4");
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
  pdf.save(`Ve_${ticket.value.title}.pdf`);
  toast.value.classList.add("show");
  setTimeout(() => toast.value.classList.remove("show"), 2500);
};
</script>
