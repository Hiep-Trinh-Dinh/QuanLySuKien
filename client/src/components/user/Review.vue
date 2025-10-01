<script setup>
import { ref } from "vue";
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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
const rating = ref([40, 60, 80, 30, 1]);
const sum = rating.value.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  0
);
const data = [...rating.value, Math.floor(sum / rating.value.length)];
// Dữ liệu ban đầu
const chartData = ref({
  labels: ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao", "trung bình"],
  datasets: [
    {
      label: "Đánh giá tổng thể",
      backgroundColor: "#7c3aed",
      data: data,
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
  },
};
</script>

<template>
  <div class="d-flex justify-content-between">
    <h5>Đánh giá :({{ sum }})</h5>
    <button class="btn btn-custom">Viết đánh giá</button>
  </div>
  <div class="d-flex justify-content-center">
    <div class="w-75 h-50 text-center">
      <Bar :data="chartData" :options="chartOptions" />
      <div class="mt-4 flex gap-2 justify-center"></div>
    </div>
  </div>
  <div class="d-flex justify-content-center w-100">
    <div
      class="d-flex flex-column w-100 justify-content-center align-items-center"
    >
      <h4 class="text-center">Đánh giá gần đây</h4>
      <div class="w-75 custom-comment p-3">
        <div class="icon-circle mb-3">
          <span class="pi pi-user"></span>
        </div>
        <div class="d-flex gap-2 mb-2">
          <span>5.0</span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
        </div>
        <h5>Trải nghiệm tuyệt vời</h5>
        <span class="detail-comment text-secondary">Lễ hội tuyệt vời</span>
      </div>
      <span class="m-2 text-secondary"> Võ Anh Tuấn • 2 tuần trước</span>
      <div class="w-75 custom-comment p-3">
        <div class="icon-circle mb-3">
          <span class="pi pi-user"></span>
        </div>
        <div class="d-flex gap-2 mb-2">
          <span>5.0</span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
        </div>
        <h5>Trải nghiệm tuyệt vời</h5>
        <span class="detail-comment text-secondary">Lễ hội tuyệt vời</span>
      </div>
      <span class="m-2 text-secondary"> Võ Anh Tuấn • 2 tuần trước</span>

      <div class="w-75 custom-comment p-3">
        <div class="icon-circle mb-3">
          <span class="pi pi-user"></span>
        </div>
        <div class="d-flex gap-2 mb-2">
          <span>4.0</span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star-fill mt-1"></span>
          <span class="pi pi-star mt-1"></span>
        </div>
        <h5>Trải nghiệm khá tốt</h5>
        <span class="detail-comment text-secondary">Lễ hội tuyệt vời</span>
      </div>
      <span class="m-2 text-secondary"> Võ Anh Tuấn • 2 tuần trước</span>
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
</template>
<style scope>
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
  line-height: 1; /* quan trọng */
  color: #7c3aed;
}

.custom-comment {
  border-radius: 10px;
  background-color: #f3efef;
}
</style>
