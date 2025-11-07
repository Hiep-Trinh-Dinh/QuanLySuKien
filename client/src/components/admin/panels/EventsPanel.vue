<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Events</h4>
      <!-- <div>
        <button class="btn btn-sm btn-primary" @click="openAddEvent">+ Thêm sự kiện</button>
      </div> -->
    </div>

    <table class="table table-sm table-striped mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Category</th>
          <th>Venue</th>
          <th>Start</th>
          <th>Status</th>
          <th style="width: 160px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in eventsList" :key="e.id">
          <td>{{ e.id }}</td>
          <td>
            <div class="d-flex align-items-center">
              <img
                v-if="e.image_url"
                :src="e.image_url"
                alt="thumb"
                style="
                  width: 48px;
                  height: 40px;
                  object-fit: cover;
                  margin-right: 8px;
                  border-radius: 4px;
                "
              />
              <div>
                <div>{{ e.title }}</div>
                <div class="small text-muted">
                  {{
                    e.description
                      ? e.description.substr(0, 60) +
                        (e.description.length > 60 ? "..." : "")
                      : ""
                  }}
                </div>
              </div>
            </div>
          </td>
          <td>{{ e.category_name }}</td>
          <td>{{ e.venue_name }}</td>
          <td>{{ e.start_time }}</td>
          <td>{{ e.status }}</td>
          <td>
            <button
              class="btn btn-sm btn-outline-secondary me-2"
              @click="openEditEvent(e)"
            >
              Edit
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="confirmDeleteEvent(e.id)"
              :disabled="deleting === e.id || deleting === String(e.id)"
            >
              <span v-if="deleting === e.id || deleting === String(e.id)"
                >Deleting...</span
              >
              <span v-else>Delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="showEventModal"
      class="modal-backdrop d-flex align-items-start justify-content-center"
      style="
        position: fixed;
        inset: 0;
        z-index: 1050;
        overflow: auto;
        padding-top: 40px;
        background: rgba(0, 0, 0, 0.18);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      "
    >
      <div class="card" style="width: 900px; max-width: 95%">
        <div class="card-body">
          <h5 class="card-title">
            {{ isEditing ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới" }}
          </h5>
          <div class="row g-2">
            <div class="col-md-6">
              <label class="form-label">Title</label>
              <input v-model="eventForm.title" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Category</label>
              <select v-model="eventForm.category_id" class="form-select">
                <option :value="null">-- chọn --</option>
                <option v-for="c in categoriesList" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Description</label>
              <textarea
                v-model="eventForm.description"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label">Venue</label>
              <select v-model="eventForm.venue_id" class="form-select">
                <option :value="null">-- chọn --</option>
                <option v-for="v in venuesList" :key="v.id" :value="v.id">
                  {{ v.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Start</label>
              <input
                v-model="eventForm.start_time"
                type="datetime-local"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">End</label>
              <input
                v-model="eventForm.end_time"
                type="datetime-local"
                class="form-control"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Standard price</label>
              <input
                v-model.number="eventForm.standard_price"
                type="number"
                class="form-control"
              />
            </div>
            <div class="col-md-8">
              <label class="form-label">Image</label>
              <input
                type="file"
                class="form-control"
                @change="
                  (e) => {
                    eventForm.image_file = e.target.files[0];
                  }
                "
                accept="image/*"
              />
              <div class="mt-2">
                <img
                  v-if="eventForm.image_file"
                  :src="URL.createObjectURL(eventForm.image_file)"
                  alt="preview"
                  style="
                    max-height: 80px;
                    object-fit: cover;
                    border-radius: 6px;
                  "
                />
                <img
                  v-else-if="eventForm.image_url"
                  :src="eventForm.image_url"
                  alt="preview"
                  style="
                    max-height: 80px;
                    object-fit: cover;
                    border-radius: 6px;
                  "
                />
              </div>
            </div>
          </div>

          <div class="mt-3 d-flex justify-content-end">
            <button
              class="btn btn-secondary me-2"
              @click="() => (showEventModal = false)"
            >
              Hủy
            </button>
            <button class="btn btn-primary" @click="saveEvent">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  fetchEvents,
  getCategories,
  getVenues,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../../scripts/admin";

const eventsList = ref([]);
const categoriesList = ref([]);
const venuesList = ref([]);

const showEventModal = ref(false);
const isEditing = ref(false);
const deleting = ref(null);
const eventForm = reactive({
  id: null,
  title: "",
  description: "",
  category_id: null,
  venue_id: null,
  start_time: "",
  end_time: "",
  standard_price: 0,
  image_file: null,
  image_url: null,
});

function resetEventForm() {
  eventForm.id = null;
  eventForm.title = "";
  eventForm.description = "";
  eventForm.category_id = null;
  eventForm.venue_id = null;
  eventForm.start_time = "";
  eventForm.end_time = "";
  eventForm.standard_price = 0;
  eventForm.image_file = null;
  eventForm.image_url = null;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadEvents() {
  try {
    const res = await fetchEvents();
    eventsList.value = Array.isArray(res) ? res : res.events || res.data || [];
  } catch (err) {
    console.error("Failed to load events", err);
  }
}

async function loadCategoriesAndVenues() {
  try {
    const [cats, vens] = await Promise.all([getCategories(), getVenues()]);
    categoriesList.value = cats || [];
    venuesList.value = vens || [];
  } catch (err) {
    console.error("Failed to load cats/vens", err);
  }
}

function openAddEvent() {
  resetEventForm();
  isEditing.value = false;
  showEventModal.value = true;
}
function openEditEvent(ev) {
  isEditing.value = true;
  eventForm.id = ev.id;
  eventForm.title = ev.title || "";
  eventForm.description = ev.description || "";
  eventForm.category_id = ev.category_id || null;
  eventForm.venue_id = ev.venue_id || null;
  eventForm.start_time = ev.start_time
    ? ev.start_time.split(".").shift()
    : ev.start_time || "";
  eventForm.end_time = ev.end_time
    ? ev.end_time.split(".").shift()
    : ev.end_time || "";
  eventForm.standard_price = ev.standard_price || 0;
  eventForm.image_url = ev.image_url || null;
  eventForm.image_file = null;
  showEventModal.value = true;
}

async function saveEvent() {
  try {
    const payload = {
      title: eventForm.title,
      description: eventForm.description,
      category_id: eventForm.category_id,
      venue_id: eventForm.venue_id,
      start_time: eventForm.start_time,
      end_time: eventForm.end_time,
      standard_price: Number(eventForm.standard_price) || 0,
    };
    if (eventForm.image_file)
      payload.image_url = await fileToDataUrl(eventForm.image_file);
    else if (eventForm.image_url) payload.image_url = eventForm.image_url;
    if (isEditing.value && eventForm.id)
      await updateEvent(eventForm.id, payload);
    else await createEvent(payload);
    showEventModal.value = false;
    await loadEvents();
  } catch (err) {
    console.error("Failed to save event", err);
    alert("Lỗi khi lưu sự kiện. Xem console để biết chi tiết.");
  }
}

async function confirmDeleteEvent(id) {
  if (!confirm("Bạn có chắc muốn xóa sự kiện này?")) return;
  try {
    deleting.value = id;
    await deleteEvent(id);
    deleting.value = null;
    await loadEvents();
  } catch (err) {
    deleting.value = null;
    console.error("Failed to delete event", err);
    alert("Lỗi khi xóa sự kiện. Xem console để biết chi tiết.");
  }
}

onMounted(async () => {
  await Promise.all([loadEvents(), loadCategoriesAndVenues()]);
});
</script>

<style scoped></style>
