<template>
  <div class="mb-4">
    <h4>Thông tin sự kiện</h4>
    <span>Sự kiện: {{ event.title }}</span>
  </div>

  <div>
    <h4>Chi tiết sự kiện</h4>
    <div class="date-time d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="pi pi-calendar icon"></span>
        <div class="d-flex flex-column">
          <strong>Thời gian và giờ:</strong>
          <span class="text-secondary">
            {{ new Date(event.start_time).toLocaleDateString("vi-VN") }} •
            {{
              new Date(event.start_time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
            -
            {{
              new Date(event.end_time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </span>
        </div>
      </div>
    </div>

    <div class="location d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="pi pi-map-marker icon"></span>
        <div class="d-flex flex-column">
          <strong>Địa điểm:</strong>
          <span class="text-secondary"
            >{{ event.venue_name }} - {{ event.venue_address }}</span
          >
        </div>
      </div>
    </div>

    <div class="organizer d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="pi pi-user icon"></span>
        <div class="d-flex flex-column">
          <strong>Người tổ chức:</strong>
          <span class="text-secondary">{{ event.event_creator_name }}</span>
        </div>
      </div>
    </div>
  </div>

  <div>
    <h4>Mua vé</h4>
    <div class="card mb-3">
      <h5 class="card-header d-flex align-items-center">
        <span class="pi pi-ticket me-3 icon"></span>
        Vé
      </h5>
      <div class="card-body d-flex flex-column align-items-start">
        <h5 class="card-title">
          {{ event.price ? event.price + " VND" : "Liên hệ" }}
        </h5>
        <p class="card-text">
          Vé vào cửa chung với quyền tham dự tất cả các buổi biểu diễn
        </p>
        <router-link
          :to="{ name: 'TicketPayment', query: { event_id: event.id } }"
          class="btn btn-primary btn-custom"
        >
          Mua vé
        </router-link>
      </div>
    </div>
  </div>

  <div>
    <h4>Sự kiện tương tự</h4>
    <div class="row g-3">
      <div class="col-sm-4" v-for="e in similarEvent" :key="e.id">
        <div class="card h-100">
          <div class="card-body d-flex flex-column align-items-start">
            <span class="pi pi-tiktok icon mb-2"></span>
            <span class="card-title"
              >{{ new Date(e.start_time).toLocaleDateString("vi-VN") }} •
              {{
                new Date(e.start_time).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </span>
            <h6 class="card-text">{{ e.title }}</h6>
            <router-link
              :to="{ name: 'EventDetail', params: { id: e.id } }"
              class="btn btn-primary btn-custom mt-auto"
            >
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="mt-3">
    <button class="btn btn-share me-2">Share Event</button>
    <button class="btn btn-share">Add to Calendar</button>
  </div> -->
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getSimilarEvents } from "../../scripts/EventDetail";

const props = defineProps({
  event: { type: Object, required: true },
});

const similarEvent = ref([]);

const fetchSimilarEvents = async (categoryId, eventId) => {
  try {
    const res = await getSimilarEvents(categoryId, eventId);
    similarEvent.value = res || [];
  } catch (err) {
    console.error("Lỗi khi tải sự kiện tương tự:", err);
  }
};

// Khi component mount
onMounted(() => {
  if (props.event.category_id && props.event.id) {
    fetchSimilarEvents(props.event.category_id, props.event.id);
  }
});

// Khi event prop thay đổi
watch(
  () => props.event,
  (newEvent) => {
    if (newEvent.category_id && newEvent.id) {
      fetchSimilarEvents(newEvent.category_id, newEvent.id);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.icon {
  border-radius: 10px;
  background-color: rgb(224, 225, 226);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  color: #634aff;
}
.btn-custom {
  background-color: #634aff;
  color: #fff;
}
.btn-custom:hover {
  background-color: #5324e1;
}
</style>
