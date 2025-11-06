<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Users</h4>
      <div>
        <button class="btn btn-sm btn-primary" @click="openAddUser">+ Thêm user</button>
      </div>
    </div>

    <table class="table table-sm table-striped mt-3">
      <thead>
        <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
          <td>{{ u.created_at }}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary me-2" @click="openEditUser(u)">Edit</button>
            <button class="btn btn-sm btn-outline-danger" @click="confirmDeleteUser(u.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

  <div v-if="showUserModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;background:rgba(0,0,0,0.18);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div class="card" style="width:600px;max-width:95%;">
        <div class="card-body">
          <h5 class="card-title">{{ userForm.id ? 'Chỉnh sửa user' : 'Tạo user mới' }}</h5>
                <div class="row g-2">
                  <div class="col-md-6"><label class="form-label">Username</label><input v-model="userForm.username" class="form-control" /></div>
                  <div class="col-md-6"><label class="form-label">Email</label><input v-model="userForm.email" class="form-control" /></div>
                  <div class="col-md-6"><label class="form-label">Role</label><select v-model="userForm.role" class="form-select"><option value="user">user</option><option value="admin">admin</option></select></div>
                  <div class="col-md-6"><label class="form-label">Phone</label><input v-model="userForm.phone" class="form-control" /></div>
                  <div class="col-md-6"><label class="form-label">Password</label><input v-model="userForm.password" type="password" placeholder="(Để trống để tạo mật khẩu tạm)" class="form-control" /></div>
                  <div class="col-12"><label class="form-label">Full name</label><input v-model="userForm.full_name" class="form-control" /></div>
                </div>
          <div class="mt-3 d-flex justify-content-end">
            <button class="btn btn-secondary me-2" @click="() => (showUserModal = false)">Hủy</button>
            <button class="btn btn-primary" @click="saveUser">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getUsers, createUser, updateUser, deleteUser } from '../../../scripts/admin';

const users = ref([]);
const showUserModal = ref(false);
const userForm = reactive({ id: null, username: '', email: '', role: 'user', full_name: '', phone: '', password: '' });

function resetUserForm() { userForm.id = null; userForm.username = ''; userForm.email = ''; userForm.role = 'user'; userForm.full_name = ''; userForm.phone = ''; userForm.password = ''; }
function openAddUser() { resetUserForm(); showUserModal.value = true; }
function openEditUser(u) { userForm.id = u.id; userForm.username = u.username; userForm.email = u.email; userForm.role = u.role || 'user'; userForm.full_name = u.full_name; userForm.phone = u.phone; showUserModal.value = true; }

async function loadUsers() {
  try {
    const res = await getUsers({ limit: 200 });
    users.value = res.users || res.data || res || [];
  } catch (err) { console.error('Failed to load users', err); }
}

async function saveUser() {
  try {
    const payload = { username: userForm.username, email: userForm.email, role: userForm.role, full_name: userForm.full_name, phone: userForm.phone };
    // include password only when admin filled it
    if (userForm.password) payload.password = userForm.password;
    if (userForm.id) await updateUser(userForm.id, payload);
    else await createUser(payload);
    showUserModal.value = false;
    await loadUsers();
  } catch (err) { console.error('Failed to save user', err); alert('Lỗi khi lưu user'); }
}

async function confirmDeleteUser(id) {
  if (!confirm('Bạn có chắc muốn xóa user này?')) return;
  try { await deleteUser(id); await loadUsers(); } catch (err) { console.error(err); alert('Lỗi khi xóa user'); }
}

onMounted(() => loadUsers());
</script>

<style scoped></style>
