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
        <EventCard :event="event" />
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
          <div class="small text-muted">{{ event.date }} - {{ event.location }}</div>
        </div>
        <button class="btn btn-outline-primary btn-sm">Chi tiết</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import EventCard from "../card/EventCard.vue";
import CategoryCard from "../card/CategoryCard.vue";

const search = ref("");

// Thể loại
const categories = ref([
  { id: 1, name: "Âm nhạc", desc: "Biểu diễn, hòa nhạc...", icon: "bi-music-note-beamed" },
  { id: 2, name: "Hội nghị", desc: "Hội thảo, kinh doanh", icon: "bi-bar-chart-line-fill" },
  { id: 3, name: "Thể thao", desc: "Bóng đá, thể dục", icon: "bi-trophy-fill" },
  { id: 4, name: "Nghệ thuật", desc: "Triển lãm, biểu diễn", icon: "bi-palette-fill" },
]);

// Sự kiện nổi bật
const featuredEvents = ref([
  {
    id: 1,
    title: "Summer Music Festival",
    date: "Dec 25, 2023",
    time: "6:00 PM",
    location: "Nhà hát lớn Hà Nội",
    image: "https://via.placeholder.com/400x200?text=Music+Festival",
  },
  {
    id: 2,
    title: "Hội nghị công nghệ 2025",
    date: "Dec 28, 2024",
    time: "9:30 AM",
    location: "Trung tâm hội nghị Quốc Gia",
    image: "https://via.placeholder.com/400x200?text=Tech+Conference",
  },
  {
    id: 3,
    title: "Giải vô địch bóng đá",
    date: "Feb 5, 2024",
    time: "7:00 PM",
    location: "Sân vận động Mỹ Đình",
    image: "../src/assets/img/—Pngtree—a massive crowd of people_16139729.png",
  },
]);

// Sự kiện sắp diễn ra
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
</script>

<style>
body {
  background-color: #f9f9f9;
}

.shadow-primary {
  box-shadow: 0 .5rem 1rem rgba(13, 110, 253, 0.3) !important; /* xanh dương */
}

.shadow-success {
  box-shadow: 0 .5rem 1rem rgba(25, 135, 84, 0.3) !important; /* xanh lá */
}

.shadow-danger {
  box-shadow: 0 .5rem 1rem rgba(220, 53, 69, 0.3) !important; /* đỏ */
}
</style>
