<template>
  <div class="container py-4">
    <div class="card mb-4 p-4 d-flex align-items-center flex-md-row">
      <img :src="user.avatar" class="rounded-circle me-4" alt="avatar" width="120" height="120" />
      <div class="flex-fill">
        <h4>Chào mừng quay trở lại, {{ user.username }}!</h4>
        <p class="mb-1"><strong>{{ user.displayName }}</strong> ({{ user.role }})</p>
      </div>
      <div class="d-flex gap-2 mt-3 mt-md-0">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal" @click="openEditModal">
          Chỉnh sửa hồ sơ
        </button>
      </div>
    </div>

    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content shadow-lg border-0 rounded-4">
          <div class="modal-header bg-primary text-white rounded-top-4">
            <h5 class="modal-title fw-semibold" id="editProfileLabel">Thay đổi Hồ sơ của bạn</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Đóng"></button>
          </div>

          <div class="modal-body p-4">
            <form class="row g-3" @submit.prevent="saveProfile">
              <div class="col-12 row gx-4">
                <div class="col-md-4 d-flex flex-column align-items-center">
                  <img :src="user.avatar" alt="preview" class="rounded-circle mb-3" style="width:110px;height:110px;object-fit:cover" />
                  <label class="form-label">Ảnh đại diện</label>
                  <input type="file" accept="image/*" @change="onAvatarFileChange" class="form-control form-control-sm" />
                  <small class="text-muted mt-2">Chọn ảnh để thay thế ảnh mặc định.</small>
                  <div v-if="isUploading" class="mt-2"><small class="text-primary">Đang tải ảnh lên...</small></div>
                </div>

                <div class="col-md-8">
                  <div class="row g-2">
                    <div class="col-12">
                      <label class="form-label">Tên đầy đủ</label>
                      <input type="text" class="form-control rounded-3" v-model="editFullName" />
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control rounded-3" v-model="editEmail" disabled />
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Số điện thoại</label>
                      <input type="tel" class="form-control rounded-3" v-model="editPhone" />
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Mật khẩu mới</label>
                      <input type="password" class="form-control rounded-3" v-model="newPassword" placeholder="Để trống nếu không đổi" />
                      <div class="form-text">Để trống nếu không muốn thay đổi mật khẩu. Tối thiểu 6 ký tự.</div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Nhập lại mật khẩu mới</label>
                      <input type="password" class="form-control rounded-3" v-model="confirmPassword" placeholder="Xác nhận mật khẩu" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary rounded-3 px-4" data-bs-dismiss="modal">Hủy bỏ</button>
            <button type="button" class="btn btn-primary rounded-3 px-4" @click="saveProfile" :disabled="isUploading">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Thông tin tài khoản</h6>
        <ul class="list-unstyled">
          <li class="mb-2"><i class="bi bi-envelope me-2"></i>{{ user.email }}</li>
          <li class="mb-2"><i class="bi bi-telephone me-2"></i>{{ user.phone }}</li>
        </ul>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <h6 class="mb-3">Sở thích</h6>
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" v-model="user.notifications" />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUser, updateUser } from "../../scripts/Profile.js";
import { useToast } from "vue-toastification";

const API_BASE = "http://localhost:3000";
const toast = useToast();

const user = ref({
  id: null, username: "", displayName: "", avatar: "", email: "", phone: "", address: "",
  role: "", notifications: true, interests: "Âm nhạc"
});

const events = ref([]);
const editFullName = ref("");
const editEmail = ref("");
const editPhone = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const avatarFile = ref(null);
const isUploading = ref(false);
const avatarPreviewUrl = ref(null);

function getStoredUserId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? parsed?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function loadUserAndEvents() {
  const uid = getStoredUserId();
  if (!uid) return;
  try {
    const data = await getUser(uid);
    if (!data) return;
    user.value.id = data.id ?? uid;
    user.value.username = data.username ?? user.value.username;
    user.value.displayName = data.full_name ?? user.value.displayName;
    user.value.avatar = data.avatar_url ?? data.avatar ?? user.value.avatar;
    user.value.email = data.email ?? user.value.email;
    user.value.phone = data.phone ?? user.value.phone;
    user.value.role = data.role ?? user.value.role;
    editFullName.value = user.value.displayName;
    editEmail.value = user.value.email;
    editPhone.value = user.value.phone;

    if (Array.isArray(data.events)) {
      events.value = data.events.map(e => ({ id: e.id, title: e.title, date: e.start_time ? new Date(e.start_time).toLocaleDateString() : "", reach: e.reach ?? "0 người đã tiếp cận" }));
    } else {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) {
        const all = await res.json();
        events.value = all.filter(e => String(e.created_by) === String(user.value.id)).map(e => ({ id: e.id, title: e.title, date: e.start_time ? new Date(e.start_time).toLocaleDateString() : "", reach: e.reach ?? "0 người đã tiếp cận" }));
      }
    }
  } catch (e) {}
}

function openEditModal() {
  editFullName.value = user.value.displayName || "";
  editEmail.value = user.value.email || "";
  editPhone.value = user.value.phone || "";
}

async function onAvatarFileChange(e) {
  const file = e.target?.files?.[0];
  if (!file) return;
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) { alert("Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB."); return; }
  avatarFile.value = file;
  const preview = URL.createObjectURL(file);
  avatarPreviewUrl.value = preview;
  user.value.avatar = preview;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updateLocalStorageWith(updated) {
  if (!updated || typeof updated !== "object") return;
  ['user', 'authUser'].forEach(key => {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") {
        if (obj.user && typeof obj.user === "object") {
          obj.user = { ...obj.user, ...updated };
          if (updated.avatar_url) obj.user.avatar = updated.avatar_url;
        } else {
          Object.assign(obj, updated);
          if (updated.avatar_url) obj.avatar = updated.avatar_url;
        }
        localStorage.setItem(key, JSON.stringify(obj));
      }
    } catch {}
  });
}

async function saveProfile() {
  if (!user.value.id) return;

  try {
    const payload = { username: user.value.username, full_name: editFullName.value, phone: editPhone.value };

    if (avatarFile.value) {
      isUploading.value = true;
      payload.avatar_data = await fileToDataUrl(avatarFile.value);
    }

    // handle password change: include password only if user provided and validated
    if (newPassword.value) {
      if (newPassword.value.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        toast.error('Mật khẩu xác nhận không khớp');
        return;
      }
      payload.password = newPassword.value;
    }

    console.log('Sending update-profile payload:', payload);
    const updated = await updateUser(user.value.id, payload);
    console.log('update-profile response:', updated);

    if (updated && typeof updated === "object") {
      if (updated.avatar_url) user.value.avatar = updated.avatar_url;
      user.value = { ...user.value, ...updated };
    } else {
      user.value.displayName = editFullName.value;
      user.value.phone = editPhone.value;
    }

    // cập nhật localStorage — bọc try/catch để lỗi ở đây không phá flow
    try {
      updateLocalStorageWith(updated || {
        username: user.value.username,
        full_name: user.value.displayName,
        phone: user.value.phone,
        avatar_url: user.value.avatar
      });
    } catch (lsErr) {
      console.warn('updateLocalStorageWith failed:', lsErr);
    }

  avatarFile.value = null;
  // clear password fields after successful update
  newPassword.value = '';
  confirmPassword.value = '';
    if (avatarPreviewUrl.value) {
      try { URL.revokeObjectURL(avatarPreviewUrl.value); } catch (e) {}
      avatarPreviewUrl.value = null;
    }

    await loadUserAndEvents();
    toast.success("Cập nhật hồ sơ hoàn tất.");
  } catch (err) {
    console.error('saveProfile error:', err);
    // Nếu axios trả lỗi có response.data.message thì hiển thị rõ
    const serverMsg = err?.response?.data?.message || err?.message || 'Lưu thất bại. Vui lòng thử lại.';
    toast.error(serverMsg, { timeout: 5000 });
  } finally {
    isUploading.value = false;
    const modalEl = document.getElementById("editProfileModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
      modal.hide();
    }
  }
}

onMounted(loadUserAndEvents);
</script>

<style scoped>
  /* .container .form-label,
  .card .form-label {
    text-align: left;
    display: block;
  } */
  /* Màu nền tổng thể */
.container {
  background: #f8f7ff;
}

/* CARD CHUNG */
.card {
  background: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 3px 14px rgba(108, 99, 255, 0.08);
}

/* CARD HEADER CHÍNH (avatar + chào mừng) */
.card.mb-4.p-4 {
  background: linear-gradient(135deg, #8d80ec, #b4a8ff, #f0d9ff);
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(108, 99, 255, 0.15);
}

/* Tiêu đề card */
.card h6 {
  font-weight: 600;
  color: #6c63ff;
}

/* Nút chính */
.btn-primary {
  background: #6c63ff !important;
  border-color: #6c63ff !important;
  border-radius: 10px;
  padding: 8px 18px;
  transition: 0.2s;
}
.btn-primary:hover {
  background: #5548c8 !important;
}

/* Nút viền */
.btn-outline-primary {
  color: #6c63ff;
  border-color: #6c63ff;
  border-radius: 10px;
}
.btn-outline-primary:hover {
  background: #ebe8ff;
}

/* Modal Header */
.modal-header.bg-primary {
  background: #6c63ff !important;
}

/* Input trong form */
.form-control,
.form-select {
  border-radius: 10px !important;
  border-color: #d0cdfa;
}
.form-control:focus,
.form-select:focus {
  border-color: #6c63ff;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.25);
}

/* Tab trong phần hoạt động */
.nav-tabs .nav-link {
  border-radius: 8px;
  margin-right: 6px;
  color: #6c63ff;
  border: 1px solid #d8d6fa;
}
.nav-tabs .nav-link.active {
  background: #6c63ff;
  color: #fff !important;
  border-color: #6c63ff;
}

/* Table */
.table thead th {
  background: #f1efff;
  color: #6c63ff;
  border-bottom: none;
}
.table tbody tr:hover {
  background: #f7f5ff;
}

/* Avatar trong card chính */
.card img.rounded-circle {
  border: 3px solid #6c63ff;
}
.nav-item {
  list-style: none;
}

.nav-link {
  background: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.25s;
  color: #5a4ae3; /* tím nhẹ */
}

/* Hover */
.nav-link:hover {
  background: #edeaff;
}

/* Active (đang được chọn) */
.nav-link.active {
  background: linear-gradient(135deg, #a79df1, #d9d3ff);
  color: #fff;
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.18);
}

/* Hover khi đang active (mềm nhẹ, không quá sáng) */
.nav-link.active:hover {
  background: linear-gradient(135deg, #9f95f0, #d2ccff);
}

</style>

