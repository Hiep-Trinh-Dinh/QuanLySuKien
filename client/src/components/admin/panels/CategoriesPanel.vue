<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Categories</h4>
      <div><button class="btn btn-sm btn-primary" @click="openAddCategory">+ Thêm danh mục</button></div>
    </div>
    <table class="table table-sm table-striped mt-3">
      <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="c in localCategories" :key="c.id"><td>{{c.id}}</td><td>{{c.name}}</td><td>{{c.description}}</td><td><button class="btn btn-sm btn-outline-secondary me-2" @click="openEditCategory(c)">Edit</button><button class="btn btn-sm btn-outline-danger" @click="confirmDeleteCategory(c.id)">Delete</button></td></tr>
      </tbody>
    </table>

  <div v-if="localShowModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;background:rgba(0,0,0,0.18);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div class="card" style="width:600px;max-width:95%;">
        <div class="card-body">
          <h5 class="card-title">{{ localForm.id ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới' }}</h5>
          <div class="row g-2">
            <div class="col-12"><label class="form-label">Name</label><input v-model="localForm.name" class="form-control"/></div>
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
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../scripts/admin';

const localCategories = ref([]);
const localShowModal = ref(false);
const localForm = reactive({ id: null, name: '', description: '' });

async function loadCategories() {
  try {
    const res = await getCategories();
    localCategories.value = Array.isArray(res) ? res : res.data || res || [];
  } catch (err) { console.error(err); }
}

function resetForm() { localForm.id = null; localForm.name = ''; localForm.description = ''; }
function openAddCategory() { resetForm(); localShowModal.value = true; }
function openEditCategory(c) { localForm.id = c.id; localForm.name = c.name; localForm.description = c.description; localShowModal.value = true; }

async function submit() {
  try {
    const payload = { name: localForm.name, description: localForm.description };
    if (localForm.id) await updateCategory(localForm.id, payload);
    else await createCategory(payload);
    localShowModal.value = false;
    await loadCategories();
  } catch (err) { console.error('Failed to save category', err); alert('Lỗi khi lưu category'); }
}

async function confirmDeleteCategory(id) { if (!confirm('Xóa category?')) return; try { await deleteCategory(id); await loadCategories(); } catch (err) { console.error(err); alert('Lỗi khi xóa category'); } }

function closeModal() { localShowModal.value = false; }

onMounted(loadCategories);
</script>

<style scoped></style>
