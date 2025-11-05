<script setup>
import { ref, watch, onMounted } from "vue";
const props = defineProps({ event: { type: Object, required: false } });
const lineup = ref([]);
const tickets = ref([]);
const loadingLineup = ref(false);
const loadingTickets = ref(false);
async function fetchLineup() {
  if (!props.event?.id) return;
  loadingLineup.value = true;
  try {
    const res = await fetch(
      `http://localhost:3000/event-lineup?event_id=${props.event.id}`
    );
    lineup.value = res.ok ? await res.json() : [];
  } catch (e) {
    lineup.value = [];
  }
  loadingLineup.value = false;
}
async function fetchTickets() {
  if (!props.event?.id) return;
  loadingTickets.value = true;
  try {
    const res = await fetch(
      `http://localhost:3000/tickets?event_id=${props.event.id}`
    );
    tickets.value = res.ok ? await res.json() : [];
  } catch (e) {
    tickets.value = [];
  }
  loadingTickets.value = false;
}
watch(
  () => props.event?.id,
  () => {
    fetchLineup();
    fetchTickets();
  },
  { immediate: true }
);
onMounted(() => {
  fetchLineup();
  fetchTickets();
});
</script>
<template>
  <div class="mb-4">
    <h4>Nghệ sĩ nổi bật</h4>
    <div class="row">
      <div v-for="artist in lineup" :key="artist.id" class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h4 class="icon">
              <img
                v-if="artist.avatar_url"
                :src="artist.avatar_url"
                class="rounded"
                style="width: 32px; height: 32px; object-fit: cover"
              />
              <span v-else class="pi pi-user"> </span>
            </h4>
            <h4 class="card-text">{{ artist.artist_name }}</h4>
            <span class="card-title text-custom">
              {{
                artist.performance_time
                  ? new Date(artist.performance_time).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Chưa cập nhật"
              }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="lineup.length === 0" class="col-12 text-secondary">
        Chưa có nghệ sĩ cho sự kiện này.
      </div>
    </div>
  </div>
  <div class="mb-4">
    <h4 class="mb-3">Event Schedule</h4>
    <div v-if="loadingLineup" class="text-secondary py-2">
      Đang tải lịch biểu diễn...
    </div>
    <template v-else-if="lineup.length > 0">
      <div
        v-for="artist in lineup"
        :key="artist.id + ':row'"
        class="row align-items-center"
      >
        <div class="col-sm">
          <span class="pi pi-clock"></span>
          <span>
            {{
              new Date(artist.performance_time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}</span
          >
        </div>
        <div class="col-sm">{{ artist.artist_name }}</div>
        <div class="col-sm">{{ artist.stage_name || "Main Stage" }}</div>
      </div>
      <hr
        v-for="artist in lineup.slice(0, lineup.length - 1)"
        :key="artist.id + ':hr'"
      />
    </template>
    <div v-else class="text-secondary">Sự kiện chưa có lịch biểu diễn.</div>
  </div>
  <div class="mb-4">
    <h4>Ticket Options</h4>
    <div v-if="loadingTickets" class="text-secondary py-2">
      Đang tải danh sách vé...
    </div>
    <template v-else-if="tickets.length > 0">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="d-flex flex-column mb-3"
      >
        <div class="d-flex flex-grow-0">
          <span class="icon-square">
            <span class="pi pi-ticket"></span>
          </span>
          <div class="d-flex flex-column">
            <strong> Ghế/Vé: {{ ticket.seat_number || "Không rõ" }} </strong>
            <span class="text-secondary"
              >Giá: {{ ticket.price.toLocaleString("vi-VN") }} VND
            </span>
            <span class="text-secondary">Tình trạng: {{ ticket.status }}</span>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="text-secondary">Hiện chưa có vé hoặc chưa cập nhật.</div>
    <!-- <button class="btn btn-buy">Buy Tickets</button>

    <button class="btn btn-share">Share Event</button> -->
  </div>
  <router-link
    :to="{ name: 'TicketPayment', query: { event_id: event.id } }"
    class="btn btn-buy btn-custom"
  >
    Mua vé
  </router-link>
</template>
<style>
.icon {
  border-radius: 100%;
  background-color: #d1cfcf;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
}
.icon-square {
  border-radius: 10px;
  background-color: #d1cfcf;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  color: #7c3aed;
  margin-right: 5px;
}
.text-custom {
  font-size: 0.8rem;
  color: rgba(112, 112, 112, 0.574);
}
.btn-buy {
  border-radius: 10px !important;
  background-color: #7c3aed !important;
  color: white !important;
}
.btn-buy:hover {
  background-color: #6631c1 !important;
}
.btn-share {
  border-radius: 10px !important;
  background-color: rgba(197, 196, 196, 0.663) !important ;
  color: #7c3aed !important;
  margin-left: 20px;
}
.btn-share:hover {
  background-color: rgba(152, 151, 151, 0.663) !important ;
}
</style>
