<script setup>
import { useRoute } from "vue-router"
import { ref } from "vue"
import {
  QrCodeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  TicketIcon,
  UsersIcon,
  CreditCardIcon,
  HashtagIcon,
  ClockIcon,
  BriefcaseIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/vue/24/outline"

import "../assets/css/TicketInformation.css"

const route = useRoute()

// Data mẫu giống MyTickets.vue
const tickets = ref([
  {
    id: 1,
    date: "15 Tháng 12, 2023 • 8:00 PM",
    title: "Summer Music Festival",
    location: "Nhà hát Lớn Hà Nội",
    tickets: "2",
    price: "1,000,000 VND",
    image: new URL('../Image/P1.jpg', import.meta.url).href,
    status: "Sắp diễn ra"
  },
  {
    id: 2,
    date: "20 Tháng 1, 2024 • 9:30 AM",
    title: "Tech Conference 2024",
    location: "Trung tâm Hội nghị Quốc gia",
    tickets: "1",
    price: "500,000 VND",
    image: new URL('../Image/P2.jpg', import.meta.url).href,
    status: "Đã diễn ra"
  }
])

// Tìm ticket theo id trong URL
const ticket = tickets.value.find(t => t.id === Number(route.params.id))
</script>

<template>
  <div class="ticket-page" v-if="ticket">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span>Trang chủ</span> &gt; <span>Vé của tôi</span> &gt; <span>{{ ticket.title }}</span>
    </div>

    <!-- Header -->
    <div class="header">
      <h1>{{ ticket.title }}</h1>
      <button class="download-btn">Tải vé</button>
    </div>

    <!-- Top cards -->
    <div class="cards">
      <div class="card">
        <QrCodeIcon class="icon"/>
        <h3>TICKET#{{ ticket.id }}-2023</h3>
        <p>Mã QR Code</p>
        <small>Xuất trình mã QR Code để vào cổng</small>
      </div>
      <div class="card">
        <CalendarDaysIcon class="icon"/>
        <h3>Chi tiết sự kiện</h3>
        <p>{{ ticket.date }}</p>
        <p>{{ ticket.location }}</p>
        <small>Vé vào cửa</small>
      </div>
      <div class="card">
        <CheckCircleIcon class="icon"/>
        <h3>Xác nhận</h3>
        <p><b>Trạng thái vé</b></p>
        <small>{{ ticket.status }}</small>
      </div>
    </div>

    <!-- Ticket Information -->
    <h2>Thông tin vé</h2>
    <ul class="info-list">
      <li><TicketIcon class="icon"/> <b>Loại vé:</b> Vé phổ thông</li>
      <li><UsersIcon class="icon"/> <b>Số lượng:</b> {{ ticket.tickets }} vé</li>
      <li><CreditCardIcon class="icon"/> <b>Ngày mua:</b> 30/11/2023</li>
      <li><HashtagIcon class="icon"/> <b>Mã đơn hàng:</b> ORD-2023-{{ ticket.id }}</li>
    </ul>

    <!-- Event Information -->
    <h2>Thông tin sự kiện</h2>
    <p>
      Tham gia {{ ticket.title }} với sự góp mặt của các nghệ sĩ hàng đầu thế giới. 
      Trải nghiệm những màn trình diễn tuyệt vời, cùng các gian hàng ẩm thực, nghệ thuật và nhiều hơn nữa.
    </p>

    <!-- Important Information -->
    <h2>Thông tin quan trọng</h2>
    <ul class="important">
      <li>
        <ClockIcon class="icon"/>
        <div>
          <b>Mở cửa</b>
          <p>6:30 PM</p>
        </div>
      </li>
      <li>
        <BriefcaseIcon class="icon"/>
        <div>
          <b>Chính sách túi xách</b>
          <p>Chỉ túi nhỏ (dưới 30×30 cm)</p>
        </div>
      </li>
      <li>
        <TruckIcon class="icon"/>
        <div>
          <b>Bãi đỗ xe</b>
          <p>Có sẵn tại Nhà hát</p>
        </div>
      </li>
    </ul>

    <!-- Ticket Actions -->
    <h2>Hành động với vé</h2>
    <div class="actions">
      <div class="action-card">
        <ArrowRightOnRectangleIcon class="icon"/>
        <h3>Chuyển vé</h3>
        <p>Gửi vé cho bạn bè hoặc người thân</p>
        <button>Chuyển</button>
      </div>
      <div class="action-card">
        <CalendarIcon class="icon"/>
        <h3>Thêm vào lịch</h3>
        <p>Đồng bộ sự kiện với lịch của bạn</p>
        <button>Thêm</button>
      </div>
      <div class="action-card">
        <ChatBubbleLeftRightIcon class="icon"/>
        <h3>Liên hệ hỗ trợ</h3>
        <p>Bạn cần giúp đỡ với vé?</p>
        <button>Liên hệ</button>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Không tìm thấy vé.</p>
  </div>
</template>
