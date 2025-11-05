<script lang="ts">
import Map from "../Map.vue";
import "../../assets/css/global.css";
import { useRoute } from "vue-router";
export default {
  name: "Venue",
  props: {
    venue: { type: Object, required: false },
  },
  components: { Map },
  data() {
    const route = useRoute();
    return {
      eventId: route.params.id, // đưa vào data để template truy cập được
    };
  },
};
</script>
<template>
  <h4>Venue Information</h4>
  <span v-if="venue"> {{ venue.venue_name }} - {{ venue.venue_address }} </span>
  <span v-else> Chưa có thông tin địa điểm cụ thể. </span>

  <h5 class="mt-3">Location & Directions</h5>
  <Map v-if="venue && venue.venue_address" :address="venue.venue_address" />
  <span v-else class="text-secondary">Đang tải địa chỉ sự kiện...</span>
  <span class="fw-bold">
    Address: {{ venue?.venue_address || "Chưa có địa chỉ sự kiện" }}
  </span>
  <div class="mt-3">
    <h5>Getting there</h5>
    <div class="d-flex mb-3">
      <div class="me-3 icon-square">
        <span class="pi pi-car"></span>
      </div>
      <div>
        <span class="fw-bold">By Taxi</span>
        <br />
        <span class="text-secondary"
          >By Taxi Available throughout the city, approximately 15-20 minutes
          from major hotels</span
        >
      </div>
    </div>
    <div class="d-flex mb-3">
      <div class="me-3 icon-square">
        <span class="pi bi-bus-front"></span>
      </div>
      <div>
        <span class="fw-bold">Public Transport </span>
        <br />
        <span class="text-secondary"
          >Bus routes 2, 9, 14, 18, 23 stop within walking distance</span
        >
      </div>
    </div>
    <div class="d-flex mb-3">
      <div class="me-3 icon-square">
        <span class="bi bi-p-circle"></span>
      </div>
      <div>
        <span class="fw-bold">Parking </span>
        <br />
        <span class="text-secondary"
          >Limited parking available nearby, early arrival recommended
        </span>
      </div>
    </div>
  </div>
  <div class="mb-3">
    <h5>Venue Layout</h5>
    <div class="row d-flex">
      <div class="col-sm-6 d-flex">
        <div class="card flex-fill">
          <div class="card-body">
            <h4 class="icon">
              <span class="bi bi-list-stars"> </span>
            </h4>
            <h4 class="card-text">Main Stage</h4>
            <span class="card-title text-secondary">
              Located in the grand hall with seating for 600 guests. Features
              state-of-the-art sound system and lighting.
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-6 d-flex">
        <div class="card flex-fill">
          <div class="card-body">
            <h4 class="icon">
              <span class="bi bi-tree-fill"> </span>
            </h4>
            <h4 class="card-text">Garden Stage</h4>
            <span class="card-title text-secondary">
              Outdoor area in the venue's courtyard. Standing room for 300 with
              ambient lighting.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <h5>Amenities</h5>
    <div class="row d-flex">
      <div class="col-sm-4 d-flex">
        <div class="card flex-fill">
          <div class="card-body">
            <h4 class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-fork-knife"
                viewBox="0 0 16 16"
              >
                <path
                  d="M13 .5c0-.276-.226-.506-.498-.465-1.703.257-2.94 2.012-3 8.462a.5.5 0 0 0 .498.5c.56.01 1 .13 1 1.003v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5zM4.25 0a.25.25 0 0 1 .25.25v5.122a.128.128 0 0 0 .256.006l.233-5.14A.25.25 0 0 1 5.24 0h.522a.25.25 0 0 1 .25.238l.233 5.14a.128.128 0 0 0 .256-.006V.25A.25.25 0 0 1 6.75 0h.29a.5.5 0 0 1 .498.458l.423 5.07a1.69 1.69 0 0 1-1.059 1.711l-.053.022a.92.92 0 0 0-.58.884L6.47 15a.971.971 0 1 1-1.942 0l.202-6.855a.92.92 0 0 0-.58-.884l-.053-.022a1.69 1.69 0 0 1-1.059-1.712L3.462.458A.5.5 0 0 1 3.96 0z"
                />
              </svg>
            </h4>
            <h4 c5lass="card-text">Food & Drinks</h4>
            <span class="card-title text-secondary"
              >Multiple vendors offering local and international cuisine, craft
              beverages, and cocktails</span
            >
          </div>
        </div>
      </div>

      <div class="col-sm-4 d-flex">
        <div class="card flex-fill">
          <div class="card-body">
            <h4 class="icon">
              <span class="bi bi-people-fill"> </span>
            </h4>
            <h4 c5lass="card-text">Restrooms</h4>
            <span class="card-title text-secondary"
              >Located on each floor with accessible facilities available.</span
            >
          </div>
        </div>
      </div>
      <div class="col-sm-4 d-flex">
        <div class="card flex-fill">
          <div class="card-body">
            <h4 class="icon">
              <span class="bi bi-bandaid-fill"> </span>
            </h4>
            <h4 c5lass="card-text">First Aid</h4>
            <span class="card-title text-secondary"
              >Medical staff on-site throughout the event near the main
              entrance.</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-3">
    <h5>Important Information</h5>
    <ul class="mt-3">
      <li>Doors open 2 hours before the first performance</li>
      <li>Security checks will be in place - please allow extra time</li>
      <li>No outside food or beverages permitted</li>
      <li>Photography allowed but no professional equipment</li>
      <li>Accessible seating available - contact venue in advance</li>
    </ul>
  </div>
  <div class="ms-3">
    <router-link
      :to="{ name: 'TicketPayment', query: { event_id: eventId } }"
      class="btn btn-buy btn-custom"
    >
      Mua vé
    </router-link>
  </div>
</template>

<style>
.icon-square {
  border-radius: 10px;
  background-color: rgb(224, 225, 226);
  display: flex;
  justify-content: center; /* ngang */
  align-items: center; /* dọc */
  height: 50px; /* để align-items có hiệu lực */
  width: 50px;
}
</style>
