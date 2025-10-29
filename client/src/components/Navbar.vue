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
        <template v-if="admin">
          <router-link to="/create-event" class="create-event-link">
            <button class="create-event-btn" @click.stop>Create Event</button>
          </router-link>
          <div class="avatar-wrapper" @click="toggleMenu">
            <img :src="userAvatar" alt="avatar" class="avatar" />
          </div>
          <div v-if="menuOpen" class="user-menu">
            <div class="user-name">{{ user.username }}</div>
            <button class="logout-btn" @click.stop="logout">Đăng xuất</button>
          </div>
        </template>
        <template v-else>
          <div class="avatar-wrapper" @click="toggleMenu">
            <img :src="userAvatar" alt="avatar" class="avatar" />
          </div>
          <div v-if="menuOpen" class="user-menu">
            <div class="user-name">{{ user.username }}</div>
            <button class="logout-btn" @click.stop="logout">Đăng xuất</button>
          </div>
        </template>
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
