import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export function useTicketPayment() {
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

  // Dialog state
  const showDialog = ref(false);
  const dialogTitle = ref("");
  const dialogMessage = ref("");

  // Cart logic
  const cartList = ref([]); // [{ type, price, quantity }]

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

  // === CART FUNCTIONS ===
  function addToCart() {
    if (!selectedType.value) return;
    const t = selectedTicket.value;
    if (!t) return;
    const index = cartList.value.findIndex(item => item.type === selectedType.value);
    const willAdd = quantity.value;
    if (willAdd < 1) return;

    // Tính tổng số vé các loại (trong giỏ) để không vượt quá maxAvailable
    const currentTotalQty = cartList.value.reduce((sum, item) => sum + item.quantity, 0);
    if (currentTotalQty + willAdd > maxAvailable.value) {
      paymentMsg.value = `Tổng số vé chọn không được vượt quá số lượng còn lại (${maxAvailable.value})`;
      dialogTitle.value = 'Thông báo';
      dialogMessage.value = paymentMsg.value;
      showDialog.value = true;
      return;
    }
    // Nếu loại đã có trong giỏ → cộng dồn
    if (index >= 0) {
      cartList.value[index].quantity += willAdd;
    } else {
      cartList.value.push({
        type: t.Type,
        price: t.price,
        quantity: willAdd
      });
    }
    // reset chọn
    quantity.value = 1;
    paymentMsg.value = '';
    dialogTitle.value = 'Đã thêm vào giỏ hàng';
    dialogMessage.value = `Đã thêm ${willAdd} vé loại ${t.Type} vào giỏ.`;
    showDialog.value = true;
  }

  function removeFromCart(type) {
    const index = cartList.value.findIndex(item => item.type === type);
    if (index >= 0) {
      cartList.value.splice(index, 1);
    }
  }
  function updateCartQuantity(type, newQty) {
    const index = cartList.value.findIndex(item => item.type === type);
    if (index >= 0 && newQty > 0) {
      // tổng số vé các loại khác
      const totalOthers = cartList.value.reduce((sum, item, idx) => idx !== index ? sum + item.quantity : sum, 0);
      if (totalOthers + newQty > maxAvailable.value) return; // không cho vượt
      cartList.value[index].quantity = newQty;
    }
  }
  const cartTotal = computed(() => cartList.value.reduce((sum, item) => sum + (item.price*item.quantity), 0));
  const cartTotalVND = computed(() => cartTotal.value ? cartTotal.value.toLocaleString()+" VND" : "0 VND");
  const cartEmpty = computed(() => cartList.value.length === 0);

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

  function closeDialog() {
    showDialog.value = false;
  }

  async function handlePayment() {
    if(isPaying.value) return;
    paymentMsg.value = "";
    if(!userId) { paymentMsg.value = "Vui lòng đăng nhập trước khi thanh toán!"; 
      dialogTitle.value='Thông báo'; 
      dialogMessage.value = paymentMsg.value; 
      showDialog.value = true; 
      return; 
    }
    if(!name.value || !email.value || !phone.value) 
      { paymentMsg.value = "Vui lòng nhập đầy đủ thông tin liên lạc!"; 
        dialogTitle.value='Thông báo'; 
        dialogMessage.value = paymentMsg.value; 
        showDialog.value = true;
       return; 
      }
    if(cartEmpty.value) 
      { paymentMsg.value = "Bạn chưa chọn vé nào."; 
        dialogTitle.value='Thông báo'; 
        dialogMessage.value = paymentMsg.value; 
        showDialog.value = true; return; 
      }

    // Tổng số vé của giỏ không được vượt maxAvailable
    const totalQty = cartList.value.reduce((sum, item) => sum + item.quantity, 0);
    if(totalQty > maxAvailable.value) {
      paymentMsg.value = `Tổng số vé trong giỏ hàng vượt quá lượng vé còn lại (${maxAvailable.value})`;
      dialogTitle.value='Thông báo'; dialogMessage.value = paymentMsg.value; showDialog.value = true;
      return;
    }
    isPaying.value = true;
    try {
      // Tạo payload dạng tickets: [{type, quantity, price}...]
      const buyPayload = {
        event_id: Number(eventId),
        user_id: Number(userId),
        name: name.value,
        email: email.value,
        phone: phone.value,
        payment_method: paymentMethod.value,
        tickets: cartList.value.map(item => ({type: item.type, quantity: item.quantity, price: item.price}))
      };
      const res = await axios.post("http://localhost:3000/purchase-ticket", buyPayload);
      paymentMsg.value = res.data?.message || "Thanh toán thành công!";
      dialogTitle.value = 'Thanh toán';
      dialogMessage.value = paymentMsg.value;
      showDialog.value = true;
      // reset
      cartList.value = [];
      const [ticketsRes, eventRes] = await Promise.all([
        axios.get(`http://localhost:3000/tickets?event_id=${eventId}`),
        axios.get(`http://localhost:3000/events/${eventId}`)
      ]);
      ticketsRaw.value = ticketsRes.data || [];
      eventDetail.value = eventRes.data || eventDetail.value;
    } catch(e) {
      paymentMsg.value = e.response?.data?.message || "Thanh toán thất bại!";
      dialogTitle.value = 'Thanh toán';
      dialogMessage.value = paymentMsg.value;
      showDialog.value = true;
    } finally {
      isPaying.value = false;
    }
  }

  // Đếm số vé còn lại của từng loại cho event này
  function countRemainingByType(type) {
    return ticketsRaw.value.filter(
      ticket => ticket.Type === type && ticket.status === 'available'
    ).length;
  }

  return {
    ticketsRaw,
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
    eventId,
    currentUser,
    userId,
    venueCapacity,
    soldCount,
    remaining,
    maxAvailable,
    selectedTicket,
    selectedPriceDisplay,
    totalAmount,
    totalAmountDisplay,
    onSelectType,
    increaseQuantity,
    decreaseQuantity,
    formattedEventDate,
    formattedEventLocation,
    handlePayment,
    // Cart
    cartList,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartTotalVND,
    cartEmpty,
    // Dialog
    showDialog,
    dialogTitle,
    dialogMessage,
    closeDialog,
    countRemainingByType
  };
}
