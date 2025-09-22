<template>
  <div class="support-wrapper">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span>Home</span> > <span>My Tickets</span> > <span class="active">Support</span>
    </div>

    <h2 class="title">Trung tâm trợ giúp</h2>
    <p class="subtitle">Chúng tôi ở đây để hỗ trợ bạn giải quyết mọi vấn đề liên quan đến vé.</p>

    <form @submit.prevent="handleSubmit" class="support-form">
      <!-- Thông tin vé -->
      <section class="form-section">
        <h3>Thông tin vé</h3>
        <div class="form-group">
          <label>Chủ đề</label>
          <input type="text" v-model="topic" placeholder="Vấn đề của vé..." />
        </div>
        <div class="form-group">
          <label>Sự kiện</label>
          <select v-model="event">
            <option disabled value="">Chọn sự kiện</option>
            <option v-for="e in events" :key="e">{{ e }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Loại vấn đề</label>
          <select v-model="issueType">
            <option disabled value="">Chọn loại</option>
            <option value="refund">Hoàn vé</option>
            <option value="transfer">Chuyển vé</option>
            <option value="technical">Kỹ thuật</option>
          </select>
        </div>
        <div class="form-group">
          <label>Miêu tả vấn đề</label>
          <textarea v-model="description" placeholder="Vui lòng miêu tả chi tiết vấn đề"></textarea>
        </div>
      </section>

      <!-- Liên hệ -->
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

      <!-- Upload -->
      <section class="form-section">
        <h3>Đính kèm</h3>
        <input type="file" @change="handleFile" />
        <small>Hỗ trợ file: PDF, JPG, PNG (tối đa 5MB)</small>
      </section>

      <!-- Buttons -->
    <div class="form-actions">
        <button type="submit" class="btn primary">Gửi vé</button>
        <button type="button" class="btn back" @click="goBack">Quay lại</button>
    </div>

    </form>

    <!-- Quick support -->
    <div class="quick-support">
      <h3>Hỗ trợ ngay!</h3>
      <p>Nhóm hỗ trợ luôn sẵn sàng 24/7 để giải quyết các vấn đề khẩn cấp.</p>
      <button class="btn chat" @click="chatSupport">Chat trực tiếp</button>
      <button class="btn call" @click="callSupport">Gọi hỗ trợ</button>
    </div>
  </div>
</template>

<script>
import "../assets/css/CustomerSupport.css";

export default {
  name: "CustomerSupport",
  data() {
    return {
      topic: "",
      event: "",
      issueType: "",
      description: "",
      email: "",
      phone: "",
      file: null,
      events: ["Summer Music Festival", "Tech Conference", "Autumn Gala"]
    };
  },
  methods: {
    handleFile(e) {
        this.file = e.target.files[0];
    },
    handleSubmit() {
        alert("Đã gửi yêu cầu hỗ trợ thành công!");
        this.resetForm();
    },
    resetForm() {
        this.topic = "";
        this.event = "";
        this.issueType = "";
        this.description = "";
        this.email = "";
        this.phone = "";
        this.file = null;
    },
    chatSupport() {
        alert("Mở chat hỗ trợ...");
    },
    callSupport() {
        alert("Gọi tới tổng đài...");
    },
    goBack() {
        this.$router.push("/tickets"); // quay về trang Tickets
    }
    }
};
</script>
