<template>
  <div>
    <h4>Overview</h4>
    <p class="text-muted">Quick stats and recent activity (basic).</p>
    <div class="row g-3">
      <div class="col-md-3" v-for="stat in stats" :key="stat.label">
        <div class="p-3 border rounded bg-white">
          <div class="small text-muted">{{ stat.label }}</div>
          <div class="h5 mt-2">{{ stat.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ stats: Array });
</script>

<style scoped></style>
