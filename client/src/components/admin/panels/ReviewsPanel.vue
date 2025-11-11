<template>
  <div>
    <h4>Reviews</h4>

    <div class="row g-2 mb-2">
      <div class="col-md-3">
        <input v-model="filters.event" class="form-control" placeholder="Event ID or title" />
      </div>
      <div class="col-md-3">
        <input v-model="filters.user" class="form-control" placeholder="User ID / username / email" />
      </div>
      <div class="col-md-2">
        <select v-model="filters.rating" class="form-select">
          <option value="">All ratings</option>
          <option v-for="n in [5,4,3,2,1]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div class="col-md-4 d-flex" style="gap:8px;">
        <button class="btn btn-sm btn-primary" @click="applyFilters">Search</button>
        <button class="btn btn-sm btn-secondary" @click="clearFilters">Clear</button>
      </div>
    </div>

    <table class="table table-sm table-striped mt-1">
      <thead><tr><th>ID</th><th>Event</th><th>Rating</th><th>Reviewer</th><th>Content</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="r in localReviews" :key="r.id">
          <td>{{ r.id }}</td>
          <td>{{ r.event_title || r.event_id }}</td>
          <td>{{ r.rating }}</td>
          <td>{{ r.reviewer_name || r.reviewer_email || r.name }}</td>
          <td>{{ r.content }}</td>
          <td><button class="btn btn-sm btn-outline-danger" @click="confirmDeleteReview(r.id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getReviews, deleteReview } from '../../../scripts/admin';

const localReviews = ref([]);
const filters = ref({ event: '', user: '', rating: '' });

async function loadReviews(params = {}) {
  try {
    const res = await getReviews({ ...params, limit: 200 });
    // API returns { reviews, pagination }
    localReviews.value = Array.isArray(res) ? res : res.reviews || res.data || [];
  } catch (err) { console.error(err); }
}

function applyFilters() {
  const p = {};
  if (filters.value.event) {
    // if numeric treat as event_id
    if (/^\d+$/.test(filters.value.event)) p.event_id = filters.value.event; else p.event = filters.value.event;
  }
  if (filters.value.user) p.user = filters.value.user;
  if (filters.value.rating) p.rating = filters.value.rating;
  loadReviews(p);
}

function clearFilters() {
  filters.value = { event: '', user: '', rating: '' };
  loadReviews();
}

async function confirmDeleteReview(id) { if (!confirm('Xóa review?')) return; try { await deleteReview(id); await loadReviews(); } catch (err) { console.error(err); alert('Lỗi khi xóa review'); } }

onMounted(() => loadReviews());
</script>

<style scoped></style>
