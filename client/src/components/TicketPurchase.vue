<template>
  <div class="ticket-purchase-wrapper">
    <nav class="breadcrumb">
      Sự kiện &gt; Summer Music Festival &gt; Mua vé
    </nav>
    <h1 class="ticket-title">Mua vé</h1>
    <div class="ticket-main">
      <div class="ticket-left">
        <div class="ticket-section">
          <div class="ticket-section-title">Chọn loại vé</div>
          <div class="ticket-type-list">
            <label>
              <input type="radio" value="standard" />
              <div class="ticket-type-content">
                <div class="ticket-type-name">Vé tiêu chuẩn</div>
                <div class="ticket-type-desc">Vé vào cửa chung với quyền tham dự tất cả các buổi biểu diễn</div>
                <div class="ticket-type-price">500,000 VND</div>
              </div>
            </label>
            <label>
              <input type="radio" value="vip" />
              <div class="ticket-type-content">
                <div class="ticket-type-name">Vé VIP</div>
                <div class="ticket-type-desc">Ghế ngồi cao cấp, quyền lui tới phòng chờ riêng và gặp gỡ nghệ sĩ</div>
                <div class="ticket-type-price">1,200,000 VND</div>
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
      </div>
      <div class="ticket-right">
        <div class="ticket-summary">
          <div class="ticket-summary-title">Tổng giá vé</div>
          <div class="ticket-summary-row">
            <span>Loại vé</span>
            <span>standard</span>
          </div>
          <div class="ticket-summary-row">
            <span>Số lượng</span>
            <span>0</span>
          </div>
          <div class="ticket-summary-row total">
            <span>Tổng</span>
            <span>100000 VND</span>
          </div>
          <button class="ticket-pay-btn">Tiếp tục để thanh toán</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style src="../assets/css/ticket-purchase.css"></style>
