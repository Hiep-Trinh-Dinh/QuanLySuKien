<template>
  <div class="loginpage-bg">
    <div class="loginpage-flex">
      <div class="loginpage-welcome">
        <h2 class="loginpage-welcome-title">
          Chào mừng đến với<br />thế giới của chúng tôi!
        </h2>
        <p class="loginpage-welcome-desc">
          Bắt đầu một hành trình mới cùng chúng tôi, hòa nhập cùng cộng đồng
        </p>
      </div>
      <form class="loginpage-form" @submit.prevent="login">
        <h2 class="loginpage-title">Đăng nhập</h2>
        <input
          class="loginpage-input"
          type="email"
          placeholder="Nhập địa chỉ email..."
          v-model="email"
        />
        <input
          class="loginpage-input"
          type="password"
          placeholder="Mật khẩu..."
          v-model="password"
        />
        <div class="loginpage-options">
          <input
            id="loginpage-remember"
            type="checkbox"
            class="loginpage-checkbox"
          />
          <label for="loginpage-remember" class="loginpage-remember-label"
            >Lưu mật khẩu</label
          >
        </div>
        <div v-if="error" class="loginpage-error">{{ error }}</div>
        <button class="loginpage-btn-login" type="submit" :disabled="loading">
          {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
        </button>
        <div class="loginpage-switch">
          Bạn chưa có tài khoản?
          <router-link to="/register" class="loginpage-link"
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
