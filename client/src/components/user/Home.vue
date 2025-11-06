<template>
  <div class="home-hero">
    <div class="hero-image" :style="heroStyle">
      <div class="hero-overlay">
        <h1 class="hero-title">Sự kiện — Kết nối, Trải nghiệm, Kỷ niệm</h1>
        <p class="hero-sub">Tìm, đặt vé và tham gia những sự kiện tuyệt vời quanh bạn.</p>
        <div class="mt-3">
          <router-link to="/explore-events" class="btn btn-lg btn-primary">Khám phá sự kiện</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
// import the asset so the bundler resolves the path correctly
import coverImg from '../../assets/img/—Pngtree—a massive crowd of people_16139729.png';

const heroStyle = computed(() => ({
  backgroundImage: `url(${coverImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  minHeight: '60vh',
  backgroundRepeat: 'no-repeat',
}));
</script>

<style scoped>
.hero-image { position: relative; display:flex; align-items:center; justify-content:center; }
.hero-overlay { background: linear-gradient(rgba(0,0,0,0.12), rgba(0,0,0,0.12)); color: #fff; padding: 3rem 2rem; text-align:center; width:100%; }
.hero-title { font-size: 2.25rem; margin:0; text-shadow: 0 6px 18px rgba(0,0,0,0.45); }
.hero-sub { font-size:1.1rem; margin-top:0.5rem; text-shadow: 0 3px 10px rgba(0,0,0,0.35); }
.home-hero { overflow:hidden; }
</style>
