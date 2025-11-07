<script setup>
import { ref, onMounted } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
import router from "../../router";

ChartJS.register(
  Title, // hiển thị tiêu đề biểu đồ
  Tooltip, // hiển thị tooltip khi hover
  Legend, // hiển thị chú giải (legend)
  BarElement, // vẽ các thanh của biểu đồ cột (bar chart)
  CategoryScale, // trục danh mục (x-axis cho bar chart)
  LinearScale // trục số liệu (y-axis cho bar chart)
);
const props = defineProps({
  eventId: { type: [Number, String], required: true },
});
const reviews = ref([]);
const ratings = ref([5, 4, 3, 2, 1]);
const ratingStats = ref([0, 0, 0, 0, 0]);
const avgRating = ref(0);
const chartData = ref({
  labels: ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao", "Trung bình"],
  datasets: [
    {
      label: "Đánh giá tổng thể",
      backgroundColor: "#7c3aed",
      data: [],
    },
  ],
});
const chartOptions = {
  responsive: true,
  plugins: { legend: { position: "top" } },
};
const loading = ref(true);
onMounted(async () => {
  loading.value = true;
  try {
    const res = await fetch(
      `http://localhost:3000/reviews?event_id=${props.eventId}`
    );
    if (res.ok) {
      reviews.value = await res.json();
      updateStats();
    } else {
      reviews.value = [];
    }
  } catch (e) {
    reviews.value = [];
  }
  loading.value = false;
});
function updateStats() {
  ratingStats.value = [5, 4, 3, 2, 1].map(
    (star) => reviews.value.filter((r) => r.rating === star).length
  );
  const sum = reviews.value.reduce((acc, cur) => acc + (cur.rating || 0), 0);
  avgRating.value = reviews.value.length
    ? (sum / reviews.value.length).toFixed(1)
    : 0;
  chartData.value.datasets[0].data = [
    ...ratingStats.value,
    Number(avgRating.value),
  ];
}
</script>
<template>
  <div v-if="loading" class="py-3">Loading reviews...</div>
  <div v-else>
    <div class="d-flex justify-content-between">
      <h5>Đánh giá: ({{ reviews.length }})</h5>
      <router-link
        :to="`/event-previewform?id=${eventId}`"
        class="btn btn-custom"
        >Viết đánh giá</router-link
      >
    </div>
    <div class="d-flex justify-content-center">
      <div class="w-75 h-50 text-center">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
    <div class="d-flex justify-content-center w-100">
      <div
        class="d-flex flex-column w-100 justify-content-center align-items-center"
      >
        <h4 class="text-center">Đánh giá gần đây</h4>
        <div
          v-for="review in reviews.slice(0, 3)"
          :key="review.id"
          class="w-75 custom-comment p-3"
        >
          <div class="icon-circle mb-3">
            <span class="pi pi-user"></span>
          </div>
          <div class="d-flex gap-2 mb-2">
            <span>{{ review.rating.toFixed(1) }}</span>
            <span
              v-for="star in 5"
              :key="star"
              :class="[
                'pi',
                review.rating >= star ? 'pi-star-fill' : 'pi-star',
                'mt-1',
              ]"
            ></span>
          </div>
          <!-- Bỏ dòng tiêu đề review ở đây -->
          <span class="detail-comment text-secondary">{{
            review.content
          }}</span>
        </div>
        <span class="m-2 text-secondary" v-if="reviews[0]"
          >{{ reviews[0].name }} •
          {{
            new Date(reviews[0].created_at).toLocaleDateString("vi-VN")
          }}</span
        >
      </div>
    </div>
    <button class="btn btn-read-more w-100">Xem thêm</button>
    <div class="mt-3">
      <h4 class="text-center">Nguyên tắc đánh giá</h4>
      <ul class="list-group">
        <li class="list-group-item">
          Tôn trọng và mang tinh xây dựng trong phản hồi của bạn
        </li>
        <li class="list-group-item">
          Tập trung vào trải nghiệm cá nhân của bạn tại sự kiện
        </li>
        <li class="list-group-item">
          Tránh ngôn ngữ xúc phạm hoặc tấn công cá nhân
        </li>
        <li class="list-group-item">
          Đánh giá được duyệt và có thể mất tới 24h để hiển thị
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.btn-custom {
  border-radius: 10px !important;
  background-color: #7c3aed !important;
  color: white !important;
}
.btn-custom:hover {
  background-color: #6631c1 !important;
}
.btn-read-more {
  border-radius: 10px !important;
  background-color: #d1cfcf !important;
  color: #6631c1 !important;
  font-weight: 500 !important;
}
.btn-read-more:hover {
  background-color: #b0aeae !important;
}
.icon-circle {
  border-radius: 100%;
  background-color: #d1cfcf;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  color: #7c3aed;
}
.custom-comment {
  border-radius: 10px;
  background-color: #f3efef;
}
</style>
