<template>
  <div
    class="card text-left shadow-success h-100 border-0 rounded-4 category-card-hover"
  >
    <div class="card-body text-center">
      <div class="mb-2 fs-2 text-primary">
        <i :class="['bi', category.icon]"></i>
      </div>
    <h6 class="card-title fw-bold fs-2">{{ category.name }}</h6>
      <p class="card-text small text-muted">{{ category.desc }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
});
</script>

<style>

.category-card-hover {
  transition: all 0.3s ease;
}

.category-card-hover:hover {
  transform: translateY(-6px); 
  box-shadow: 0 1rem 2rem rgba(7, 127, 55, 0.45) !important; 
  cursor: pointer;
}
</style>
