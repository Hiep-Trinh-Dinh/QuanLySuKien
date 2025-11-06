<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Support Tickets</h4>
      <div>
        <button class="btn btn-sm btn-primary" @click="refresh">Reload</button>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-4">
        <label class="form-label">Lọc theo trạng thái</label>
        <select v-model="statusFilter" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Tìm kiếm</label>
        <input v-model="q" class="form-control" placeholder="id, email, subject..." />
      </div>
    </div>

    <div class="mt-3">
      <table class="table table-sm table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Event</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filtered" :key="t.id">
            <td>{{ t.id }}</td>
            <td>{{ t.user_name || t.user_id }}</td>
            <td>{{ t.email }}</td>
            <td>{{ t.event_title || t.event_id || '—' }}</td>
            <td>{{ t.subject }}</td>
            <td>{{ t.status }}</td>
            <td>{{ t.created_at }}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary me-2" @click="openDetails(t)">View</button>
              <button class="btn btn-sm btn-outline-primary" @click="startChangeStatus(t)">Change status</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!tickets.length" class="alert alert-info">Không có ticket nào.</div>
    </div>

    <div v-if="showModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;background:rgba(0,0,0,0.18);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div class="card" style="width:800px;max-width:95%;">
        <div class="card-body">
          <h5 class="card-title">Support ticket #{{ detail.id }}</h5>
          <p><strong>Subject:</strong> {{ detail.subject }}</p>
          <p><strong>Issue:</strong> {{ detail.issue_type || '—' }}</p>
          <p><strong>From:</strong> {{ detail.user_name || detail.email }}</p>
          <p><strong>Message:</strong></p>
          <div class="border p-2" style="white-space:pre-wrap">{{ detail.message }}</div>
          <div v-if="detail.attachment" class="mt-2">
            <strong>Attachment:</strong>
            <div><img :src="attachmentUrl(detail.attachment)" alt="attachment" style="max-width:200px;max-height:200px"/></div>
          </div>

          <div class="mt-3">
            <label class="form-label">Trạng thái</label>
            <select v-model="detail.status" class="form-select">
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="resolved">resolved</option>
              <option value="closed">closed</option>
            </select>
          </div>

          <div class="mt-3 d-flex justify-content-end">
            <button class="btn btn-secondary me-2" @click="closeModal">Close</button>
            <button class="btn btn-primary" @click="saveStatus">Save</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getSupportTickets, updateSupportTicket } from '../../../scripts/admin';

const tickets = ref([]);
const q = ref('');
const statusFilter = ref('');

const showModal = ref(false);
const detail = ref({});

const statuses = computed(() => {
  const s = new Set();
  for (const t of tickets.value || []) if (t && t.status) s.add(t.status);
  return Array.from(s);
});

const filtered = computed(() => {
  let items = tickets.value || [];
  if (statusFilter.value) items = items.filter(x => x.status === statusFilter.value);
  if (q.value) {
    const ql = q.value.toLowerCase();
    items = items.filter(x => String(x.id).includes(ql) || (x.email||'').toLowerCase().includes(ql) || (x.subject||'').toLowerCase().includes(ql));
  }
  return items;
});

async function load() {
  try {
    const res = await getSupportTickets();
    // server returns { data: [...], pagination } or array
    tickets.value = Array.isArray(res) ? res : (res.data || res.tickets || []);
  } catch (err) { console.error('Lỗi load support tickets', err); }
}

function refresh() { load(); }

function openDetails(t) { detail.value = { ...t }; showModal.value = true; }
function closeModal() { showModal.value = false; detail.value = {}; }

function attachmentUrl(name) {
  // The attachment field may be a filename stored on server; adjust if needed
  if (!name) return null;
  return `http://localhost:3000/uploads/${name}`;
}

function startChangeStatus(t) { openDetails(t); }

async function saveStatus() {
  try {
    const id = detail.value.id;
    const payload = { status: detail.value.status };
    await updateSupportTicket(id, payload);
    showModal.value = false;
    await load();
  } catch (err) { console.error('Lỗi khi lưu status', err); alert('Lỗi khi lưu trạng thái'); }
}

onMounted(() => { load(); });
</script>

<style scoped>
</style>
