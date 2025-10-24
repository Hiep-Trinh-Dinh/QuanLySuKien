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
import { computed, toRef } from "vue";
const props = defineProps({ address: { type: String, default: "1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hanoi, Vietnam" } });
const mapUrl = computed(() => {
  return `https://www.google.com/maps?q=${encodeURIComponent(props.address)}&output=embed`;
});
</script>

<style>
.map-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
