<template>
  <div class="mb-4">
    <h4>Thông tin sự kiện</h4>
    <span>Sự kiện của {{ user.name }}</span>
  </div>
  <div>
    <h4>Chi tiết sự kiện</h4>
    <div class="date-time d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="pi pi-calendar icon"> </span>
        <div class="d-flex flex-column">
          <strong> Thời gian và giờ: </strong>
          <span class="text-secondary"
            >{{ user.date }} • {{ user.timeStart }} - {{ user.timeEnd }}
          </span>
        </div>
      </div>
    </div>
    <div class="location d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="pi pi-map-marker icon"> </span>
        <div class="d-flex flex-column">
          <strong> Địa điểm: </strong>
          <span class="text-secondary">{{ user.place }} </span>
        </div>
      </div>
    </div>
    <div class="organizer d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="pi pi-calendar icon"> </span>
        <div class="d-flex flex-column">
          <strong> Người tổ chức: </strong>
          <span class="text-secondary">{{ user.name }} </span>
        </div>
      </div>
    </div>
  </div>
  <div>
    <h4>Mua vé</h4>
    <div class="card">
      <h5 class="card-header d-flex flex-grow-0">
        <span class="pi pi-ticket me-3 icon"></span>
        <span class="d-flex justify-content-center align-self-center"
          >Vé tiêu chuẩn</span
        >
      </h5>
      <div class="card-body">
        <h5 class="card-title">1,200,000 VND</h5>
        <p class="card-text">
          Vé vào cửa chung với quyền tham dự tất cả các buổi biểu diễn
        </p>
        <router-link to="/ticket-purchase" class="btn btn-primary btn-custom">Mua vé</router-link>
      </div>
    </div>
    <div class="card">
      <h5 class="card-header d-flex flex-grow-0">
        <span class="pi pi-star-fill me-3 icon"></span>
        <span class="d-flex justify-content-center align-self-center"
          >VIP Ticket</span
        >
      </h5>
      <div class="card-body">
        <h5 class="card-title">2,200,000 VND</h5>
        <p class="card-text">
          Ghế ngồi cao cấp, quyền lui tới phòng chờ riêng và gặp gỡ nghệ sĩ
        </p>
        <router-link to="/ticket-purchase" class="btn btn-primary btn-custom">Mua vé</router-link>
      </div>
    </div>
  </div>
  <div>
    <h4>Sự kiện tương tự</h4>
    <div class="row">
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h4 class="pi pi-tiktok icon"></h4>

            <span class="card-title">25/11/2025 • 7:30 PM</span>
            <h4 c5lass="card-text">Jazz Night</h4>
            <a href="#" class="btn btn-primary btn-custom">View Details</a>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h4 class="pi pi-tiktok icon"></h4>

            <span class="card-title">25/11/2025 • 7:30 PM</span>
            <h4 c5lass="card-text">Jazz Night</h4>
            <a href="#" class="btn btn-primary btn-custom">View Details</a>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h4 class="pi pi-tiktok icon"></h4>

            <span class="card-title">25/11/2025 • 7:30 PM</span>
            <h4 c5lass="card-text">Jazz Night</h4>
            <a href="#" class="btn btn-primary btn-custom">View Details</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-3">
    <button class="btn btn-share">Share Event</button>
    <button class="btn btn-share">Add to Calendar</button>
  </div>
</template>

<script>
export default {
  name: "OverView",
  props: {
    user: {
      type: Object,
      required: true, // bắt buộc phải nhận props
    },
  },
};
</script>
<style lang="css" scoped>
.icon {
  border-radius: 10px;
  background-color: rgb(224, 225, 226);
  display: flex;
  justify-content: center; /* ngang */
  align-items: center; /* dọc */
  height: 50px; /* để align-items có hiệu lực */
  width: 50px;
}

.btn-custom {
  background-color: #634aff;
  text-decoration: none;

}
.btn-custom:hover {
  background-color: #5324e1;
}
</style>
