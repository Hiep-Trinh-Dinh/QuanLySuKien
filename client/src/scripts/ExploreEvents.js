import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Fetch events utility
export async function fetchEvents(eventsRef) {
  try {
    const res = await axios.get('http://localhost:3000/events');
    eventsRef.value = res.data;
  } catch (err) {
    eventsRef.value = [];
  }
}

// Fetch categories utility
export async function fetchCategories(categoriesRef) {
  try {
    const res = await axios.get('http://localhost:3000/categories');
    categoriesRef.value = res.data;
  } catch (e) {
    categoriesRef.value = [];
  }
}

export function useExploreEvents() {
  const events = ref([]);
  const categories = ref([]);
  const searchText = ref('');
  const selectedCategoryId = ref(null);

  onMounted(() => {
    fetchEvents(events);
    fetchCategories(categories);
  });

  const filteredSortedEvents = computed(() => {
    const term = searchText.value.trim().toLowerCase();
    // nếu không nhập từ khóa thì trả toàn bộ, sắp theo thời gian
    let list = !term ? events.value : events.value.filter(e => {
      const title = (e.title || '').toLowerCase();
      const dateISO = new Date(e.start_time).toISOString().slice(0,10); // yyyy-mm-dd
      const dateVI = new Date(e.start_time).toLocaleDateString('vi-VN'); // dd/mm/yyyy
      return title.includes(term) || dateISO.includes(term) || dateVI.includes(term);
    });
    // lọc theo category nếu có chọn
    if (selectedCategoryId.value) {
      list = list.filter(e => Number(e.category_id) === Number(selectedCategoryId.value));
    }
    return [...list].sort((a,b) => new Date(a.start_time) - new Date(b.start_time));
  });

  return {
    events,
    categories,
    searchText,
    selectedCategoryId,
    setCategory: (catId) => { selectedCategoryId.value = catId },
    filteredSortedEvents,
  }
}