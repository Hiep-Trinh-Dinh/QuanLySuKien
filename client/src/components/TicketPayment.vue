<template>
  <div class="ticket-payment-wrapper">
    <h1 class="payment-title">Event Ticket Payment</h1>
    <div class="payment-desc">Mua vé cho sự kiện sắp tới</div>
    <div class="event-info-box">
      <div class="event-title">Summer Music Festival</div>
      <div class="event-desc">Hãy tham gia cùng chúng tôi trong sự kiện âm nhạc lớn nhất trong năm</div>
      <div class="event-meta">
        <span class="event-date"><i class="icon-calendar"></i> 15-16 tháng 3, 2024</span>
        <span class="event-location"><i class="icon-location"></i> Sân vận động Mỹ Đình, Hà Nội</span>
      </div>
    </div>
    <div class="payment-main">
      <div class="payment-left">
        <div class="ticket-section">
          <div class="ticket-section-title">Chọn vé</div>
          <div class="ticket-type-list">
            <label class="ticket-type" :class="{active: selectedType==='standard'}" @click="selectedType='standard'">
              <div class="ticket-type-content">
                <div class="ticket-type-name">Vé tiêu chuẩn</div>
                <div class="ticket-type-desc">Ghế ngồi tiêu chuẩn với các tiện nghi cơ bản</div>
                <div class="ticket-type-price">500,000 VND</div>
              </div>
            </label>
            <label class="ticket-type" :class="{active: selectedType==='vip'}" @click="selectedType='vip'">
              <div class="ticket-type-content">
                <div class="ticket-type-name">Vé VIP</div>
                <div class="ticket-type-desc">Ghế ngồi cao cấp với những quyền lợi đặc quyền</div>
                <div class="ticket-type-price">1,200,000 VND</div>
              </div>
            </label>
            <label class="ticket-type" :class="{active: selectedType==='student'}" @click="selectedType='student'">
              <div class="ticket-type-content">
                <div class="ticket-type-name">Vé học sinh</div>
                <div class="ticket-type-desc">Cần xuất trình thẻ sinh viên/học sinh hợp lệ</div>
                <div class="ticket-type-price">300,000 VND</div>
              </div>
            </label>
          </div>
        </div>
        <div class="ticket-section">
          <div class="ticket-section-title">Số lượng</div>
          <div class="ticket-quantity">
            <button>-</button>
            <span>0</span>
            <button>+</button>
          </div>
        </div>
        <div class="ticket-section">
          <div class="ticket-section-title">Tổng cộng</div>
          <div class="ticket-summary-row">
            <span>Giá vé</span>
            <span>100000000 VND</span>
          </div>
          <div class="ticket-summary-row">
            <span>Số lượng</span>
            <span>0</span>
          </div>
          <div class="ticket-summary-row total">
            <span>Thành tiền</span>
            <span>1000000 VND</span>
          </div>
        </div>
      </div>
      <div class="payment-right">
        <div class="contact-section">
          <div class="contact-title">Thông tin liên lạc</div>
          <div class="form-group">
            <label>Họ và tên</label>
            <input type="text" v-model="name" placeholder="Nhập đầy đủ họ tên của bạn" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" placeholder="Nhập Email của bạn" />
          </div>
          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="text" v-model="phone" placeholder="Nhập số điện thoại của bạn" />
          </div>
          <div class="form-group">
            <label>Phương thức thanh toán</label>
            <div class="payment-method-list">
              <label :class="['payment-method', paymentMethod==='credit' ? 'active' : '']">
                <input type="radio" value="credit" v-model="paymentMethod" />
                <span>Thẻ tín dụng</span>
              </label>
              <label :class="['payment-method', paymentMethod==='bank' ? 'active' : '']">
                <input type="radio" value="bank" v-model="paymentMethod" />
                <span>Chuyển khoản ngân hàng</span>
              </label>
              <label :class="['payment-method', paymentMethod==='wallet' ? 'active' : '']">
                <input type="radio" value="wallet" v-model="paymentMethod" />
                <span>Digital Wallet</span>
              </label>
            </div>
          </div>
          <button class="complete-btn">Hoàn thành</button>
          <div class="secure-note">Thông tin thanh toán của bạn được bảo mật và mã hóa</div>
        </div>
      </div>
    </div>
  </div>
</template>


<style src="../assets/css/ticket-payment.css"></style>

<script setup>
import { ref } from "vue";

const selectedType = ref("standard");
const name = ref("");
const email = ref("");
const phone = ref("");
const paymentMethod = ref("credit");
</script>
