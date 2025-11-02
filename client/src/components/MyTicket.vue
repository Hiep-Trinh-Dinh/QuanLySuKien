<template>
  <div class="tickets-page">
    <main class="tickets-content">
      <h2>Vé của tôi</h2>

      <!-- Tabs -->
      <div class="ticket-tabs">
        <button :class="{ active: activeTab==='upcoming' }" @click="changeTab('upcoming')">Sắp diễn ra</button>
        <button :class="{ active: activeTab==='past' }" @click="changeTab('past')">Lịch sử</button>
        <button :class="{ active: activeTab==='canceled' }" @click="changeTab('canceled')">Đã hủy</button>
      </div>

      <!-- Search -->
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm vé theo tên hoặc ngày" class="ticket-search" />

      <!-- Ticket List -->
      <div class="ticket-list">
        <TicketCard
          v-for="ticket in filteredTickets"
          :key="ticket.ticket_id"
          :ticket="ticket"
          @select="selectTicket"
        />
      </div>

      <!-- Chi tiết vé -->
      <div
        v-if="selectedTicket"
        class="ticket-details-wrapper"
        ref="ticketWrapper"
      >

        <!-- LEFT -->
        <div class="ticket-details">
          <button class="close-ticket-btn" @click="selectedTicket = null">✕</button>

          <h3>Chi tiết vé</h3>
          <ul>
            <li><b>Sự kiện:</b> {{ selectedTicket.title }}</li>
            <li><b>Địa điểm:</b> {{ formattedLocation(selectedTicket) }}</li>
            <li><b>Thời gian:</b> {{ formatDate(selectedTicket.start_time) }}</li>
            <li><b>Loại vé:</b> {{ selectedTicket.Type }}</li>
            <li><b>Giá:</b> {{ formatPrice(selectedTicket.price) }}</li>
            <li><b>Trạng thái:</b> {{ selectedTicket.status }}</li>
            <li><b>Số ghế:</b> {{ selectedTicket.seat_number || "Không có" }}</li>
          </ul>

          <div class="ticket-buttons">
            <button @click="downloadTicketPDF">Tải vé</button>
            <button @click="addToGoogleCalendar">Thêm vào lịch</button>
            <button @click="goSupport">Liên hệ hỗ trợ</button>
            <button class="btn-close-ticket" @click="selectedTicket = null">Đóng</button>
          </div>
        </div>

        <!-- RIGHT: QR -->
        <div class="ticket-qr-box">
          <img :src="qrUrl(selectedTicket)" class="qr-image" />
          <p class="qr-label">Quét mã QR khi vào cổng</p>
        </div>
      </div>

      <div v-else class="no-ticket-selected">Chọn 1 vé để xem chi tiết và tải vé / thêm lịch</div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TicketCard from "../components/TicketCard.vue";
import "../assets/css/tickets.css";

const activeTab = ref("upcoming");
const searchQuery = ref("");
const selectedTicket = ref(null);
const tickets = ref([]);

const ticketWrapper = ref(null);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?.id;

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/user-tickets", {
      params: { user_id: userId }
    });
    tickets.value = res.data;
  } catch (e) { console.error(e); }
});

const changeTab = (tab) => { activeTab.value = tab; selectedTicket.value = null; };

const formatPrice = (p) => p?.toLocaleString("vi-VN") + " VND";
const formatDate = (d) => new Date(d).toLocaleString("vi-VN");
const formattedLocation = (t) =>
  `${t.venue_name}${t.venue_address ? ", " + t.venue_address : ""}`;

const filteredTickets = computed(() => {
  const now = new Date();
  return tickets.value.filter((t) => {
    if (!t) return false;
    const start = new Date(t.start_time);
    const end = new Date(t.end_time || t.start_time);
    const matchSearch =
      (t.title || "").toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      formatDate(t.start_time).includes(searchQuery.value);

    if (!matchSearch) return false;
    if (activeTab.value === "upcoming") return start > now && t.status !== "canceled";
    if (activeTab.value === "past") return end < now && t.status !== "canceled";
    if (activeTab.value === "canceled") return t.status === "canceled";
    return true;
  });
});

const selectTicket = (ticket) => { selectedTicket.value = ticket; };

const qrUrl = (t) => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-${t.ticket_id}`;

const downloadTicketPDF = async () => {
  if (!ticketWrapper.value) return;

  // Clone node để xuất PDF, không ảnh hưởng UI
  const clone = ticketWrapper.value.cloneNode(true);

  // Xóa các nút không muốn in
  clone.querySelectorAll(".ticket-buttons, .close-ticket-btn").forEach(el => el.remove());

  // Tạo vùng render ẩn
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.appendChild(clone);
  document.body.appendChild(container);

  // Chụp với độ nét cao
  const canvas = await html2canvas(clone, { scale: 3, useCORS: true });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, width, height);
  pdf.save(`Ve_${selectedTicket.value.ticket_id}.pdf`);

  container.remove();
};


const goSupport = () => {
  window.location.href = `/support?event_id=${selectedTicket.value.event_id}`;
};

const toGoogleDateTimeISO = (dt) =>
  new Date(dt).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const addToGoogleCalendar = () => {
  const t = selectedTicket.value;
  const start = toGoogleDateTimeISO(t.start_time);
  const end = t.end_time ? toGoogleDateTimeISO(t.end_time)
    : toGoogleDateTimeISO(new Date(new Date(t.start_time).getTime() + 2 * 3600 * 1000));

  const url =
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.title)}&dates=${start}%2F${end}&location=${encodeURIComponent(formattedLocation(t))}`;
  window.open(url, "_blank");
};
</script>

<style scoped>
.ticket-details-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  flex-wrap: nowrap;
}

.ticket-qr-box {
  flex: 0 0 210px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 8px rgba(0,0,0,0.08);
  text-align: center;
}

.qr-image {
  width: 170px;
  height: 170px;
  object-fit: contain;
}

.close-ticket-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #eee;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
}
.btn-close-ticket {
  background: #f3f3f3 !important;
  color: #222;
  border: 1px solid #ccc;
}

.btn-close-ticket:hover {
  background: #e6e6e6;
}

</style>
