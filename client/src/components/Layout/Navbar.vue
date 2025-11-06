<template>
  <nav class="navbar">
    <div class="navbar-left">
      <ul class="navbar-menu">
            <router-link 
              to="/" 
              class="navbar-menu-link"
              exact
              exact-active-class="navbar-active"
            >Home</router-link>

            <router-link 
              to="/explore-events" 
              class="navbar-menu-link" 
              exact-active-class="navbar-active"
            >Events</router-link>

            <router-link 
              to="/tickets" 
              class="navbar-menu-link" 
              exact-active-class="navbar-active"
            >My Tickets</router-link>
      </ul>
    </div>
    <div class="navbar-right">
      <template v-if="user">
        <template v-if="admin">
          <button class="create-event-btn" @click="$router.push('/create-event')">Create Event</button>
          <div class="avatar-wrapper" @click="toggleMenu">
            <img :src="userAvatar" alt="avatar" class="avatar" />
          </div>
          <div v-if="menuOpen" class="user-menu">
            <div class="user-name">{{ user.username }}</div>
            <button class="logout-btn" @click.stop="logout">Đăng xuất</button>
            <button class="profile-btn" @click.stop="$router.push('/profile')">Trang cá nhân</button>
            <button class="dashboard-btn" @click.stop="$router.push('/dashboard')">Trang quản trị</button>
          </div>
        </template>
        <template v-else>
          <div class="avatar-wrapper" @click="toggleMenu">
            <img :src="userAvatar" alt="avatar" class="avatar" />
          </div>
          <div v-if="menuOpen" class="user-menu">
            <div class="user-name">{{ user.username }}</div>
            <button class="logout-btn" @click.stop="logout">Đăng xuất</button>
            <button class="profile-btn" @click.stop="$router.push('/profile')">Trang cá nhân</button>
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

<script src="../../scripts/navbar.js">
</script>
