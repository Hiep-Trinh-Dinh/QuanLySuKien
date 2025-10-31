<template>
  <div class="ticket-card" @click="emit('select', ticket)">
    <div class="ticket-img" :style="{ backgroundImage: `url(${ticket.image_url})` }"></div>

    <div class="ticket-info">
      <div class="ticket-date">
        {{ formatDate(ticket.start_time) }}
      </div>

      <h3 class="ticket-title">{{ ticket.title }}</h3>

      <p class="ticket-sub">
        {{ ticket.venue_name }} • {{ ticket.ticket_count || 1 }} vé
      </p>

      <div class="ticket-actions">
        <!-- Gọi event để hiển thị panel chi tiết ngay trong MyTicket.vue -->
        <button class="btn primary" @click.stop="emit('select', ticket)">Xem vé</button>

        <!-- Chuyển sang trang chi tiết -->
        <button class="btn secondary" @click.stop="goDetail">Thông tin vé</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  ticket: Object,
});
const emit = defineEmits(["select"]); // <- thêm emit select

const router = useRouter();
const goDetail = () => {
  router.push({ name: "TicketInformation", params: { id: props.ticket.id } });

};

const formatDate = (d) =>
  new Date(d).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
</script>


<style scoped>
.ticket-card {
  position: relative;
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  border-radius: 18px;
  overflow: hidden;
  background: #f5f5ff;
  padding: 18px;
  cursor: pointer;
  transition: 0.25s;
}

.ticket-card:hover {
  transform: translateY(-4px);
}

.ticket-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.32;
}

.ticket-info {
  position: relative;
  z-index: 2;
  width: 70%;
  display: flex;
  flex-direction: column;
}

.ticket-date {
  font-size: 14px;
  color: #444;
  margin-bottom: 4px;
}

.ticket-title {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
}

.ticket-sub {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
}

.ticket-actions {
  display: flex;
  gap: 10px;
}

.btn {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.btn.primary {
  background: #4f46e5;
  color: white;
}

.btn.secondary {
  background: #e9e7ff;
  color: #4f46e5;
}

.btn:hover {
  opacity: 0.9;
}
</style>
