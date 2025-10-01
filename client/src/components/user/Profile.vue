<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="card mb-4 p-4 d-flex align-items-center flex-md-row">
      <img
        :src="user.avatar"
        class="rounded-circle me-4"
        alt="avatar"
        width="120"
        height="120"
      />
      <div class="flex-fill">
        <h4>Chào mừng quay trở lại, {{ user.username }}!</h4>
        <p class="mb-1">
          <strong>{{ user.username }}</strong> ({{ user.rank }})
        </p>
        <small class="text-muted">{{ user.points }} Điểm Danh Dự</small>
      </div>
      <div class="d-flex gap-2 mt-3 mt-md-0">
        <!-- <button class="btn btn-primary btn-sm">Chỉnh sửa hồ sơ</button> -->
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#editProfileModal"
        >
          Chỉnh sửa hồ sơ
        </button>
        <button class="btn btn-outline-primary btn-sm">
          Thay đổi ảnh đại diện
        </button>
      </div>
    </div>

    <!-- Modal chỉnh sửa hồ sơ -->
    <div
      class="modal fade"
      id="editProfileModal"
      tabindex="-1"
      aria-labelledby="editProfileLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content shadow-lg border-0 rounded-4">
          <!-- Header -->
          <div class="modal-header bg-primary text-white rounded-top-4">
            <h5 class="modal-title fw-semibold" id="editProfileLabel">
              Thay đổi Hồ sơ của bạn
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Đóng"
            ></button>
          </div>

          <!-- Body -->
          <div class="modal-body p-4">
            <form class="row g-3">
              <div class="col-12">
                <label class="form-label">Tên đầy đủ</label>
                <input
                  type="text"
                  class="form-control rounded-3"
                  value="dn1fu"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control rounded-3"
                  value="toiyeufigma@gmail.com"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  class="form-control rounded-3"
                  value="+84 989898989"
                />
              </div>
              <div class="col-12">
                <label class="form-label">Địa chỉ</label>
                <input
                  type="text"
                  class="form-control rounded-3"
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div class="col-12">
                <label class="form-label">Bio</label>
                <textarea class="form-control rounded-3" rows="3">
Kể cho chúng tôi về bạn...</textarea
                >
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-outline-secondary rounded-3 px-4"
              data-bs-dismiss="modal"
            >
              Hủy bỏ
            </button>
            <button type="button" class="btn btn-primary rounded-3 px-4">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Thông tin tài khoản -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Thông tin tài khoản</h6>
        <ul class="list-unstyled">
          <li class="mb-2">
            <i class="bi bi-envelope me-2"></i>
            {{ user.email }}
          </li>
          <li class="mb-2">
            <i class="bi bi-telephone me-2"></i>
            {{ user.phone }}
          </li>
          <li>
            <i class="bi bi-geo-alt me-2"></i>
            {{ user.address }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Sở thích -->
    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Sở thích</h6>
        <div class="form-check form-switch mb-3">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="user.notifications"
          />
          <label class="form-check-label">Thông báo qua tin nhắn</label>
        </div>
        <div>
          <label class="form-label">Lĩnh vực sự kiện</label>
          <select v-model="user.interests" class="form-select">
            <option>Âm nhạc</option>
            <option>Thể thao</option>
            <option>Gameshow</option>
            <option>Nghệ thuật</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Hoạt động -->
    <div class="card">
      <div class="card-body">
        <h6 class="mb-3">Hoạt động</h6>
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button class="nav-link active">Sự kiện đã tạo</button>
          </li>
          <li class="nav-item">
            <button class="nav-link">Sự kiện đã kết thúc</button>
          </li>
          <li class="nav-item">
            <button class="nav-link">Sự kiện đã lưu</button>
          </li>
        </ul>

        <table class="table">
          <thead>
            <tr>
              <th>Tên sự kiện</th>
              <th>Ngày</th>
              <th>Tiếp cận</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.title }}</td>
              <td>{{ event.date }}</td>
              <td>{{ event.reach }}</td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-outline-primary btn-sm">View All Events</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const user = ref({
  username: "dn1fu",
  rank: "Crown",
  points: 360,
  avatar: "https://via.placeholder.com/120x120.png?text=Avatar",
  email: "toiyeufigma@gmail.com",
  phone: "+84 123456789",
  address: "Hồ Chí Minh, Việt Nam",
  notifications: true,
  interests: "Âm nhạc",
});

const events = ref([
  {
    id: 1,
    title: "Summer Music Festival",
    date: "Jul 15, 2023",
    reach: "+1M người đã tiếp cận",
  },
  {
    id: 2,
    title: "Tech Conference 2023",
    date: "Aug 22, 2023",
    reach: "+500K người đã tiếp cận",
  },
  {
    id: 3,
    title: "Food & Wine Festival",
    date: "Sep 10, 2023",
    reach: "+300K người đã tiếp cận",
  },
]);
</script>
