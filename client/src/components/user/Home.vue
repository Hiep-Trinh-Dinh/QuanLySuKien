<template>
  <div class="container py-4">
    <!-- Tìm kiếm -->
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        class="form-control"
        placeholder="Tìm theo tên, địa điểm hoặc ngày..."
      />
    </div>

    <!-- Thể loại -->
    <h5 class="mb-3">Thể loại</h5>
    <div class="row g-3 mb-5">
      <div
        v-for="category in categories"
        :key="category.id"
        class="col-6 col-md-3"
      >
        <CategoryCard :category="category" />
      </div>
    </div>

    <!-- Sự kiện nổi bật -->
    <h5 class="mb-3">Sự kiện nổi bật</h5>
    <div class="row g-4 mb-5">
      <div
        v-for="event in featuredEvents"
        :key="event.id"
        class="col-12 col-md-4"
      >
        <EventCard :event="event" @detail="handleDetailClick" />
      </div>
    </div>

    <!-- Sự kiện sắp diễn ra -->
    <h5 class="mb-3">Sự kiện sắp diễn ra</h5>
    <ul class="list-group">
      <li
        v-for="event in upcomingEvents"
        :key="event.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ event.title }}</strong>
          <div class="small text-muted">
            {{ event.date }} - {{ event.location }}
          </div>
        </div>
<<<<<<< Updated upstream
        <button class="btn btn-outline-primary btn-sm" @click="router.push(`/event-detail/${event.id}`)">Chi tiết</button>
=======
        <button
          class="btn btn-outline-primary btn-sm"
          @click="handleDetailClick(event.id)"
        >
          Chi tiết
        </button>
>>>>>>> Stashed changes
      </li>
    </ul>
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import EventCard from "../card/EventCard.vue";
import CategoryCard from "../card/CategoryCard.vue";
<<<<<<< Updated upstream
import { fetchEvents } from "../../scripts/ExploreEvents.js";


const router = useRouter()
=======
import { useRouter } from "vue-router";
const router = useRouter();
>>>>>>> Stashed changes

const search = ref("");

// Thể loại
const categories = ref([
  {
    id: 1,
    name: "Âm nhạc",
    desc: "Biểu diễn, hòa nhạc...",
    icon: "bi-music-note-beamed",
  },
  {
    id: 2,
    name: "Hội nghị",
    desc: "Hội thảo, kinh doanh",
    icon: "bi-bar-chart-line-fill",
  },
  { id: 3, name: "Thể thao", desc: "Bóng đá, thể dục", icon: "bi-trophy-fill" },
  {
    id: 4,
    name: "Nghệ thuật",
    desc: "Triển lãm, biểu diễn",
    icon: "bi-palette-fill",
  },
]);

// All events fetched from backend
const events = ref([]);

// Sự kiện nổi bật (show top 3)
const featuredEvents = ref([]);

// Sự kiện sắp diễn ra
<<<<<<< Updated upstream
const upcomingEvents = ref([]);

// Helper: transform backend event into a small view model
function transformEvent(e) {
  const date = e.start_time ? new Date(e.start_time).toLocaleDateString('vi-VN') : (e.date || '');
  const location = e.venue_name || e.venue_address || e.location || '';
  return {
    id: e.id,
    title: e.title,
    date,
    time: e.start_time ? new Date(e.start_time).toLocaleTimeString('vi-VN') : (e.time || ''),
    location,
    image: e.image_url || null,
    raw: e,
  };
}

// Load events from backend and populate featured/upcoming lists
async function loadEvents() {
  try {
    await fetchEvents(events);
    // map to view models
    const mapped = events.value.map(transformEvent);
    console.log('Mapped events:', mapped);
    // upcoming: sort by date asc and take next 6
    upcomingEvents.value = mapped
      .slice()
      .sort((a, b) => new Date(a.raw.start_time || a.date) - new Date(b.raw.start_time || b.date))
      .slice(0, 6);
    // featured: pick first 3
    featuredEvents.value = mapped.slice(0, 3);
  } catch (err) {
    console.error('Lỗi khi tải events:', err);
  }
}

onMounted(() => {
  loadEvents();
});
=======
const upcomingEvents = ref([
  {
    id: 1,
    title: "Khai mạc triển lãm nghệ thuật",
    date: "Dec 10, 2025",
    location: "Bảo tàng Mỹ thuật",
  },
  {
    id: 2,
    title: "Sự kiện kết nối kinh doanh",
    date: "Dec 12, 2025",
    location: "Khách sạn Melia",
  },
  {
    id: 3,
    title: "Đêm nhạc Jazz",
    date: "Dec 15, 2025",
    location: "CLB Âm nhạc Hà Nội",
  },
]);

const handleDetailClick = (id) => {
  router.push({ name: "EventDetail", params: { id } });
};
>>>>>>> Stashed changes
</script>

<style>
body {
  background-color: #f9f9f9;
}

.shadow-primary {
  box-shadow: 0 0.5rem 1rem rgba(13, 110, 253, 0.3) !important; /* xanh dương */
}

.shadow-success {
  box-shadow: 0 0.5rem 1rem rgba(25, 135, 84, 0.3) !important; /* xanh lá */
}

.shadow-danger {
  box-shadow: 0 0.5rem 1rem rgba(220, 53, 69, 0.3) !important; /* đỏ */
}
</style>
