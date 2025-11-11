
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Venues</h4>
      <div><button class="btn btn-sm btn-primary" @click="openAddVenue">+ Thêm địa điểm</button></div>
    </div>
    <!-- inline message area -->
    <div v-if="message" :class="`alert alert-${messageType} mt-2`">{{ message }}</div>
    <table class="table table-sm table-striped mt-3">
      <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Capacity</th><th>Actions</th></tr></thead>
      <tbody>
  <tr v-for="v in localVenues" :key="v.id"><td>{{v.id}}</td><td>{{v.name}}</td><td>{{v.address}}</td><td>{{v.capacity}}</td><td><button class="btn btn-sm btn-outline-secondary me-2" @click="openEditVenue(v)">Edit</button><button class="btn btn-sm btn-outline-danger" :disabled="deleting===v.id || deleting===String(v.id)" @click="confirmDeleteVenue(v.id)"><span v-if="deleting===v.id || deleting===String(v.id)">Deleting...</span><span v-else>Delete</span></button></td></tr>
      </tbody>
    </table>

  <div v-if="localShowModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;background:rgba(0,0,0,0.18);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div class="card" style="width:700px;max-width:95%;">
        <div class="card-body">
          <h5 class="card-title">{{ localForm.id ? 'Chỉnh sửa địa điểm' : 'Tạo địa điểm mới' }}</h5>
          <div class="row g-2">
            <div class="col-md-6"><label class="form-label">Name</label><input v-model="localForm.name" class="form-control"/></div>
            <div class="col-md-6"><label class="form-label">Capacity</label><input v-model.number="localForm.capacity" class="form-control" type="number"/></div>
            <div class="col-12"><label class="form-label">Address</label><input v-model="localForm.address" class="form-control"/></div>
            <div class="col-12"><label class="form-label">Description</label><textarea v-model="localForm.description" class="form-control"></textarea></div>
          </div>
          <div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="closeModal">Hủy</button><button class="btn btn-primary" @click="submit">Lưu</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getVenues, createVenue, updateVenue, deleteVenue } from '../../../scripts/admin';

const localVenues = ref([]);
const localShowModal = ref(false);
const localForm = reactive({ id: null, name: '', address: '', description: '', capacity: 0 });
const message = ref('');
const messageType = ref('success');
const deleting = ref(null);

async function loadVenues() {
  try { const res = await getVenues(); localVenues.value = res || res.data || []; } catch (err) { console.error(err); }
}

function resetForm() { localForm.id = null; localForm.name = ''; localForm.address = ''; localForm.description = ''; localForm.capacity = 0; }
function openAddVenue() { resetForm(); localShowModal.value = true; }
function openEditVenue(v) { localForm.id = v.id; localForm.name = v.name; localForm.address = v.address; localForm.description = v.description; localForm.capacity = v.capacity; localShowModal.value = true; }

async function submit() {
  try {
    const payload = { name: localForm.name, address: localForm.address, description: localForm.description, capacity: localForm.capacity };
    let res;
    if (localForm.id) res = await updateVenue(localForm.id, payload);
    else res = await createVenue(payload);
    // show server message when available
    if (res && res.message) {
      message.value = res.message;
      messageType.value = 'success';
    } else {
      message.value = localForm.id ? 'Cập nhật địa điểm thành công' : 'Tạo địa điểm thành công';
      messageType.value = 'success';
    }
    setTimeout(() => { message.value = ''; }, 4000);
    localShowModal.value = false;
    await loadVenues();
  } catch (err) {
    console.error('Failed to save venue', err);
    const msg = err?.response?.data?.message || 'Lỗi khi lưu venue';
    message.value = msg;
    messageType.value = 'danger';
    setTimeout(() => { message.value = ''; }, 4000);
  }
}

async function confirmDeleteVenue(id) {
  if (!confirm('Xóa venue?')) return;
  try {
    deleting.value = id;
    const res = await deleteVenue(id);
    deleting.value = null;
    if (res && res.message) {
      message.value = res.message;
      messageType.value = 'success';
    } else {
      message.value = 'Xóa venue thành công';
      messageType.value = 'success';
    }
    setTimeout(() => { message.value = ''; }, 4000);
    await loadVenues();
  } catch (err) {
    deleting.value = null;
    console.error(err);
    const msg = err?.response?.data?.message || 'Lỗi khi xóa venue';
    message.value = msg;
    messageType.value = 'danger';
    setTimeout(() => { message.value = ''; }, 4000);
  }
}

function closeModal() { localShowModal.value = false; }

onMounted(loadVenues);
</script>

<style scoped></style>
