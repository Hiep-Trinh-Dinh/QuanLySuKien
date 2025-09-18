<template>
  <div class="register-page-bg">
    <div class="register-flex">
      <div class="register-welcome">
        <h2>Chào mừng đến với<br />thế giới của chúng tôi!</h2>
        <p>Bắt đầu một hành trình mới cùng chúng tôi, hòa nhập cùng cộng đồng</p>
      </div>
      <form class="register-form" @submit.prevent="register">
        <h2 class="register-title">Đăng kí</h2>
        <input class="register-input" type="text" placeholder="Nhập họ & tên" v-model="name" />
        <input class="register-input" type="email" placeholder="Nhập địa chỉ email..." v-model="email" />
        <input class="register-input" type="password" placeholder="Mật khẩu..." v-model="password" />
        <input class="register-input" type="password" placeholder="Xác nhận mật khẩu..." v-model="confirmPassword" />
        <div v-if="error" class="register-error">{{ error }}</div>
        <button class="register-btn-register" type="submit" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : 'Đăng Kí' }}
        </button>
        <div class="register-switch">
          Đã có tài khoản? <router-link to="/login" class="register-link">Đăng nhập</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../scripts/useAuth.js'
import '../assets/css/register.css'

const { name, email, password, confirmPassword, error, loading, register } = useAuth()
</script>


