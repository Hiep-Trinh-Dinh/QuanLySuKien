<script setup lang="ts">
import { ref, computed } from "vue";
import imgBackgroud from "../../../public/—Pngtree—a massive crowd of people_16139729.png";

// props nhận background URL
// const props = defineProps<{
//   bgUrl: string;
// }>();

const bgUrl = imgBackgroud;

// dùng computed để tạo CSS variable cho pseudo-element
const bgStyle = computed(() => ({
  "--bg-url": `url(${bgUrl})`,
}));
const userInfo = ref({
  name: "Võ Anh Tuấn",
  date: "October 05, 2025",
  time: "2:00 PM",
  place: "SGU Quận 5, Thành phố Hồ Chí Minh",
});
</script>

<template>
  <div>
    <div class="text-start fw-bold h2 ms-4">
      <span>{{ userInfo.name }}</span>
    </div>

    <div>
      <ul class="horizontal-list">
        <li>{{ userInfo.date }}</li>
        <li>{{ userInfo.time }}</li>
        <li>{{ userInfo.place }}</li>
      </ul>
    </div>

    <!-- Div dynamic background -->
    <div class="dynamic-bg" :style="bgStyle">
      <i class="pi pi-tiktok"></i>
      <span class="content">Event Content</span>
    </div>
    <div class="ms-2 mt-2">
      <ul class="nav nav-pills mb-3 gap-2" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="pills-overview-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-overview"
            type="button"
            role="tab"
            aria-controls="pills-overview"
            aria-selected="true"
          >
            Overview
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-lineup-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-lineup"
            type="button"
            role="tab"
            aria-controls="pills-lineup"
            aria-selected="false"
          >
            Lineup
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-venues-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-venues"
            type="button"
            role="tab"
            aria-controls="pills-venues"
            aria-selected="false"
          >
            Venues
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-reviews-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-reviews"
            type="button"
            role="tab"
            aria-controls="pills-reviews"
            aria-selected="false"
          >
            Reviews
          </button>
        </li>
      </ul>

      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-overview"
          role="tabpanel"
          aria-labelledby="pills-overview-tab"
          tabindex="0"
        >
          Overview content
        </div>
        <div
          class="tab-pane fade"
          id="pills-lineup"
          role="tabpanel"
          aria-labelledby="pills-lineup-tab"
          tabindex="0"
        >
          Lineup content
        </div>
        <div
          class="tab-pane fade"
          id="pills-venues"
          role="tabpanel"
          aria-labelledby="pills-venues-tab"
          tabindex="0"
        >
          Venues content
        </div>
        <div
          class="tab-pane fade"
          id="pills-reviews"
          role="tabpanel"
          aria-labelledby="pills-reviews-tab"
          tabindex="0"
        >
          Reviews content
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horizontal-list {
  list-style-position: inside;
  padding: 0;
  margin: 20px;
}
.horizontal-list li {
  display: inline;
  margin-right: 20px;
}

/* Dynamic background div */
.dynamic-bg {
  padding-top: 10px;
  position: relative;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: first baseline;
  color: white;
  font-size: 2rem;
  overflow: hidden;
  border-radius: 12px;
}

/* Pseudo-element background + blur */
.dynamic-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--bg-url);
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 0;
}

/* Icon + content không bị blur */
.dynamic-bg i,
.dynamic-bg .content {
  position: relative;
  z-index: 1;
}

/* Responsive */
@media (max-width: 600px) {
  .dynamic-bg {
    height: 150px;
    font-size: 2rem;
  }
}

/* Wrapper */
.ms-2.mt-2 {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}

/* Nav pills */
.nav-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-pills .nav-link {
  background-color: #f5f5f5; /* màu nền bình thường */
  color: #333;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
  background-color: #e0e0e0;
  color: #0d6efd;
}

.nav-pills .nav-link.active {
  background-color: #0d6efd; /* màu active */
  color: #fff;
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.4);
}

/* Tab content */
.tab-content {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  color: #333;
  min-height: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Responsive cho mobile */
@media (max-width: 600px) {
  .nav-pills .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  .tab-content {
    padding: 10px;
  }
}
</style>
