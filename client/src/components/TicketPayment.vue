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
          <button class="complete-btn ticketpay-btn" @click="handlePayment" :disabled="isPaying || maxAvailable===0">
            {{ maxAvailable===0 ? 'Hết vé' : (isPaying ? 'Đang xử lý...' : 'Hoàn thành') }}
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
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const ticketsRaw = ref([]);
const ticketTypes = ref([]);
const selectedType = ref("");
const quantity = ref(1);
const name = ref("");
const email = ref("");
const phone = ref("");
const paymentMethod = ref("credit");
const isPaying = ref(false);
const paymentMsg = ref("");
const eventDetail = ref(null);

const eventId = route.query.event_id || 1;
const currentUser = (() => {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
})();
const userId = currentUser?.id;

onMounted(async () => {
  try {
    const [ticketsRes, eventRes] = await Promise.all([
      axios.get(`http://localhost:3000/tickets?event_id=${eventId}`),
      axios.get(`http://localhost:3000/events/${eventId}`)
    ]);
    ticketsRaw.value = ticketsRes.data || [];
    ticketTypes.value = ticketsRaw.value.reduce((acc, curr) => {
      if (!acc.find(t => t.Type === curr.Type)) acc.push(curr);
      return acc;
    }, []);
    if(ticketTypes.value.length>0) selectedType.value = ticketTypes.value[0].Type;
    eventDetail.value = eventRes.data;
  } catch (e) {
    ticketsRaw.value = [];
    ticketTypes.value = [];
    eventDetail.value = null;
  }
});

const venueCapacity = computed(() => Number(eventDetail.value?.venue_capacity || 0));
const soldCount = computed(() => ticketsRaw.value.filter(x => x.status === 'sold').length);
const remaining = computed(() => Math.max(venueCapacity.value - soldCount.value, 0));
const maxAvailable = computed(() => remaining.value);

watch(remaining, (val) => {
  if (val === 0) {
    selectedType.value = '';
    quantity.value = 0;
  } else if (quantity.value === 0) {
    quantity.value = 1;
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

function onSelectType(type){
  selectedType.value = type;
  quantity.value = remaining.value > 0 ? 1 : 0;
}
function increaseQuantity(){ if (quantity.value < maxAvailable.value) quantity.value++; }
function decreaseQuantity(){ if (quantity.value > 1) quantity.value--; }

const formattedEventDate = computed(() => {
  if (!eventDetail.value) return '';
  const s = new Date(eventDetail.value.start_time);
  const e = new Date(eventDetail.value.end_time);
  const dateStr = s.toLocaleDateString('vi-VN', { day:'2-digit', month:'short', year:'numeric' });
  const timeStr = `${s.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})} - ${e.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}`;
  return `${dateStr} • ${timeStr}`;
});
const formattedEventLocation = computed(() => {
  if (!eventDetail.value) return '';
  return eventDetail.value.venue_name ? `${eventDetail.value.venue_name}${eventDetail.value.venue_address ? ', ' + eventDetail.value.venue_address : ''}` : '';
});

async function handlePayment() {
  if(isPaying.value) return;
  paymentMsg.value = "";
  if(!userId) { paymentMsg.value = "Vui lòng đăng nhập trước khi thanh toán!"; return; }
  if(!name.value || !email.value || !phone.value) { paymentMsg.value = "Vui lòng nhập đầy đủ thông tin liên lạc!"; return; }
  if(!selectedType.value || !totalAmount.value || maxAvailable.value===0) { paymentMsg.value = "Hết vé hoặc số lượng không hợp lệ!"; return; }
  if(quantity.value > maxAvailable.value) { paymentMsg.value = `Chỉ còn ${maxAvailable.value} vé.`; return; }

  isPaying.value = true;
  try {
    const buyPayload = {
      event_id: Number(eventId),
      user_id: Number(userId),
      ticket_type: selectedType.value,
      quantity: Number(quantity.value),
      total_amount: Number(totalAmount.value),
      name: name.value,
      email: email.value,
      phone: phone.value,
      payment_method: paymentMethod.value
    };
    const res = await axios.post("http://localhost:3000/purchase-ticket", buyPayload);
    paymentMsg.value = res.data?.message || "Thanh toán thành công!";
    const [ticketsRes, eventRes] = await Promise.all([
      axios.get(`http://localhost:3000/tickets?event_id=${eventId}`),
      axios.get(`http://localhost:3000/events/${eventId}`)
    ]);
    ticketsRaw.value = ticketsRes.data || [];
    eventDetail.value = eventRes.data || eventDetail.value;
  } catch(e) {
    paymentMsg.value = e.response?.data?.message || "Thanh toán thất bại!";
  } finally {
    isPaying.value = false;
  }
}
</script>
