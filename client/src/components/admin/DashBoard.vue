<template>
	<div class="d-flex" style="min-height:80vh">
		<!-- Left menu -->
		<aside class="bg-light border-end" style="width:240px;">
			<div class="p-3">
				<h5>Admin Dashboard</h5>
			</div>
			<nav class="list-group list-group-flush">
				<button v-for="item in menu" :key="item.key" @click="select(item.key)" :class="['list-group-item list-group-item-action', selected === item.key ? 'active' : '']">
					{{ item.label }}
				</button>
			</nav>
		</aside>

		<!-- Right content -->
		<main class="flex-grow-1 p-4">
			<div class="d-flex justify-content-end mb-3">
				<button class="btn btn-sm btn-outline-primary" @click="goHome">Quay về Home</button>
			</div>
			<OverviewPanel v-if="selected === 'overview'" :stats="stats" />

			<UsersPanel v-if="selected === 'users'" />

			<EventsPanel v-if="selected === 'events'" />

			<LineupsPanel v-if="selected === 'lineups'" />

			<TicketsPanel v-if="selected === 'tickets'" />

			<CategoriesPanel v-if="selected === 'categories'" />

			<VenuesPanel v-if="selected === 'venues'" />

			<ReviewsPanel v-if="selected === 'reviews'" />

		</main>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchOverview } from '../../scripts/admin';
import OverviewPanel from './panels/OverviewPanel.vue';
import UsersPanel from './panels/UsersPanel.vue';
import EventsPanel from './panels/EventsPanel.vue';
import LineupsPanel from './panels/LineupsPanel.vue';
import TicketsPanel from './panels/TicketsPanel.vue';
import CategoriesPanel from './panels/CategoriesPanel.vue';
import VenuesPanel from './panels/VenuesPanel.vue';
import ReviewsPanel from './panels/ReviewsPanel.vue';

const menu = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'events', label: 'Events' },
  { key: 'lineups', label: 'Lineups' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'categories', label: 'Categories' },
  { key: 'venues', label: 'Venues' },
  { key: 'reviews', label: 'Reviews' },
];

const selected = ref('overview');
const stats = ref([
  { label: 'Events', value: '—' },
  { label: 'Users', value: '—' },
  { label: 'Tickets', value: '—' },
  { label: 'Revenue', value: '—' },
]);

function select(key) {
  selected.value = key;
}

const router = useRouter();
function goHome() {
	router.push('/');
}

async function loadOverview() {
  try {
	const res = await fetchOverview();
	stats.value[0].value = Array.isArray(res.events) ? res.events.length : '—';
	stats.value[1].value = res.users?.pagination?.total ?? (Array.isArray(res.users) ? res.users.length : '—');
	stats.value[2].value = res.tickets?.pagination?.total ?? (Array.isArray(res.tickets) ? res.tickets.length : '—');
	stats.value[3].value = '—';
  } catch (err) { console.error('Error loading overview', err); }
}

onMounted(() => loadOverview());
</script>

<style scoped>
aside { min-height: 100vh; }
main { background: #f8f9fa; }
</style>
