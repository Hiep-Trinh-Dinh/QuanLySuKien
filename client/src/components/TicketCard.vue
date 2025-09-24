<template>
  <div class="ticket-card">
    <div 
      class="ticket-image" 
      :style="{ backgroundImage: `url(${image})` }">
    </div>
    <div class="ticket-content">
      <p class="ticket-date">{{ date }}</p>
      <h3 class="ticket-title">{{ title }}</h3>
      <p class="ticket-location">{{ location }} • {{ tickets }} Vé</p>
      <div class="ticket-actions">
      <button class="btn view">Xem vé</button>
      <button class="btn transfer" @click="$router.push({ name: 'TicketInformation', params: { id: id } })"> Thông tin</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const props = defineProps({
  id: Number,
  date: String,
  title: String,
  location: String,
  tickets: String,
  image: String,
  price: String,
  status: String
})

const router = useRouter()
const goToInfo = () => {
  router.push({ name: "ticketInfo", params: { id: props.id } })
}

</script>



<style scoped>
.ticket-card {
  display: flex;
  align-items: flex-end;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  height: 160px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.ticket-card:hover {
  transform: translateY(-4px);
}
.ticket-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.25; /* làm mờ ảnh nền */
}
.ticket-content {
  position: relative;
  padding: 16px;
  width: 100%;
  z-index: 1;
}
.ticket-date {
  font-size: 14px;
  color: #666;
}
.ticket-title {
  font-size: 18px;
  margin: 6px 0;
  font-weight: 600;
  color: #111;
}
.ticket-location {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}
.ticket-actions {
  display: flex;
  gap: 10px;
}
.btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}
.btn.view {
  background-color: #4f46e5;
  color: white;
}
.btn.transfer {
  background-color: #eef2ff;
  color: #4f46e5;
}
.btn:hover {
  opacity: 0.9;
}
</style>
