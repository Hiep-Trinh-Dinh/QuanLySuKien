<template>
  <div>
    <h4>Doanh thu theo tháng</h4>

    <!-- Input chọn tháng -->
    <div class="mb-3">
      <label for="monthPicker" class="form-label">Chọn tháng:</label>
      <input
        type="month"
        id="monthPicker"
        class="form-control"
        v-model="selectedMonth"
        @change="loadRevenue"
      />
    </div>

    <!-- Chart -->
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartCanvas = ref(null);
let chartInstance = null;

// Giá trị mặc định là tháng hiện tại
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const selectedMonth = ref(`${yyyy}-${mm}`);

async function loadRevenue() {
  try {
    // Gọi API theo tháng
    const res = await fetch(
      `http://localhost:3000/revenue-by-month?month=${selectedMonth.value}`
    );
    const data = await res.json();
    console.log(data);

    const labels = Object.keys(data);
    const values = Object.values(data);

    // Destroy chart cũ nếu có
    if (chartInstance) chartInstance.destroy();

    chartInstance = new ChartJS(chartCanvas.value.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: values,
            backgroundColor: "#7c3aed",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
          title: {
            display: true,
            text: `Doanh thu tháng ${selectedMonth.value}`,
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  } catch (err) {
    console.error("Failed to load revenue", err);
  }
}

onMounted(loadRevenue);
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 400px;
}
</style>
