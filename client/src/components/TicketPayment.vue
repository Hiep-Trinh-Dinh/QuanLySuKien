<template>
  <div class="ticket-payment-wrapper">
    <h1 class="payment-title">Event Ticket Payment</h1>
    <div class="payment-desc">Mua vé cho sự kiện</div>
    <div class="event-info-box">
      <div class="event-title">{{ eventDetail?.title || 'Đang tải sự kiện...' }}</div>
      <div class="event-desc">{{ eventDetail?.description || ' ' }}</div>
      <div class="event-meta">
        <span class="event-date"><i class="icon-calendar"></i> {{ formattedEventDate }}</span>
        <span class="event-location"><i class="icon-location"></i> {{ formattedEventLocation }}</span>
      </div>
    </div>
    <div class="payment-main">
      <div class="payment-left">
        <div class="ticket-section">
          <div class="ticket-section-title">Chọn vé</div>
          <div class="ticket-type-list">
            <template v-if="remaining > 0 && ticketTypes.length">
              <label v-for="t in ticketTypes" :key="t.Type"
                     class="ticket-type"
                     :class="{active: selectedType === t.Type}"
                     @click="onSelectType(t.Type)">
                <div class="ticket-type-content">
                  <div class="ticket-type-name">Vé {{ t.Type }}</div>
                  <div class="ticket-type-desc">Số vé còn lại: {{ remaining }}</div>
                  <div class="ticket-type-price">{{ t.price ? t.price.toLocaleString() : '-' }} VND</div>
                </div>
              </label>
            </template>
            <div v-else class="soldout-note">Sự kiện đã hết vé</div>
          </div>
        </div>
        <div class="ticket-section">
          <div class="ticket-section-title">Số lượng</div>
          <div class="ticket-quantity">
            <button @click="decreaseQuantity" :disabled="quantity<=1">-</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQuantity" :disabled="quantity>=maxAvailable">+</button>
          </div>
          <div v-if="maxAvailable===0" class="soldout-note">Hết vé sự kiện</div>
          <button class="add-cart-btn" @click="addToCart" :disabled="maxAvailable===0 || !selectedType" style="margin-top:8px">Thêm vào giỏ</button>
        </div>
        <div class="ticket-section">
          <div class="ticket-section-title">Giỏ hàng của bạn</div>
          <table class="cart-table" v-if="!cartEmpty">
            <thead>
              <tr>
                <th>Loại vé</th>
                <th>Giá vé</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartList" :key="item.type">
                <td>{{ item.type }}</td>
                <td>{{ item.price.toLocaleString() }} VND</td>
                <td>
                  <input type="number" min="1" :max="maxAvailable"
                    v-model.number="item.quantity"
                    @change="updateCartQuantity(item.type, item.quantity)"
                    style="width:40px;text-align:center"
                  />
                </td>
                <td>{{ (item.price * item.quantity).toLocaleString() }} VND</td>
                <td>
                  <button @click="removeFromCart(item.type)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="soldout-note">Bạn chưa chọn vé nào.</div>
          <div class="ticket-summary-row total" style="margin-top:10px;">
            <span>Tổng cộng</span>
            <span>{{ cartTotalVND }}</span>
          </div>
        </div>
      </div>
      <div class="payment-right">
        <div class="contact-section">
          <div class="contact-title">Thông tin liên lạc</div>
          <div class="form-group">
            <label>Họ và tên</label>
            <input type="text" v-model="name" placeholder="Nhập đầy đủ họ tên của bạn" class="ticketpay-input" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" placeholder="Nhập Email của bạn" class="ticketpay-input" />
          </div>
          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="text" v-model="phone" placeholder="Nhập số điện thoại của bạn" class="ticketpay-input" />
          </div>
          <div class="form-group">
            <label>Phương thức thanh toán</label>
            <div class="payment-method-list">
              <label :class="['payment-method', paymentMethod==='credit' ? 'active' : '']">
                <input type="radio" value="credit" v-model="paymentMethod" class="ticketpay-radio" />
                <span>Thẻ tín dụng</span>
              </label>
              <label :class="['payment-method', paymentMethod==='bank' ? 'active' : '']">
                <input type="radio" value="bank" v-model="paymentMethod" class="ticketpay-radio" />
                <span>Chuyển khoản ngân hàng</span>
              </label>
              <label :class="['payment-method', paymentMethod==='wallet' ? 'active' : '']">
                <input type="radio" value="wallet" v-model="paymentMethod" class="ticketpay-radio" />
                <span>Digital Wallet</span>
              </label>
            </div>
          </div>
          <button class="complete-btn ticketpay-btn" @click="handlePayment" :disabled="isPaying || maxAvailable===0">
            {{ maxAvailable===0 ? 'Hết vé' : (isPaying ? 'Đang xử lý...' : 'Hoàn thành') }}
          </button>
          <div class="secure-note">Thông tin thanh toán của bạn được bảo mật và mã hóa</div>
        </div>
      </div>
    </div>
    <div v-if="paymentMsg" class="alert-payment-msg" style="display:none;">{{ paymentMsg }}</div>

    <!-- Modal thông báo -->
    <div v-if="showDialog" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-title">{{ dialogTitle }}</div>
        <div class="modal-body">{{ dialogMessage }}</div>
        <div class="modal-actions">
          <button class="modal-btn" @click="closeDialog">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="../assets/css/ticket-payment.css"></style>

<script setup>
import { useTicketPayment } from "../scripts/TicketPayment.js";

const {
  ticketTypes,
  selectedType,
  quantity,
  name,
  email,
  phone,
  paymentMethod,
  isPaying,
  paymentMsg,
  eventDetail,
  remaining,
  maxAvailable,
  selectedPriceDisplay,
  totalAmountDisplay,
  onSelectType,
  increaseQuantity,
  decreaseQuantity,
  formattedEventDate,
  formattedEventLocation,
  handlePayment,
  // cart
  cartList,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  cartEmpty,
  cartTotalVND,
  // dialog
  showDialog,
  dialogTitle,
  dialogMessage,
  closeDialog
} = useTicketPayment();
</script>
