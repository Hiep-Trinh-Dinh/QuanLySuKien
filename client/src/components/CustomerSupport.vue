<template>
  <div class="support-container">

    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span>Home</span> › <span>My Tickets</span> › <span class="active">Support</span>
    </nav>

    <h1 class="title">Trung tâm trợ giúp</h1>
    <p class="subtitle">Chúng tôi ở đây để hỗ trợ bạn giải quyết mọi vấn đề liên quan đến vé.</p>

    <form class="support-form" @submit.prevent="submitTicket">

      <!-- Thông tin vé -->
      <section class="form-section">
        <h3>Thông tin vé</h3>

        <div class="form-group">
          <label>Chủ đề</label>
          <input type="text" v-model="subject" placeholder="Vd: Không quét được mã QR..." />
        </div>

        <div class="form-group">
          <label>Sự kiện</label>
          <input type="text" :value="selectedEventName" readonly class="readonly-input" />
        </div>

        <div class="form-group">
          <label>Loại vấn đề</label>
          <select v-model="issueType">
            <option disabled value="">Chọn thể loại</option>
            <option value="refund">Hoàn / Mua nhầm vé</option>
            <option value="transfer">Chuyển nhượng vé</option>
            <option value="payment">Lỗi thanh toán</option>
            <option value="qr_invalid">QR không quét được</option>
            <option value="event_delay">Sự kiện bị hoãn / đổi lịch</option>
            <option value="technical">Lỗi kỹ thuật khác</option>
          </select>
        </div>

        <div class="form-group">
          <label>Miêu tả vấn đề</label>
          <textarea v-model="message" rows="4" placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."></textarea>
        </div>
      </section>

      <!-- Chi tiết liên lạc -->
      <section class="form-section">
        <h3>Chi tiết liên lạc</h3>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="example@gmail.com" />
        </div>

        <div class="form-group">
          <label>Điện thoại</label>
          <input type="tel" v-model="phone" placeholder="0123456789" />
        </div>
      </section>

      <!-- Đính kèm -->
      <section class="form-section">
        <h3>Đính kèm</h3>
        <input type="file" @change="handleFile" />
        <small>Hỗ trợ PDF, JPG, PNG (tối đa 5MB)</small>
      </section>

      <div class="form-actions">
        <button class="btn primary" type="submit">Gửi yêu cầu</button>
        <button class="btn back" type="button" @click="goBack">Quay lại</button>
      </div>
    </form>

    <!-- Quick Support -->
    <div class="quick-support">
      <h3>Hỗ trợ ngay!</h3>
      <p>Nhóm hỗ trợ của chúng tôi luôn sẵn sàng 24/7.</p>

      <button class="btn-support-chat" @click="chatSupport">Chat trực tiếp</button>
      <button class="btn-support-call" @click="callSupport">Gọi hỗ trợ</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const subject = ref("");
const message = ref("");
const issueType = ref("");
const email = ref("");
const phone = ref("");
const attachment = ref(null);

const events = ref([]);
const event_id = ref("");
const user_id = localStorage.getItem("user_id");

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/support/events", { params: { user_id } });
  events.value = res.data;

  if (route.query.event_id) {
    event_id.value = parseInt(route.query.event_id); // ✅ ép số
    console.log("EVENT ID NHẬN:", event_id.value);
  }

  console.log("EVENT LIST:", events.value);
  console.log("USER ID:", user_id);

});

// ✅ Lấy tên sự kiện đúng theo DB: id + title
const selectedEventName = computed(() => {
  const found = events.value.find(e => e.id == event_id.value);
  return found ? found.title : "";
});


// Upload file
const handleFile = (e) => {
  attachment.value = e.target.files[0];
};

// Submit
const submitTicket = async () => {
  if (!event_id.value || !issueType.value || !subject.value || !message.value) {
    alert("⚠️ Vui lòng điền đầy đủ thông tin.");
    return;
  }

  await axios.post("http://localhost:3000/support/create", {
    user_id,
    event_id: event_id.value,
    issue_type: issueType.value,
    subject: subject.value,
    message: message.value,
    email: email.value,
    phone: phone.value,
    attachment: attachment.value?.name || null
  });

  alert("✅ Gửi yêu cầu hỗ trợ thành công!");
  router.push("/tickets");
};

const goBack = () => router.push("/tickets");
const chatSupport = () => window.open("https://m.me/support-center", "_blank");
const callSupport = () => window.location.href = "tel:19006333";
</script>


<style scoped>
@import "../assets/css/CustomerSupport.css";
</style>
