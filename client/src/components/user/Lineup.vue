
<template>
  <div class="mb-4">
    <h4>Thông tin sự kiện</h4>
    <span>
      Hãy tham gia cùng chúng tôi tại lễ hội âm nhạc lớn nhất mùa hè! Trải
      nghiệm một đêm khó quên với các nghệ sĩ quốc tế và địa phương biểu diễn
      trực tiếp t ại Nhà hát Lớn Hà Nội mang tính biểu tượng. Lễ hội sẽ có nhiều
      thể loại bao gồm nhạc pop, nhạc rock và nhạc điện tử với các chương trình
      biểu diễn ánh sáng ngoạn mục và hiệu ứng đặc biệt.
    </span>
  </div>
  <div class="mb-4">
    <h4>Nghệ sĩ nổi bật</h4>
    <div class="row">
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h4 class="icon">
              <span class="pi pi-tiktok"> </span>
            </h4>
            <h4 c5lass="card-text">Jazz Night</h4>
            <span class="card-title text-custom">25/11/2025 • 7:30 PM</span>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h4 class="icon">
              <span class="pi pi-tiktok"> </span>
            </h4>
            <h4 c5lass="card-text">Jazz Night</h4>
            <span class="card-title text-custom">25/11/2025 • 7:30 PM</span>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h4 class="icon">
              <span class="pi pi-tiktok"> </span>
            </h4>
            <h4 c5lass="card-text">Jazz Night</h4>
            <span class="card-title text-custom">25/11/2025 • 7:30 PM</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mb-4">
    <h4 class="mb-3">Event Schedule</h4>
    <div class="row">
      <div class="col-sm">
        <span class="pi pi-clock"></span>
        <span> 6:00 PM</span>
      </div>
      <div class="col-sm">Door Open</div>
      <div class="col-sm">Main Entrance</div>
    </div>
    <hr />
    <div class="row">
      <div class="col-sm">
        <span class="pi pi-clock"></span>
        <span> 7:00 PM</span>
      </div>
      <div class="col-sm">Opening Act: Acoustic Souls</div>
      <div class="col-sm">Main Stage</div>
    </div>
    <hr />
    <div class="row">
      <div class="col-sm">
        <span class="pi pi-clock"></span>
        <span> 8:00 PM</span>
      </div>
      <div class="col-sm">DJ Electra</div>
      <div class="col-sm">Electronic Stage</div>
    </div>
    <hr />
    <div class="row">
      <div class="col-sm">
        <span class="pi pi-clock"></span>
        <span> 10:00 PM</span>
      </div class="col-sm">
      <div class="col-sm">Headliner: The Harmonics</div>
      <div class="col-sm">Main Stage</div>
    </div>
    <hr />
    <div class="row">
      <div class="col-sm">
        <span class="pi pi-clock "></span>
        <span> 12:00 PM</span>
      </div>
      <div class="col-sm">Event Ends</div>
      <div class="col-sm">All Venues</div>
    </div>
    <hr />
  </div>
  <div class="mb-4">
    <h4>Ticket Options</h4>
    <div class="d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="icon-square">
          <span class="pi pi-ticket"></span>
        </span>
        <div class="d-flex flex-column">
          <strong> General Admission </strong>
          <span class="text-secondary">500,000 VND </span>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="icon-square">
          <span class="pi pi-star "></span>
        </span>
        <div class="d-flex flex-column">
          <strong> VIP Packege </strong>
          <span class="text-secondary">1,200,000 VND </span>
        </div>
      </div>
    </div>
        <div class="d-flex flex-column mb-3">
      <div class="d-flex flex-grow-0">
        <span class="icon-square">
          <span class="pi pi-user"></span>
        </span>
        <div class="d-flex flex-column">
          <strong> Student Admission </strong>
          <span class="text-secondary">300,000 VND</span>
        </div>
       </div>
    </div>
    <button class="btn btn-buy ">Buy Tickets</button>
    <button class="btn btn-share">Share Event</button>
  </div>
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
  line-height: 1; /* quan trọng */
}
.icon-square {
  border-radius: 10px;
  background-color: #d1cfcf;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1; /* quan trọng */
  color: #7c3aed;
  margin-right: 5px;
}
.text-custom {
  font-size: 0.8rem;
  color: rgba(112, 112, 112, 0.574);
}
.btn-buy{
  border-radius: 10px !important;
  background-color: #7c3aed !important;
  color: white !important;
}
.btn-buy:hover{
  background-color: #6631c1 !important;
}
.btn-share{
  border-radius: 10px !important;
  background-color: rgba(197, 196, 196, 0.663) !important ;
  color: #7c3aed !important;
  margin-left: 20px;
}
.btn-share:hover{
  background-color: rgba(152, 151, 151, 0.663) !important ;
}
</style>
