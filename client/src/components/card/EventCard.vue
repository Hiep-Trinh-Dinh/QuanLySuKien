<template>
    <div class="card shadow-primary h-100 rounded-4 event-card-hover position-relative overflow-hidden" style="min-height: 250px;">
        <img :src="event.image" class="card-img-top position-absolute top-0 start-0 w-100 h-100" alt="Event image" style="object-fit: cover; z-index: 1; opacity: 0.6;">
        <div class="card-body position-relative" style="z-index: 2;">
            <small class="  fw-bold fs-5 d-block mb-2">
                {{ event.date }} - {{ event.time }}
            </small>
            <h6 class="card-title">{{ event.title }}</h6>
            <p class="card-text small fw-bold fs-17 text-muted">{{ event.location }}</p>
            <button @click.stop= "$router.push(`/event-detail/${event.id}`)" class="btn btn-sm btn-buy">Xem chi tiết</button>
          </div>
    </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true,
  },
});
</script>
<style>

.event-card-hover {
  transition: all 0.3s ease;
}

.event-card-hover:hover {
  transform: translateY(-6px);
  box-shadow: 0 1rem 2rem rgba(136, 115, 221, 0.405) !important; 
  cursor: pointer;
}
</style>
