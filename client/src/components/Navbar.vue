<template>
  <nav class="navbar">
    <div class="navbar-left">
      <ul class="navbar-menu">
        <router-link to="/" class="navbar-menu-link">Home</router-link>
        <li class="navbar-menu-item"> Events</li>
        <li class="navbar-menu-item"> My Tickets</li>
      </ul>
    </div>
    <div class="navbar-right">
      <template v-if="user">
        <div class="avatar-wrapper" @click="toggleMenu">
          <img :src="userAvatar" alt="avatar" class="avatar" />
        </div>
        <div v-if="menuOpen" class="user-menu">
          <div class="user-name">{{ user.name }}</div>
          <button class="logout-btn" @click.stop="logout">Đăng xuất</button>
        </div>
      </template>
      <template v-else>
        <router-link class="login-btn-link" to="/login">
          <button class="login-btn">Đăng nhập</button>
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script src="../scripts/navbar.js"></script>
