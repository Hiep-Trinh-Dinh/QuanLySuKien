<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Artists</h4>
      <div><button class="btn btn-sm btn-primary" @click="openAddArtist">+ Thêm artist</button></div>
    </div>

    <table class="table table-sm table-striped mt-3">
      <thead><tr><th>ID</th><th>Name</th><th>Avatar</th><th>Bio</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="a in artistsList" :key="a.id">
          <td>{{ a.id }}</td>
          <td>{{ a.name }}</td>
          <td><img v-if="a.avatar_url" :src="a.avatar_url" style="height:40px;width:40px;object-fit:cover;border-radius:4px"/></td>
          <td>{{ a.bio }}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary me-2" @click="openEditArtist(a)">Edit</button>
            <button class="btn btn-sm btn-outline-danger" @click="confirmDeleteArtist(a.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

  <div v-if="showArtistModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;background:rgba(0,0,0,0.18);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div class="card" style="width:700px;max-width:95%;">
        <div class="card-body">
          <h5 class="card-title">{{ artistForm.id ? 'Chỉnh sửa artist' : 'Tạo artist mới' }}</h5>
          <div class="row g-2">
            <div class="col-md-8"><label class="form-label">Name</label><input v-model="artistForm.name" class="form-control"/></div>
            <div class="col-md-4"><label class="form-label">Avatar</label><input type="file" class="form-control" @change="(e)=>{ artistForm.avatar_file = e.target.files[0]; }" accept="image/*"/></div>
            <div class="col-12"><label class="form-label">Bio</label><textarea v-model="artistForm.bio" class="form-control"></textarea></div>
          </div>
          <div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="() => (showArtistModal=false)">Hủy</button><button class="btn btn-primary" @click="saveArtist">Lưu</button></div>
        </div>
      </div>
    </div>

    <hr/>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <h4>Event Lineup</h4>
      <div class="d-flex">
        <select v-model="selectedEventForLineup" class="form-select me-2">
          <option :value="null">-- chọn event --</option>
          <option v-for="ev in eventsList" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
        </select>
        <button class="btn btn-sm btn-primary" @click="loadLineupForEvent">Load</button>
        <button class="btn btn-sm btn-outline-secondary ms-2" @click="openAddLineup">+ Thêm lineup</button>
      </div>
    </div>

    <table class="table table-sm table-striped mt-3">
      <thead><tr><th>ID</th><th>Artist</th><th>Performance time</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="l in lineupEntries" :key="l.id">
          <td>{{ l.id }}</td>
          <td>{{ l.artist_name }}</td>
          <td>{{ l.performance_time }}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary me-2" @click="openEditLineup(l)">Edit</button>
            <button class="btn btn-sm btn-outline-danger" @click="confirmDeleteLineup(l.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

  <div v-if="showLineupModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;background:rgba(0,0,0,0.18);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div class="card" style="width:600px;max-width:95%;">
        <div class="card-body">
          <h5 class="card-title">{{ lineupForm.id ? 'Chỉnh sửa lineup' : 'Thêm lineup mới' }}</h5>
          <div class="row g-2">
            <div class="col-md-6"><label class="form-label">Event</label><select v-model="lineupForm.event_id" class="form-select"><option :value="null">-- chọn --</option><option v-for="ev in eventsList" :key="ev.id" :value="ev.id">{{ev.title}}</option></select></div>
            <div class="col-md-6"><label class="form-label">Artist</label><select v-model="lineupForm.artist_id" class="form-select"><option :value="null">-- chọn --</option><option v-for="a in artistsList" :key="a.id" :value="a.id">{{a.name}}</option></select></div>
            <div class="col-12"><label class="form-label">Performance time</label><input v-model="lineupForm.performance_time" type="datetime-local" class="form-control"/></div>
          </div>
          <div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="() => (showLineupModal=false)">Hủy</button><button class="btn btn-primary" @click="saveLineup">Lưu</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getArtists, createArtist, updateArtist, deleteArtist, getEventLineup, createLineup, updateLineup, deleteLineup, fetchEvents } from '../../../scripts/admin';

const artistsList = ref([]);
const eventsList = ref([]);
const lineupEntries = ref([]);

const showArtistModal = ref(false);
const artistForm = reactive({ id: null, name: '', bio: '', avatar_file: null, avatar_url: null });

const selectedEventForLineup = ref(null);
const showLineupModal = ref(false);
const lineupForm = reactive({ id: null, event_id: null, artist_id: null, performance_time: '' });

function resetArtistForm() { artistForm.id = null; artistForm.name = ''; artistForm.bio = ''; artistForm.avatar_file = null; artistForm.avatar_url = null; }

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadArtists() {
  try { const res = await getArtists(); artistsList.value = res || res.data || []; } catch (err) { console.error('Failed to load artists', err); }
}

async function loadEvents() {
  try { const res = await fetchEvents(); eventsList.value = Array.isArray(res) ? res : res.events || res.data || []; } catch (err) { console.error('Failed to load events', err); }
}

async function loadLineupForEvent() {
  try {
    if (!selectedEventForLineup.value) { alert('Chọn event trước.'); return; }
    const res = await getEventLineup({ event_id: selectedEventForLineup.value });
    lineupEntries.value = res || [];
  } catch (err) { console.error('Failed to load lineup', err); }
}

function openAddArtist() { resetArtistForm(); showArtistModal.value = true; }
function openEditArtist(a) { artistForm.id = a.id; artistForm.name = a.name; artistForm.bio = a.bio; artistForm.avatar_file = null; artistForm.avatar_url = a.avatar_url || null; showArtistModal.value = true; }

async function saveArtist() {
  try {
    const payload = { name: artistForm.name, bio: artistForm.bio };
    if (artistForm.avatar_file) payload.avatar_url = await fileToDataUrl(artistForm.avatar_file);
    else if (artistForm.avatar_url) payload.avatar_url = artistForm.avatar_url;
    if (artistForm.id) await updateArtist(artistForm.id, payload); else await createArtist(payload);
    showArtistModal.value = false; await loadArtists();
  } catch (err) { console.error('Failed to save artist', err); alert('Lỗi khi lưu artist'); }
}

async function confirmDeleteArtist(id) { if (!confirm('Xóa artist?')) return; try { await deleteArtist(id); await loadArtists(); } catch (err) { console.error(err); alert('Lỗi khi xóa artist'); } }

function openAddLineup() { lineupForm.id = null; lineupForm.event_id = selectedEventForLineup.value || null; lineupForm.artist_id = null; lineupForm.performance_time = ''; showLineupModal.value = true; }
function openEditLineup(l) { lineupForm.id = l.id; lineupForm.event_id = l.event_id; lineupForm.artist_id = l.artist_id; lineupForm.performance_time = l.performance_time ? l.performance_time.split('.').shift() : ''; showLineupModal.value = true; }

async function saveLineup() {
  try {
    const payload = { event_id: lineupForm.event_id, artist_id: lineupForm.artist_id, performance_time: lineupForm.performance_time };
    if (lineupForm.id) await updateLineup(lineupForm.id, payload); else await createLineup(payload);
    showLineupModal.value = false;
    if (lineupForm.event_id) { selectedEventForLineup.value = lineupForm.event_id; await loadLineupForEvent(); }
  } catch (err) { console.error('Failed to save lineup', err); alert('Lỗi khi lưu lineup'); }
}

async function confirmDeleteLineup(id) { if (!confirm('Xóa lineup entry?')) return; try { await deleteLineup(id); await loadLineupForEvent(); } catch (err) { console.error(err); alert('Lỗi khi xóa lineup'); } }

onMounted(async () => { await Promise.all([loadArtists(), loadEvents()]); });
</script>

<style scoped></style>
