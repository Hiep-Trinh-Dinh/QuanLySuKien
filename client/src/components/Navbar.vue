<template>
  <nav class="navbar">
    <div class="navbar-left">
      <ul class="navbar-menu">
        <router-link to="/" class="navbar-menu-link">Home</router-link>
        <router-link to="/exlore-events" class="navbar-menu-link"> Events</router-link>
        <router-link to="/tickets" class="navbar-menu-link">My Tickets</router-link>
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

      <template v-if="admin">
        <div class="avatar-wrapper" @click="toggleMenu">
          <button class="create-event-btn">Create Event</button>
          <img :src="userAvatar" alt="avatar" class="avatar" />
        </div>
        <div v-if="menuOpen" class="user-menu">
          <div class="user-name">{{ user.name }}</div>
          <button class="logout-btn" @click.stop="logout">Đăng xuất</button>
        </div>
      </template>

      <template v-else>
        <router-link class="create-event-btn-link" to="/create-event">
          <button class="create-event-btn">Create Event</button>
        </router-link>
        <router-link class="login-btn-link" to="/login">
          <button class="login-btn">Đăng nhập</button>
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script src="../scripts/navbar.js"></script>
