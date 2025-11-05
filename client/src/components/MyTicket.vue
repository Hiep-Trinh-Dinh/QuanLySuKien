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
          <canvas ref="qrCanvas" class="qr-image" width="170" height="170"></canvas>
          <p class="qr-label">Quét mã QR khi vào cổng</p>
        </div>
      </div>

      <div v-else class="no-ticket-selected">Chọn 1 vé để xem chi tiết và tải vé / thêm lịch</div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import TicketCard from "../components/TicketCard.vue";
import "../assets/css/tickets.css";
import { nextTick } from "vue";

const activeTab = ref("upcoming");
const searchQuery = ref("");
const selectedTicket = ref(null);
const tickets = ref([]);
const ticketWrapper = ref(null);
const qrCanvas = ref(null);

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

const selectTicket = (ticket) => {
  selectedTicket.value = ticket;

  console.log(">>> SELECTED TICKET RAW:", JSON.parse(JSON.stringify(ticket)));
};



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


watch(selectedTicket, async (t) => {
  if (!t) return;

  await nextTick(); // ⬅ đảm bảo canvas xuất hiện trên DOM rồi mới vẽ

  const canvas = qrCanvas.value;
  const ctx = canvas.getContext("2d");

  // Đặt kích thước chính xác mỗi lần vẽ
  canvas.width = 170;
  canvas.height = 170;
  ctx.clearRect(0, 0, 170, 170);

  const qrValue =
    t.qr_code && t.qr_code.startsWith("data:image")
      ? t.qr_code
      : `TICKET-${t.ticket_id}`;

  // ✅ Nếu là base64 thì load ảnh rồi vẽ
  if (qrValue.startsWith("data:image")) {
    const img = new Image();
    img.src = qrValue;
    img.onload = () => ctx.drawImage(img, 0, 0, 170, 170);
  } 
  // ✅ Nếu chỉ là text → tạo QR bằng qrcode
  else {
    QRCode.toCanvas(canvas, qrValue, { width: 170 });
  }
});
// PDF Export giữ nguyên

const downloadTicketPDF = async () => {
  if (!ticketWrapper.value) return;

  // đảm bảo QR đã vẽ xong trước khi chụp
  await nextTick();

  // tạo bản sao nguyên ticket
  const clone = ticketWrapper.value.cloneNode(true);

  // giữ lại canvas QR
  const originalCanvas = qrCanvas.value;
  const cloneCanvas = clone.querySelector("canvas");
  if (originalCanvas && cloneCanvas) {
    const ctx = cloneCanvas.getContext("2d");
    cloneCanvas.width = originalCanvas.width;
    cloneCanvas.height = originalCanvas.height;
    ctx.drawImage(originalCanvas, 0, 0);
  }

  // xoá các nút
  clone.querySelectorAll(".ticket-buttons, .close-ticket-btn").forEach(el => el.remove());

  // cho clone ra ngoài màn hình để chụp
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.appendChild(clone);
  document.body.appendChild(container);

  const canvas = await html2canvas(clone, { scale: 3, useCORS: true });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, width, height);
  pdf.save(`Ve_${selectedTicket.value.title}.pdf`);

  container.remove();
};


const goSupport = () => {
  window.location.href = `/support?event_id=${selectedTicket.value.event_id}`;
};

const toGoogleDateTimeISO = (dt) => new Date(dt).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

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
.qr-box canvas { margin-top: 6px; }

.ticket-qr-box {
  flex: 0 0 210px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 8px rgba(0,0,0,0.08);
  text-align: center;
}

.qr-image {
  width: 170px !important;
  height: 170px !important;
  display: block;
  margin: auto;
}

.ticket-qr { 
  margin-top: 16px; 
  display: flex; 
  justify-content: center;
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
