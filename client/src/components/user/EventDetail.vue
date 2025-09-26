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
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            Home
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Profile
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-contact-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-contact"
            type="button"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
          >
            Contact
          </button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
          tabindex="0"
        >
          ...
        </div>
        <div
          class="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
          tabindex="0"
        >
          ...
        </div>
        <div
          class="tab-pane fade"
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
          tabindex="0"
        >
          ...
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
</style>
