  <template>
    <div class="tickets-page">
      <!-- Navbar -->
      <!-- <Navbar /> -->

      <main class="tickets-content">
        <h2>Vé của tôi</h2>

        <!-- Tabs -->
        <div class="ticket-tabs">
          <button :class="{ active: activeTab==='upcoming' }" @click="changeTab('upcoming')">Sắp diễn ra</button>
          <button :class="{ active: activeTab==='past' }" @click="changeTab('past')">Lịch sử</button>
          <button :class="{ active: activeTab==='canceled' }" @click="changeTab('canceled')">Đã Hủy</button>
        </div>

        <!-- Search -->
        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm vé theo tên hoặc ngày" class="ticket-search" />

        <!-- Danh sách vé -->
        <h3 v-if="activeTab==='upcoming'">Sự kiện sắp diễn ra</h3>
        <h3 v-else-if="activeTab==='past'">Lịch sử</h3>
        <h3 v-else>Đã hủy</h3>

  <TicketCard
  v-for="(ticket, index) in filteredTickets" 
  :key="index"
  :id="ticket.id"
  :date="ticket.date"
  :title="ticket.title"
  :location="ticket.location"
  :tickets="ticket.tickets"
  :price="ticket.price"
  :status="ticket.status"
  :image="ticket.image"
  @click="selectTicket(ticket)"
/>

        <!-- Ticket Details -->
        <div v-if="selectedTicket" class="ticket-details">
          <h3>Chi tiết vé</h3>
          <ul class="ticket-details">
            <li><b>Sự kiện:</b> {{ selectedTicket.title }}</li>
            <li><b>Địa điểm:</b> {{ selectedTicket.location }}</li>
            <li><b>Ngày & Giờ:</b> {{ selectedTicket.date }}</li>
            <li><b>Loại vé:</b> Standard Access</li>
            <li><b>Số lượng:</b> {{ selectedTicket.tickets }}</li>
            <li><b>Thanh toán:</b> {{ selectedTicket.price }}</li>
          </ul>
          <div class="ticket-buttons">
            <button>Tải vé sự kiện</button>
            <button>Thêm vào lịch</button>
            <button class="navbar-menu-item" @click="$router.push('/support')">Liên hệ hỗ trợ</button>

          </div>
        </div>
      </main>

      <!-- Footer -->
      <!-- <Footer /> -->
    </div>
  </template>

  <script setup>
  import { ref, computed } from 'vue'
  // import Navbar from '../components/Navbar.vue'
  // import Footer from '../components/Footer.vue'
  import TicketCard from '../components/TicketCard.vue'
  import '../assets/css/tickets.css'

  // Tabs
  const activeTab = ref('upcoming')
  const searchQuery = ref('')
  const changeTab = (tab) => {
  activeTab.value = tab
  selectedTicket.value = null // đúng biến selectedTicket
}

  // Data mẫu
  const tickets = ref([
    {
      id: 1,
      date: "Dec 15, 2023 • 8:00 PM",
      title: "Summer Music Festival",
      location: "Hanoi Opera House",
      tickets: "2",
      price: "1,000,000 VND",
      image: new URL('../Image/P1.jpg', import.meta.url).href,
      status: "upcoming"
    },
    {
      id: 2,
      date: "Jan 20, 2024 • 9:30 AM",
      title: "Tech Conference 2024",
      location: "National Convention Center",
      tickets: "1",
      price: "500,000 VND",
      image: new URL('../Image/P2.jpg', import.meta.url).href,
      status: "past"
    },
    {
      id: 3,
      date: "Nov 01, 2023 • 7:00 PM",
      title: "Autumn Gala",
      location: "HCM City Opera House",
      tickets: "1",
      price: "800,000 VND",
      image: new URL('../Image/P1.jpg', import.meta.url).href,
      status: "canceled"
    }
  ])


  // Vé đang chọn
  const selectedTicket = ref(null)
  const selectTicket = (ticket) => {
    selectedTicket.value = ticket
  }

  // Search filter
  const filteredTickets = computed(() => {
    return tickets.value.filter(ticket =>
      (ticket.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.date.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      ticket.status === activeTab.value
    )
  })

  </script>
