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

    <!-- Thông tin vé bán -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Thông tin vé bán</h6>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Giá vé</label>
            <input v-model="event.price" type="number" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Số lượng vé</label>
            <input v-model="event.quantity" type="number" class="form-control" />
          </div>
        </div>

        <div class="form-check mb-2">
          <input v-model="event.freeTicket" class="form-check-input" type="checkbox" id="freeTicket" />
          <label class="form-check-label" for="freeTicket">Sự kiện miễn phí</label>
        </div>
        <div class="form-check mb-2">
          <input v-model="event.refundable" class="form-check-input" type="checkbox" id="refundable" />
          <label class="form-check-label" for="refundable">Vé có thể hoàn trả</label>
        </div>
      </div>
    </div>

    <!-- Upload hình -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Tải Lên Hình Ảnh Sự Kiện</h6>
        <input type="file" class="form-control" @change="handleFileUpload" />
      </div>
    </div>

    <!-- Thông tin thêm -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Thông tin thêm</h6>
        <div class="form-check mb-2">
          <input v-model="event.online" class="form-check-input" type="checkbox" id="online" />
          <label class="form-check-label" for="online">Sự kiện trực tuyến</label>
        </div>
        <div class="form-check mb-2">
          <input v-model="event.promote" class="form-check-input" type="checkbox" id="promote" />
          <label class="form-check-label" for="promote">Quảng cáo sự kiện</label>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="d-flex gap-2">
      <button class="btn btn-secondary">Lưu bản nháp</button>
      <button class="btn btn-outline-primary">Xem trước</button>
      <button class="btn btn-primary">Công bố sự kiện</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const event = ref({
  title: "",
  description: "",
  date: "",
  time: "",
  category: "",
  address: "",
  city: "",
  district: "",
  price: 0,
  quantity: 0,
  freeTicket: false,
  refundable: false,
  image: null,
  online: false,
  promote: false,
});

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    event.value.image = file;
  }
};
</script>
