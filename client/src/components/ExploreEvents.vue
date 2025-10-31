<template>
  <div class="explore-wrapper">
    <h1 class="explore-title">Khám phá sự kiện</h1>
    <div class="explore-search-block">
      <label class="explore-search-label">Search Events</label>
      <div class="explore-searchbar">
        <input v-model="searchText" class="explore-search-input" type="text" placeholder="Nhập tên sự kiện hoặc ngày (vd: 2024-12-01 hoặc 01/12/2024)" />
        <button class="explore-search-btn" type="button">
          <span class="explore-search-icon">🔍</span>
        </button>
      </div>
    </div>
    <div class="explore-section explore-categories">
      <div class="explore-section-title">Categories</div>
      <div class="explore-category-list">
        <div v-for="cat in categories" :key="cat.id" class="explore-category-item">
          <span class="explore-category-icon-bg"><span class="explore-category-icon">🏷️</span></span>
          <div class="explore-category-name">{{ cat.name }}</div>
          <div class="explore-category-desc">{{ cat.description || '---' }}</div>
        </div>
      </div>
    </div>
    <div class="explore-section explore-featured">
      <div class="explore-section-title">Sự kiện nổi bật</div>
      <div class="explore-featured-list">
        <div 
          class="explore-featured-card" 
          v-for="event in filteredSortedEvents.slice(0, 3)" :key="event.id"
        >
          <div 
            class="explore-featured-img" 
            :style="{
              backgroundImage: event.image_url ? `url('${event.image_url}')` : `url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80')`
            }"
          >
            <div class="explore-featured-overlay">
              <div class="explore-featured-date-row">
                <span class="explore-featured-date-icon">📅</span>
                <span class="explore-featured-date">
                  {{ (new Date(event.start_time)).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                </span>
              </div>
              <div class="explore-featured-info">
                <div class="explore-featured-name">{{ event.title }}</div>
                <div class="explore-featured-meta">{{ event.venue_name }} • {{ (new Date(event.start_time)).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'}) }}</div>
                <router-link :to="`/event-detail/${event.id}`" class="explore-featured-btn">View Details</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="explore-section explore-upcoming">
      <div class="explore-section-title">Sự kiện sắp tới</div>
      <div class="explore-upcoming-list">
        <div 
          class="explore-upcoming-item"
          v-for="event in filteredSortedEvents.slice(3, 8)" :key="event.id"
        >
          <span class="explore-upcoming-icon-bg"><span class="explore-upcoming-icon">🎫</span></span>
          <div class="explore-upcoming-content">
            <div class="explore-upcoming-title">{{ event.title }}</div>
            <div class="explore-upcoming-meta">
              {{ (new Date(event.start_time)).toLocaleDateString('vi-VN', { day:'2-digit', month:'short' }) }} • {{ event.venue_name || 'Địa điểm cập nhật sau' }}
            </div>
          </div>
          <router-link :to="`/event-detail/${event.id}`" class="explore-upcoming-arrow">→</router-link>
        </div>
      </div>
    </div>
    <div class="explore-section explore-locations">
      <div class="explore-section-title">Popular Locations</div>
      <div class="explore-locations-list">
        <div class="explore-location-card">
          <img class="explore-location-img" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Location 1" />
        </div>
        <div class="explore-location-card">
          <img class="explore-location-img" src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" alt="Location 2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useExploreEvents } from '../scripts/ExploreEvents.js';

const {
  events,
  categories,
  searchText,
  filteredSortedEvents
} = useExploreEvents();
</script>

<style src="../assets/css/explore-events.css"></style>
