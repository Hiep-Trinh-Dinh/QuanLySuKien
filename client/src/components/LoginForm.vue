<template>
  <div class="login-page-bg">
    <div class="login-flex">
      <div class="login-welcome">
        <h2>Chào mừng đến với<br />thế giới của chúng tôi!</h2>
        <p>
          Bắt đầu một hành trình mới cùng chúng tôi, hòa nhập cùng cộng đồng
        </p>
      </div>
      <form class="login-form" @submit.prevent="login">
        <h2 class="login-title">Đăng nhập</h2>
        <input
          class="login-input"
          type="email"
          placeholder="Nhập địa chỉ email..."
          v-model="email"
        />
        <input
          class="login-input"
          type="password"
          placeholder="Mật khẩu..."
          v-model="password"
        />
        <div class="login-options">
          <label class="login-remember-me">
            <input type="checkbox" />
            <span class="login-remember-label">Lưu mật khẩu</span>
          </label>
        </div>
        <div v-if="error" class="login-error">{{ error }}</div>
        <button class="login-btn-login" type="submit" :disabled="loading">
          {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
        </button>
        <div class="login-switch">
          Bạn chưa có tài khoản?
          <router-link to="/register" class="login-link"
            >Tạo tài khoản</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "../scripts/useAuth.js";
import "../assets/css/login.css";

const { email, password, error, loading, login } = useAuth();
</script>
