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

      <!-- ✅ Ticket List có scroll -->
      <div class="ticket-list">
        <TicketCard
          v-for="ticket in filteredTickets"
          :key="ticket.ticket_id"
          :ticket="ticket"
          @select="selectTicket"

        />
      </div>

      <!-- Chi tiết vé -->
<div v-if="selectedTicket" class="ticket-details-wrapper">

        <!-- Cột trái: Thông tin vé -->
        <div class="ticket-details">
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
            <button>Tải vé</button>
            <button>Thêm vào lịch</button>
            <button @click="$router.push('/support')">Liên hệ hỗ trợ</button>
          </div>
        </div>

        <!-- ✅ Cột phải: Mã QR -->
        <div class="ticket-qr-box">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=TICKET-${selectedTicket.ticket_id}`"
            alt="QR Code"
            class="qr-image"
          />
          <p class="qr-label">Quét mã QR khi vào cổng</p>
        </div>

      </div>


    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import TicketCard from "../components/TicketCard.vue";
import "../assets/css/tickets.css";

const activeTab = ref("upcoming");
const searchQuery = ref("");
const selectedTicket = ref(null);
const tickets = ref([]);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?.id;

// Fetch Tickets
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/user-tickets", {
      params: { user_id: userId }
    });
    tickets.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy vé:", error);
  }
});

// Switch Tab
const changeTab = (tab) => {
  activeTab.value = tab;
  selectedTicket.value = null;
};

// Format
const formatPrice = (p) => p?.toLocaleString("vi-VN") + " VND";
const formatDate = (d) => new Date(d).toLocaleString("vi-VN");
const formattedLocation = (t) =>
  `${t.venue_name}${t.venue_address ? ", " + t.venue_address : ""}`;

// Filter Tickets
const filteredTickets = computed(() => {
  const now = new Date();
  return tickets.value.filter((t) => {
    const start = new Date(t.start_time);
    const end = new Date(t.end_time);

    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      formatDate(t.start_time).includes(searchQuery.value);

    if (!matchSearch) return false;

    if (activeTab.value === "upcoming") return start > now && t.status !== "canceled";
    if (activeTab.value === "past") return end < now && t.status !== "canceled";
    if (activeTab.value === "canceled") return t.status === "canceled";

    return true;
  });
});

// Select Ticket
const selectTicket = (ticket) => {
  selectedTicket.value = ticket;
};
</script>

<style scoped>
.ticket-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 12px;
  padding-right: 6px;
}
.ticket-list::-webkit-scrollbar {
  width: 6px;
}
.ticket-list::-webkit-scrollbar-thumb {
  background: #c9c8ff;
  border-radius: 6px;
}
.ticket-details-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 18px;
  gap: 18px;
}

.ticket-details {
  flex: 1;
  background: white;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0,0,0,0.08);
}

.ticket-qr-box {
  width: 200px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 8px rgba(0,0,0,0.08);
  text-align: center;
}

.qr-image {
  width: 170px;
  height: 170px;
  border-radius: 8px;
}

.qr-label {
  margin-top: 10px;
  font-size: 14px;
  color: #444;
}

</style>
