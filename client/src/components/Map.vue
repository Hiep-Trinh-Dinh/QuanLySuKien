<template>
  <div class="map-container">
    <iframe
      :src="mapUrl"
      width="600"
      height="450"
      style="border: 0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// địa chỉ cần map
const address = ref("1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hanoi, Vietnam");

// tạo URL đã encode
const mapUrl = computed(() => {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    address.value
  )}&output=embed`;
});
</script>

<style>
.map-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
