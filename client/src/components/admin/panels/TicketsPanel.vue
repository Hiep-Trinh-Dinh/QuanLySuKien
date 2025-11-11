<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Tickets</h4>
      <div><button class="btn btn-sm btn-primary" @click="openAddTicket">+ Thêm vé</button></div>
    </div>

    <!-- inline response message -->
    <div v-if="message" class="mt-3">
      <div :class="['alert', messageType === 'success' ? 'alert-success' : (messageType === 'danger' ? 'alert-danger' : 'alert-info')]" role="alert">
        <div class="d-flex justify-content-between align-items-start">
          <div v-html="message"></div>
          <button type="button" class="btn-close ms-3" aria-label="Close" @click="clearMessage()"></button>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-4">
        <label class="form-label">Chọn sự kiện</label>
        <select v-model="selectedEvent" @change="onEventChange" class="form-select">
          <option :value="null">-- chọn event --</option>
          <option v-for="ev in eventsList" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Lọc theo loại vé</label>
        <select v-model="typeFilter" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="t in ticketTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Lọc theo trạng thái</label>
        <select v-model="statusFilter" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="s in ticketStatuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      
      <div class="col-md-2 d-flex align-items-end">
        <button class="btn btn-sm btn-outline-secondary me-2" @click="refresh">Reload</button>
      </div>
    </div>

    <div class="mt-3" v-if="selectedEvent">
      <div v-for="(items, type) in groupedByType" :key="type" class="mb-4">
        <h5>{{ type }} ({{ items.length }})</h5>
        <table class="table table-sm table-striped">
          <thead><tr><th>ID</th> <th>ID-User</th>  <th>Seat</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-for="t in items" :key="t.id">
              <td>{{ t.id }}</td>
              <td>{{ t.user_id }}</td>
              <td>{{ t.seat_number }}</td>
              <td>{{ t.price }}</td>
              <td>{{ t.status }}</td>
              <td>
                <!-- <button class="btn btn-sm btn-outline-secondary me-2" @click="openEditTicket(t)">Edit</button> -->
                <button class="btn btn-sm btn-outline-danger" @click="confirmDeleteTicket(t.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="mt-3">
      <div class="alert alert-info">Vui lòng chọn một sự kiện để xem vé.</div>
    </div>

  <div v-if="localShowModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;background:rgba(0,0,0,0.18);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div class="card" style="width:600px;max-width:95%;">
        <div class="card-body">
          <h5 class="card-title">{{ localForm.id ? 'Chỉnh sửa vé' : 'Tạo vé mới' }}</h5>
          <div class="row g-2">
            <div class="col-md-6"><label class="form-label">Event</label>
              <select v-model="localForm.event_id" class="form-select">
                <option :value="null">-- chọn event --</option>
                <option v-for="ev in eventsList" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
              </select>
            </div>
            <div class="col-md-3"><label class="form-label">Seat</label><input v-model.number="localForm.seat_number" class="form-control" type="number"/></div>
            <div class="col-md-3"><label class="form-label">Type</label>
              <select v-model="localForm.Type" class="form-select"><option value="student">student</option><option value="standard">standard</option><option value="vip">vip</option></select>
            </div>
            <div class="col-md-4"><label class="form-label">Price</label><input v-model.number="localForm.price" class="form-control" type="number"/></div>
          </div>
          <div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="closeModal">Hủy</button><button class="btn btn-primary" @click="submit">Lưu</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { getTickets, createTicket, updateTicket, deleteTicket, fetchEvents } from '../../../scripts/admin';

const localTickets = ref([]);
const eventsList = ref([]);

const localShowModal = ref(false);
const localForm = reactive({ id: null, event_id: null, seat_number: null, Type: 'standard', price: 0 });

// response messaging shown inline in the panel
const message = ref('');
const messageType = ref('success'); // 'success' | 'danger' | 'info'
let messageTimer = null;
function showMessage(msg, type = 'success', timeout = 5000) {
  clearMessage();
  message.value = msg || '';
  messageType.value = type || 'success';
  if (timeout > 0) {
    messageTimer = setTimeout(() => { clearMessage(); }, timeout);
  }
}
function clearMessage() {
  message.value = '';
  messageType.value = 'success';
  if (messageTimer) { clearTimeout(messageTimer); messageTimer = null; }
}

const selectedEvent = ref(null);
const typeFilter = ref('');
const statusFilter = ref('');

const ticketTypes = ref(['student','standard','vip']);
const ticketStatuses = computed(() => {
  const set = new Set();
  for (const t of (localTickets.value || [])) {
    if (t && t.status) set.add(t.status);
  }
  return Array.from(set);
});

async function loadTickets(event_id = null) {
  try {
    const params = {};
    if (event_id) params.event_id = event_id;
    const res = await getTickets(params);
    // API may return an array or object
    localTickets.value = Array.isArray(res) ? res : (res.tickets || res.data || res || []);
  } catch (err) { console.error(err); }
}

async function loadEvents() {
  try {
    const res = await fetchEvents();
    eventsList.value = Array.isArray(res) ? res : res.events || res.data || [];
  } catch (err) { console.error(err); }
}

function resetForm() { localForm.id = null; localForm.event_id = null; localForm.seat_number = null; localForm.Type = 'standard'; localForm.price = 0; }
function openAddTicket() { resetForm(); localShowModal.value = true; }
function openEditTicket(t) { localForm.id = t.id; localForm.event_id = t.event_id; localForm.seat_number = t.seat_number; localForm.Type = t.Type || 'standard'; localForm.price = t.price; localShowModal.value = true; }

function eventTitle(id) { const e = eventsList.value.find(x => x.id === id); return e ? e.title : id; }

async function submit() {
  try {
    const payload = { event_id: localForm.event_id, seat_number: localForm.seat_number, Type: localForm.Type, price: Number(localForm.price) };
    let res;
    if (localForm.id) res = await updateTicket(localForm.id, payload);
    else res = await createTicket(payload);

    // show server response message when available
    if (res && (res.message || res.msg)) {
      showMessage(res.message || res.msg, res.ok === false || res.success === false ? 'danger' : 'success');
    } else {
      showMessage(localForm.id ? 'Cập nhật vé thành công' : 'Tạo vé thành công', 'success');
    }

    localShowModal.value = false;
    await loadTickets(selectedEvent.value);
  } catch (err) {
    console.error('Failed to save ticket', err);
    const serverMsg = err?.response?.data?.message || err?.message || 'Lỗi khi lưu ticket';
    showMessage(serverMsg, 'danger');
  }
}

async function confirmDeleteTicket(id) {
  if (!confirm('Bạn có chắc muốn xóa vé này?')) return;
  try {
    const res = await deleteTicket(id);
    if (res && (res.message || res.msg)) {
      showMessage(res.message || res.msg, res.ok === false || res.success === false ? 'danger' : 'success');
    } else {
      showMessage('Xóa vé thành công', 'success');
    }
    await loadTickets(selectedEvent.value);
  } catch (err) {
    console.error(err);
    const serverMsg = err?.response?.data?.message || err?.message || 'Lỗi khi xóa vé';
    showMessage(serverMsg, 'danger');
  }
}

function closeModal() { localShowModal.value = false; }

function onEventChange() {
  // when selectedEvent changes, load tickets for that event
  loadTickets(selectedEvent.value);
}



function refresh() { if (selectedEvent.value) loadTickets(selectedEvent.value); else loadTickets(); }

const groupedByType = computed(() => {
  let items = localTickets.value || [];
  if (selectedEvent.value) items = items.filter(t => Number(t.event_id) === Number(selectedEvent.value));
  if (typeFilter.value) items = items.filter(t => t.Type === typeFilter.value);
  if (statusFilter.value) items = items.filter(t => t.status === statusFilter.value);
  const groups = {};
  for (const t of items) {
    const k = t.Type || 'standard';
    if (!groups[k]) groups[k] = [];
    groups[k].push(t);
  }
  return groups;
});

onMounted(async () => { await Promise.all([loadEvents(), loadTickets()]); });
</script>

<style scoped></style>
