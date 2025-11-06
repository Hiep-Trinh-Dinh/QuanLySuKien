<template>
  <div class="container py-4">
    <h4 class="mb-4">Tạo Sự Kiện Mới</h4>

    <!-- Chi tiết sự kiện -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Chi Tiết Sự Kiện</h6>

        <div class="mb-3">
          <label class="form-label">Tiêu đề sự kiện</label>
          <input v-model="event.title" type="text" class="form-control" placeholder="Nhập tiêu đề" data-field="title" />
          <div v-if="errors.title" class="text-danger small mt-1">{{ errors.title }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Chi tiết sự kiện</label>
          <textarea v-model="event.description" class="form-control" rows="3"></textarea>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Ngày bắt đầu</label>
            <input v-model="event.start_time" type="datetime-local" class="form-control" data-field="start_time" />
            <div v-if="errors.start_time" class="text-danger small mt-1">{{ errors.start_time }}</div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Ngày kết thúc</label>
            <input v-model="event.end_time" type="datetime-local" class="form-control" data-field="end_time" />
            <div v-if="errors.end_time" class="text-danger small mt-1">{{ errors.end_time }}</div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Phân loại</label>
          <select v-model="event.category_id" class="form-select" data-field="category_id">
            <option value="" disabled>-- Chọn phân loại --</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <div v-if="errors.category_id" class="text-danger small mt-1">{{ errors.category_id }}</div>
        </div>
      </div>
    </div>

    <!-- Địa chỉ -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Địa chỉ</h6>
        <div class="mb-3">
          <select v-model="event.venue_id" class="form-select" data-field="venue_id">
            <option value="" disabled>-- Chọn địa điểm --</option>
            <option v-for="v in venues" :key="v.id" :value="v.id">{{ v.name }} - {{ v.address }}</option>
          </select>
          <div v-if="errors.venue_id" class="text-danger small mt-1">{{ errors.venue_id }}</div>
        </div>
      </div>
    </div>

    <!-- Thông tin vé bán (3 loại vé) -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Thông tin vé bán</h6>

        <div class="mb-3">
          <label class="form-label">Giá vé tiêu chuẩn (VNĐ)</label>
          <input v-model.number="event.standard_price" type="number" min="0" step="0.01" class="form-control" data-field="standard_price" />
          <div v-if="errors.standard_price" class="text-danger small mt-1">{{ errors.standard_price }}</div>
          <small class="text-muted">Vé học sinh = 1/2 giá tiêu chuẩn; Vé VIP = 200% giá tiêu chuẩn.</small>
        </div>

        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Vé học sinh (số lượng)</label>
            <input v-model.number="event.tickets.student" type="number" min="0" class="form-control" data-field="tickets" />
            <div v-if="errors.tickets" class="text-danger small mt-1">{{ errors.tickets }}</div>
            <div class="mt-1">
              <span class="me-2">Giá:</span>
              <span class="badge price-badge bg-info">{{ studentPriceDisplay }}</span>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <label class="form-label">Vé tiêu chuẩn (số lượng)</label>
            <input v-model.number="event.tickets.standard" type="number" min="0" class="form-control" />
            <div class="mt-1">
              <span class="me-2">Giá:</span>
              <span class="badge price-badge bg-primary">{{ standardPriceDisplay }}</span>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <label class="form-label">Vé VIP (số lượng)</label>
            <input v-model.number="event.tickets.vip" type="number" min="0" class="form-control" />
            <div class="mt-1">
              <span class="me-2">Giá:</span>
              <span class="badge price-badge bg-warning text-dark">{{ vipPriceDisplay }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload hình -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Tải Lên Hình Ảnh Sự Kiện</h6>
        <input type="file" class="form-control" accept="image/*" @change="handleFileUpload" />
        <div v-if="imagePreview" class="mt-3">
          <label class="form-label">Xem trước ảnh</label>
          <div>
            <img :src="imagePreview" alt="preview" style="max-width:320px; max-height:240px; object-fit:cover; border-radius:6px;" />
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="d-flex gap-2 justify-content-end">
      <button type="button" class="btn btn-secondary" @click="saveDraft">Lưu bản nháp</button>
      <button type="button" class="btn btn-outline-primary" @click="preview">Xem trước</button>
      <button type="button" class="btn btn-primary" @click="publishEvent">Công bố sự kiện</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import { createEvent, getVenues, getCategories } from "../../scripts/admin.js";

// event model updated to support three ticket types
const event = ref({
  title: "",
  description: "",
  // start_time and end_time are required for an event
  start_time: "",
  end_time: "",
  // category_id references categories.id from backend
  category_id: null,
  address: "",
  city: "",
  district: "",
  // selected venue id (from backend venues list)
  venue_id: null,
  // standard price is the base price
  standard_price: 0,
  // ticket quantities per type
  tickets: {
    student: 0,
    standard: 0,
    vip: 0,
  },
  image: null,
});

// reactive errors map for field-level validation messages
const errors = ref({});

// computed derived prices
const studentPrice = computed(() => {
  const p = Number(event.value.standard_price) || 0;
  return +(p * 1 / 2);
});
const vipPrice = computed(() => {
  const p = Number(event.value.standard_price) || 0;
  return +(p * 2);
});

// formatted display helpers for UI
function formatCurrency(v) {
  const n = Number(v) || 0;
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}
const standardPriceDisplay = computed(() => formatCurrency(event.value.standard_price));
const studentPriceDisplay = computed(() => formatCurrency(studentPrice.value));
const vipPriceDisplay = computed(() => formatCurrency(vipPrice.value));

// preview URL for selected image
const imagePreview = ref(null);
let currentPreviewUrl = null;

// venues & categories fetched from backend
const venues = ref([]);
const categories = ref([]);

onMounted(async () => {
  try {
    venues.value = await getVenues();
  } catch (err) {
    console.error('Không lấy được danh sách venues:', err);
  }
  try {
    categories.value = await getCategories();
  } catch (err) {
    console.error('Không lấy được danh sách categories:', err);
  }
});

// when venue_id changes, autofill address/city/district if available
watch(() => event.value.venue_id, (vid) => {
  if (!vid) return;
  const v = venues.value.find(x => String(x.id) === String(vid));
  if (v) {
    event.value.address = v.address || '';
    event.value.city = v.city || v.town || '';
    event.value.district = v.district || '';
  }
});

const handleFileUpload = (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  // revoke previous preview URL
  if (currentPreviewUrl) {
    try { URL.revokeObjectURL(currentPreviewUrl); } catch (e) {}
    currentPreviewUrl = null;
    imagePreview.value = null;
  }

  event.value.image = file;
  currentPreviewUrl = URL.createObjectURL(file);
  imagePreview.value = currentPreviewUrl;
};

onBeforeUnmount(() => {
  if (currentPreviewUrl) {
    try { URL.revokeObjectURL(currentPreviewUrl); } catch (e) {}
  }
});


async function publishEvent() {
  const fieldErrors = validateEvent(true);
  if (Object.keys(fieldErrors).length) {
    await scrollToFirstError();
    return;
  }

  // Build payload and include image data URL if a File is selected so the logged
  // payload matches what will be sent to the server.
  const payload = buildEventPayload();
  if (event.value.image instanceof File) {
    try {
      payload.image_url = await fileToDataUrl(event.value.image);
    } catch (e) {
      console.warn('Không thể đọc file ảnh để kèm vào payload:', e);
    }
  }
  console.log('Publish payload:', payload);
  try {
    await sendEvent(payload, { publish: true });
    alert('Sự kiện đã được công bố thành công.');
  } catch (err) {
    console.error(err);
    alert('Công bố sự kiện thất bại. Kiểm tra console để biết thêm chi tiết.');
  }
}

function buildEventPayload() {
  // create a minimal payload to send to backend
  return {
    title: event.value.title,
    description: event.value.description,
    start_time: event.value.start_time,
    end_time: event.value.end_time,
    // server expects: category_id, venue_id, created_by, image_url
    category_id: event.value.category_id,
    venue_id: event.value.venue_id,
    created_by: 1, // placeholder admin id — replace with authenticated user id when available
    image_url: null,
    // include standard_price and tickets breakdown so backend can create tickets if desired
    standard_price: Number(event.value.standard_price) || 0,
    tickets: buildTicketsArray(), // array of individual ticket objects
  };
}

// Build an array of individual ticket objects based on the quantities entered
// Each ticket object: { event_id: null, type: 'student'|'standard'|'vip', price: number, status: 'available' }
function buildTicketsArray() {
  const list = [];
  const stdPrice = Number(event.value.standard_price) || 0;
  const prices = {
    student: Math.round((stdPrice * 1 / 2) || 0),
    standard: Math.round(stdPrice || 0),
    vip: Math.round((stdPrice * 2) || 0),
  };

  const addN = (type, qty) => {
    qty = Number(qty) || 0;
    for (let i = 0; i < qty; i++) {
      list.push({
        event_id: null, // will be set by backend after event is created
        type: type,
        price: prices[type],
        status: 'available'
      });
    }
  };

  addN('Student', event.value.tickets.student);
  addN('Standard', event.value.tickets.standard);
  addN('VIP', event.value.tickets.vip);

  return list;
}

// Validation: when fullCheck=true enforce required fields for publishing
function validateEvent(fullCheck = false) {
  const errObj = {};
  if (!event.value.title || !event.value.title.trim()) errObj.title = 'Tiêu đề là bắt buộc.';
  if (fullCheck) {
  if (!event.value.venue_id) errObj.venue_id = 'Vui lòng chọn địa điểm.';
    if (!event.value.start_time) errObj.start_time = 'Ngày bắt đầu là bắt buộc.';
    if (!event.value.end_time) errObj.end_time = 'Ngày kết thúc là bắt buộc.';
    if (event.value.start_time && event.value.end_time) {
      const s = new Date(event.value.start_time);
      const e = new Date(event.value.end_time);
      if (!(s < e)) errObj.start_time = 'Ngày bắt đầu phải trước ngày kết thúc.';
    }
  if (!event.value.category_id) errObj.category_id = 'Vui lòng chọn phân loại.';
    const std = Number(event.value.standard_price) || 0;
    if (std < 0) errObj.standard_price = 'Giá tiêu chuẩn phải >= 0.';
    const totalTickets = Number(event.value.tickets.student || 0) + Number(event.value.tickets.standard || 0) + Number(event.value.tickets.vip || 0);
    if (totalTickets <= 0) errObj.tickets = 'Phải có ít nhất 1 vé.';
  }
  errors.value = errObj;
  return errObj;
}

// Scroll to first field that has an error (preferred order)
async function scrollToFirstError() {
  await nextTick();
  const keys = Object.keys(errors.value);
  if (!keys.length) return;
  const order = ['title','start_time','end_time','category_id','standard_price','tickets'];
  // include venue_id in order if present
  if (errors.value.venue_id && !order.includes('venue_id')) order.push('venue_id');
  const firstKey = order.find(k => keys.includes(k)) || keys[0];
  const selector = `[data-field="${firstKey}"]`;
  const el = document.querySelector(selector) || document.querySelector('[data-field]');
  if (el && typeof el.scrollIntoView === 'function') {
    try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}
  }
  if (el && typeof el.focus === 'function') {
    try { el.focus(); } catch(e) {}
  }
}

// sendEvent: prepare FormData if image File present, else send JSON
async function sendEvent(payload, { publish = false } = {}) {
  try {
    // The server expects `image_url` (string). If caller already attached a
    // data-URL to `payload.image_url`, use it. Otherwise, convert File -> data URL
    // here (backwards-compatible).
    let dataToSend = { ...payload };
    if (!dataToSend.image_url && event.value.image instanceof File) {
      // convert file to data URL
      const dataUrl = await fileToDataUrl(event.value.image);
      console.log('Converted image file to data URL for upload:', dataUrl);
      dataToSend.image_url = dataUrl;
    }
    // include publish flag
    dataToSend.publish = publish ? 1 : 0;

    const res = await createEvent(dataToSend);
    return res;
  } catch (err) {
    throw err;
  }
}

// Helper: convert File/Blob to data URL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
</script>

<style scoped>
/* giữ giao diện gọn, responsive */
img { display:block; max-height:140px; object-fit:cover; }

/* price badge styling */
.price-badge{
  font-size: 0.95rem;
  padding: 0.45rem 0.6rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

/* Fix label alignment when global styles set text-align:center */
.container .form-label,
.card .form-label {
  text-align: left;
  display: block;
}

</style>
