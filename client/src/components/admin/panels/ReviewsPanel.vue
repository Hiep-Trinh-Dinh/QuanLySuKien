<template>
  <div>
    <h4>Reviews</h4>
    <table class="table table-sm table-striped mt-3">
      <thead><tr><th>ID</th><th>Event</th><th>Rating</th><th>Name</th><th>Content</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="r in localReviews" :key="r.id"><td>{{r.id}}</td><td>{{r.event_id}}</td><td>{{r.rating}}</td><td>{{r.name}}</td><td>{{r.content}}</td><td><button class="btn btn-sm btn-outline-danger" @click="confirmDeleteReview(r.id)">Delete</button></td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getReviews, deleteReview } from '../../../scripts/admin';

const localReviews = ref([]);

async function loadReviews() {
  try {
    const res = await getReviews({ limit: 200 });
    localReviews.value = res || res.data || [];
  } catch (err) { console.error(err); }
}

async function confirmDeleteReview(id) { if (!confirm('Xóa review?')) return; try { await deleteReview(id); await loadReviews(); } catch (err) { console.error(err); alert('Lỗi khi xóa review'); } }

onMounted(loadReviews);
</script>

<style scoped></style>
