<template>
  <div class="container py-4">
    <h4 class="mb-4">Tạo Sự Kiện Mới</h4>

    <!-- Chi tiết sự kiện -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Chi Tiết Sự Kiện</h6>

        <div class="mb-3">
          <label class="form-label">Tiêu đề sự kiện</label>
          <input v-model="event.title" type="text" class="form-control" placeholder="Nhập tiêu đề" />
        </div>

        <div class="mb-3">
          <label class="form-label">Chi tiết sự kiện</label>
          <textarea v-model="event.description" class="form-control" rows="3"></textarea>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Ngày</label>
            <input v-model="event.date" type="date" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Giờ</label>
            <input v-model="event.time" type="time" class="form-control" />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Phân loại</label>
          <select v-model="event.category" class="form-select">
            <option>Âm nhạc</option>
            <option>Hội nghị</option>
            <option>Thể thao</option>
            <option>Nghệ thuật</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Địa chỉ -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Địa chỉ</h6>
        <div class="mb-3">
          <label class="form-label">Tên địa chỉ</label>
          <input v-model="event.address" type="text" class="form-control" />
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Thành phố</label>
            <input v-model="event.city" type="text" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Quận</label>
            <input v-model="event.district" type="text" class="form-control" />
          </div>
        </div>
      </div>
    </div>

    <!-- Thông tin vé bán (3 loại vé) -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Thông tin vé bán</h6>

        <div class="mb-3">
          <label class="form-label">Giá vé tiêu chuẩn (VNĐ)</label>
          <input v-model.number="event.standard_price" type="number" min="0" step="0.01" class="form-control" />
          <small class="text-muted">Vé học sinh = 1/2 giá tiêu chuẩn; Vé VIP = 200% giá tiêu chuẩn.</small>
        </div>

        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Vé học sinh (số lượng)</label>
            <input v-model.number="event.tickets.student" type="number" min="0" class="form-control" />
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
      <button class="btn btn-secondary">Lưu bản nháp</button>
      <button class="btn btn-outline-primary">Xem trước</button>
      <button class="btn btn-primary">Công bố sự kiện</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// event model updated to support three ticket types
const event = ref({
  title: "",
  description: "",
  date: "",
  time: "",
  category: "",
  address: "",
  city: "",
  district: "",
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

import { onBeforeUnmount } from 'vue';

// preview URL for selected image
const imagePreview = ref(null);
let currentPreviewUrl = null;

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

</style>
