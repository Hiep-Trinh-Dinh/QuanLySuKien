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
            <label v-for="t in ticketTypes" :key="t.Type"
                   class="ticket-type"
                   :class="{active: selectedType === t.Type}"
                   @click="selectedType = t.Type; quantity=1">
              <div class="ticket-type-content">
                <div class="ticket-type-name">Vé {{ t.Type }}</div>
                <div class="ticket-type-desc">Loại vé: {{ t.Type }}</div>
                <div class="ticket-type-price">{{ t.price ? t.price.toLocaleString() : '-' }} VND</div>
              </div>
            </label>
          </div>
        </div>
        <div class="ticket-section">
          <div class="ticket-section-title">Số lượng</div>
          <div class="ticket-quantity">
            <button @click="decreaseQuantity" :disabled="quantity<=1">-</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQuantity" :disabled="quantity>=maxAvailable">+</button>
          </div>
        </div>
        <div class="ticket-section">
          <div class="ticket-section-title">Tổng cộng</div>
          <div class="ticket-summary-row">
            <span>Giá vé</span>
            <span>{{ selectedPriceDisplay }}</span>
          </div>
          <div class="ticket-summary-row">
            <span>Số lượng</span>
            <span>{{ quantity }}</span>
          </div>
          <div class="ticket-summary-row total">
            <span>Thành tiền</span>
            <span>{{ totalAmountDisplay }}</span>
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
          <button class="complete-btn ticketpay-btn" @click="handlePayment" :disabled="isPaying">
            {{ isPaying ? 'Đang xử lý...' : 'Hoàn thành' }}
          </button>
          <div class="secure-note">Thông tin thanh toán của bạn được bảo mật và mã hóa</div>
        </div>
      </div>
    </div>
    <div v-if="paymentMsg" class="alert-payment-msg">{{ paymentMsg }}</div>
  </div>
</template>

<style src="../assets/css/ticket-payment.css"></style>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const ticketTypes = ref([]);
const selectedType = ref("");
const quantity = ref(1);
const name = ref("");
const email = ref("");
const phone = ref("");
const paymentMethod = ref("credit");
const isPaying = ref(false);
const paymentMsg = ref("");

// Lấy event_id từ ?event_id=xxx hoặc mặc định là 1 để test
const eventId = route.query.event_id || 1;

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/tickets?event_id=${eventId}`);
    ticketTypes.value = res.data.reduce((acc, curr) => {
      if (!acc.find(t => t.Type === curr.Type)) acc.push(curr);
      return acc;
    }, []);
    if(ticketTypes.value.length>0) selectedType.value = ticketTypes.value[0].Type;
  } catch (e) {
    ticketTypes.value = [];
  }
});

const selectedTicket = computed(() => ticketTypes.value.find(x => x.Type === selectedType.value));
const selectedPriceDisplay = computed(() => {
  const t = selectedTicket.value;
  return t && t.price ? t.price.toLocaleString()+" VND" : "-";
});
const totalAmount = computed(() => {
  const t = selectedTicket.value;
  return t && t.price ? t.price * quantity.value : 0;
});
const totalAmountDisplay = computed(() => {
  return totalAmount.value ? totalAmount.value.toLocaleString() + " VND" : "0 VND";
});
const maxAvailable = computed(() => (10)); // Sửa nếu cần lấy số lượng vé thật từ backend
function increaseQuantity() { if (quantity.value < maxAvailable.value) quantity.value++; }
function decreaseQuantity() { if (quantity.value > 1) quantity.value--; }

async function handlePayment() {
  if(isPaying.value) return;
  paymentMsg.value = "";
  // Kiểm tra dữ liệu đầu vào
  if(!name.value || !email.value || !phone.value) {
    paymentMsg.value = "Vui lòng nhập đầy đủ thông tin liên lạc!";
    return;
  }
  if(!selectedType.value) {
    paymentMsg.value = "Vui lòng chọn loại vé!";
    return;
  }
  isPaying.value = true;
  try {
    // Bước 1: Mua vé (tạo vé sold cho user), backend tự phân phối seat_number,
    // Loại vé truyền thông qua ticket_type (t.Type), event_id, quantity, tổng tiền
    const buyPayload = {
      event_id: Number(eventId),
      ticket_type: selectedType.value,
      quantity: quantity.value,
      total_amount: totalAmount.value,
      name: name.value,
      email: email.value,
      phone: phone.value,
      payment_method: paymentMethod.value
    };
    const res = await axios.post("http://localhost:3000/purchase-ticket", buyPayload);
    // Nếu backend tách riêng thanh toán, gửi tiếp POST /payment ở đây.
    paymentMsg.value = res.data?.message || "Thanh toán thành công!";
    // Tùy dự án nếu cần có thể chuyển sang trang cảm ơn:
    // setTimeout(()=>router.push('/thankyou'), 1500);
  } catch(e) {
    paymentMsg.value = e.response?.data?.message || "Thanh toán thất bại!";
  } finally {
    isPaying.value = false;
  }
}
</script>
