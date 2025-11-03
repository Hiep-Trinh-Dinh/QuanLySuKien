<template>
  <div class="ticket-page">
    
    <!-- Trạng thái tải -->
    <div v-if="!ticket" class="loading">
      Đang tải thông tin vé...
    </div>

    <!-- Nội dung chính -->
    <div v-else ref="ticketRef">
      
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span>Trang chủ</span> &gt;
        <span>Vé của tôi</span> &gt;
        <span>{{ ticket.title }}</span>
      </div>

      <!-- Header -->
      <div class="header">
        <h1>{{ ticket.title }}</h1>
        <button class="download-btn" @click="downloadTicket">Tải vé</button>
      </div>

      <!-- Banner sự kiện -->
      <div class="ticket-header">
        <img :src="ticket.image_url" class="header-img" />
        <div class="header-overlay"></div>
        <div class="header-text">
          <h2>{{ ticket.title }}</h2>
          <p>{{ formatDate(ticket.start_time) }}</p>
        </div>
      </div>

      <!-- Thông tin -->
      <div class="cards">
        <div class="card">
          <h3>Mã QR</h3>
          <div class="qr-box" style="display: flex; justify-content: center;">
            <img v-if="ticket && ticket.qr_code && ticket.qr_code.startsWith('data:image')" :src="ticket.qr_code" alt="QR code" style="width:150px;"/>
            <canvas v-else ref="qrContainer"></canvas>
          </div>
        </div>

        <div class="card">
          <h3>Thời gian & Địa điểm</h3>
          <p>{{ formatDate(ticket.start_time) }}</p>
          <p>{{ ticket.venue_name }}, {{ ticket.venue_address }}</p>
        </div>

        <div class="card">
          <h3>Trạng thái vé</h3>
          <p v-if="ticket.ticket_status === 'sold'" class="status sold">Đã mua</p>
          <p v-else-if="ticket.ticket_status === 'pending'" class="status pending">Chờ xác nhận</p>
          <p v-else class="status unknown">Không rõ</p>

        </div>
      </div>

      <!-- Chi tiết -->
      <h2>Thông tin sự kiện</h2>
      <p>{{ ticket.description }}</p>

      <h2>Thông tin vé</h2>
      <ul class="info-list">
        <li><TicketIcon class="icon"/> Loại vé: {{ ticket.Type }}</li>
        <li><UsersIcon class="icon"/> Ghế: {{ ticket.seat_number || "Không có" }}</li>
        <li><CreditCardIcon class="icon"/> Giá: {{ ticket.price.toLocaleString("vi-VN") }} VND</li>
        <li><HashtagIcon class="icon"/> Mã vé: {{ ticket.ticket_id }}</li>
      </ul>

      <h2>Thông tin quan trọng</h2>

<ul class="important">
  <li>
    <ClockIcon class="icon"/>
    <div>
      <b>Giờ mở cửa</b>
      <p>{{ formatDate(ticket.start_time) }}</p>
    </div>
  </li>

  <!-- ✅ Nghệ sĩ biểu diễn -->
  <li>
  <UsersIcon class="icon"/>
  <div>
    <b>Nghệ sĩ tham gia</b>
    <p>{{ ticket.artists?.join(", ") || "Đang cập nhật" }}</p>
  </div>
</li>


</ul>


      <h2>Hành động</h2>
      <div class="actions">


        <div class="action-card">
          <CalendarIcon class="icon"/>
          <h3>Thêm vào lịch</h3>
          <button @click="addToGoogleCalendar" class="secondary">Thêm vào Google Calendar</button>
        </div>


      <div class="action-card">
        <ChatBubbleLeftRightIcon class="icon"/>
        <h3>Liên hệ hỗ trợ</h3>
        <button @click="goSupport">Chuyển đến trang hỗ trợ</button>
      </div>

      </div>

    </div>

    <!-- ✅ Toast để ngoài -->
    <div ref="toast" class="toast">Đã tải vé thành công 🎉</div>

  </div>
  
</template>


<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
const router = useRouter();

import {
  TicketIcon, UsersIcon, CreditCardIcon, HashtagIcon,
  ClockIcon, BriefcaseIcon, TruckIcon,
  ArrowRightOnRectangleIcon, CalendarIcon, ChatBubbleLeftRightIcon
} from "@heroicons/vue/24/outline";

import "../assets/css/TicketInformation.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const route = useRoute();
const ticket = ref(null);

const ticketRef = ref(null);
const qrContainer = ref(null);
const toast = ref(null);

const formatDate = (d) =>
  new Date(d).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/ticket-detail", {
    params: { ticket_id: route.params.id }
  });
  ticket.value = res.data;
});

watch(ticket, async (val) => {
  if (val && qrContainer.value && (!val.qr_code || !val.qr_code.startsWith('data:image'))) {
    qrContainer.value.innerHTML = "";
    await QRCode.toCanvas(qrContainer.value, val.qr_code || val.ticket_id, { width: 120 });
  }
});

const downloadTicket = async () => {
  if (!ticketRef.value) return;
  const canvas = await html2canvas(ticketRef.value, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const imgHeight = (canvas.height * 210) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, 210, imgHeight);
  pdf.save(`Ve_${ticket.value.title}.pdf`);

  showToast();
};
// Chuyển sang trang hỗ trợ
const goSupport = () => {
  router.push({
    name: "CustomerSupport",
    query: { event_id: ticket.value.event_id }  // ✅ TRUYỀN EVENT_ID
  });
};


// Xuất file lịch .ics (offline, thêm được vào mọi ứng dụng lịch)
const addToCalendarFile = () => {
  if (!ticket.value) return;

  const start = new Date(ticket.value.start_time).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(new Date(ticket.value.start_time).getTime() + 2 * 60 * 60 * 1000) // +2h
    .toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${ticket.value.title}
DTSTART:${start}
DTEND:${end}
LOCATION:${ticket.value.venue_name}
DESCRIPTION:${ticket.value.description || ""}
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Ve_${ticket.value.ticket_id}.ics`;
  link.click();
};

// Thêm vào Google Calendar trực tuyến
const addToGoogleCalendar = () => {
  if (!ticket.value) return;

  const start = new Date(ticket.value.start_time).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(new Date(ticket.value.start_time).getTime() + 2 * 60 * 60 * 1000)
    .toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ticket.value.title)}&dates=${start}%2F${end}&details=${encodeURIComponent(ticket.value.description || "")}&location=${encodeURIComponent(ticket.value.venue_name)}`;

  window.open(url, "_blank");
};

function showToast() {
  toast.value.classList.add("show");
  setTimeout(() => toast.value.classList.remove("show"), 2500);
}
</script>
