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
			<div v-if="selected === 'overview'">
				<h4>Overview</h4>
				<p class="text-muted">Quick stats and recent activity (basic).</p>
				<div class="row g-3">
					<div class="col-md-3" v-for="stat in stats" :key="stat.label">
						<div class="p-3 border rounded bg-white">
							<div class="small text-muted">{{ stat.label }}</div>
							<div class="h5 mt-2">{{ stat.value }}</div>
						</div>
					</div>
				</div>
			</div>

					<div v-if="selected === 'users'">
						<div class="d-flex justify-content-between align-items-center">
							<h4>Users</h4>
							<div>
								<button class="btn btn-sm btn-primary" @click="openAddUser">+ Thêm user</button>
							</div>
						</div>


						<table class="table table-sm table-striped mt-3">
							<thead>
								<tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr>
							</thead>
							<tbody>
								<tr v-for="u in users" :key="u.id">
									<td>{{ u.id }}</td>
									<td>{{ u.username }}</td>
									<td>{{ u.email }}</td>
									<td>{{ u.role }}</td>
									<td>{{ u.created_at }}</td>
									<td>
										<button class="btn btn-sm btn-outline-secondary me-2" @click="openEditUser(u)">Edit</button>
										<button class="btn btn-sm btn-outline-danger" @click="confirmDeleteUser(u.id)">Delete</button>
									</td>
								</tr>
							</tbody>
						</table>

						<!-- User modal -->
						<div v-if="showUserModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;">
							<div class="card" style="width:600px;max-width:95%;">
								<div class="card-body">
									<h5 class="card-title">{{ userForm.id ? 'Chỉnh sửa user' : 'Tạo user mới' }}</h5>
									<div class="row g-2">
										<div class="col-md-6"><label class="form-label">Username</label><input v-model="userForm.username" class="form-control" /></div>
										<div class="col-md-6"><label class="form-label">Email</label><input v-model="userForm.email" class="form-control" /></div>
										<div class="col-md-6"><label class="form-label">Role</label><select v-model="userForm.role" class="form-select"><option value="user">user</option><option value="admin">admin</option></select></div>
										<div class="col-md-6"><label class="form-label">Phone</label><input v-model="userForm.phone" class="form-control" /></div>
										<div class="col-12"><label class="form-label">Full name</label><input v-model="userForm.full_name" class="form-control" /></div>
									</div>
									<div class="mt-3 d-flex justify-content-end">
										<button class="btn btn-secondary me-2" @click="showUserModal=false">Hủy</button>
										<button class="btn btn-primary" @click="saveUser">Lưu</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-if="selected === 'events'">
						<div class="d-flex justify-content-between align-items-center">
							<h4>Events</h4>
							<div>
								<button class="btn btn-sm btn-primary" @click="openAddEvent">+ Thêm sự kiện</button>
							</div>
						</div>

						<table class="table table-sm table-striped mt-3">
							<thead>
								<tr>
									<th>ID</th>
									<th>Title</th>
									<th>Category</th>
									<th>Venue</th>
									<th>Start</th>
									<th>Status</th>
									<th style="width:160px">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="e in eventsList" :key="e.id">
									<td>{{ e.id }}</td>
									<td>
										<div class="d-flex align-items-center">
											<img v-if="e.image_url" :src="e.image_url" alt="thumb" style="width:48px;height:40px;object-fit:cover;margin-right:8px;border-radius:4px" />
											<div>
												<div>{{ e.title }}</div>
												<div class="small text-muted">{{ e.description ? (e.description.substr(0,60) + (e.description.length>60 ? '...' : '')) : '' }}</div>
											</div>
										</div>
									</td>
									<td>{{ e.category_name }}</td>
									<td>{{ e.venue_name }}</td>
									<td>{{ e.start_time }}</td>
									<td>{{ e.status }}</td>
									<td>
										<button class="btn btn-sm btn-outline-secondary me-2" @click="openEditEvent(e)">Edit</button>
										<button class="btn btn-sm btn-outline-danger" @click="confirmDeleteEvent(e.id)" :disabled="deleting===e.id || deleting===String(e.id)">
											<span v-if="deleting===e.id || deleting===String(e.id)">Deleting...</span>
											<span v-else>Delete</span>
										</button>
									</td>
								</tr>
							</tbody>
						</table>

						<!-- Event modal -->
						<div v-if="showEventModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;">
							<div class="card" style="width:900px;max-width:95%;">
								<div class="card-body">
									<h5 class="card-title">{{ isEditing ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới' }}</h5>
									<div class="row g-2">
										<div class="col-md-6">
											<label class="form-label">Title</label>
											<input v-model="eventForm.title" class="form-control" />
										</div>
										<div class="col-md-6">
											<label class="form-label">Category</label>
											<select v-model="eventForm.category_id" class="form-select">
												<option :value="null">-- chọn --</option>
												<option v-for="c in categoriesList" :key="c.id" :value="c.id">{{ c.name }}</option>
											</select>
										</div>
										<div class="col-12">
											<label class="form-label">Description</label>
											<textarea v-model="eventForm.description" class="form-control" rows="3"></textarea>
										</div>
										<div class="col-md-6">
											<label class="form-label">Venue</label>
											<select v-model="eventForm.venue_id" class="form-select">
												<option :value="null">-- chọn --</option>
												<option v-for="v in venuesList" :key="v.id" :value="v.id">{{ v.name }}</option>
											</select>
										</div>
										<div class="col-md-3">
											<label class="form-label">Start</label>
											<input v-model="eventForm.start_time" type="datetime-local" class="form-control" />
										</div>
										<div class="col-md-3">
											<label class="form-label">End</label>
											<input v-model="eventForm.end_time" type="datetime-local" class="form-control" />
										</div>
										<div class="col-md-4">
											<label class="form-label">Standard price</label>
											<input v-model.number="eventForm.standard_price" type="number" class="form-control" />
										</div>
										<div class="col-md-8">
											<label class="form-label">Image</label>
											<input type="file" class="form-control" @change="(e)=>{ eventForm.image_file = e.target.files[0]; }" accept="image/*" />
											<div class="mt-2">
												<img v-if="eventForm.image_file" :src="URL.createObjectURL(eventForm.image_file)" alt="preview" style="max-height:80px;object-fit:cover;border-radius:6px" />
												<img v-else-if="eventForm.image_url" :src="eventForm.image_url" alt="preview" style="max-height:80px;object-fit:cover;border-radius:6px" />
											</div>
										</div>
									</div>
						
									<div class="mt-3 d-flex justify-content-end">
										<button class="btn btn-secondary me-2" @click="showEventModal=false">Hủy</button>
										<button class="btn btn-primary" @click="saveEvent">Lưu</button>
									</div>
								</div>
							</div>
						</div>
							</div>

							<!-- Lineups: artists management + event lineup -->
							<div v-if="selected === 'lineups'">
								<div class="d-flex justify-content-between align-items-center">
									<h4>Artists</h4>
									<div><button class="btn btn-sm btn-primary" @click="openAddArtist">+ Thêm artist</button></div>
								</div>

								<table class="table table-sm table-striped mt-3">
									<thead><tr><th>ID</th><th>Name</th><th>Avatar</th><th>Bio</th><th>Actions</th></tr></thead>
									<tbody>
										<tr v-for="a in artistsList" :key="a.id">
											<td>{{ a.id }}</td>
											<td>{{ a.name }}</td>
											<td><img v-if="a.avatar_url" :src="a.avatar_url" style="height:40px;width:40px;object-fit:cover;border-radius:4px"/></td>
											<td>{{ a.bio }}</td>
											<td>
												<button class="btn btn-sm btn-outline-secondary me-2" @click="openEditArtist(a)">Edit</button>
												<button class="btn btn-sm btn-outline-danger" @click="confirmDeleteArtist(a.id)">Delete</button>
											</td>
										</tr>
									</tbody>
								</table>

								<!-- Artist modal -->
								<div v-if="showArtistModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;">
									<div class="card" style="width:700px;max-width:95%;">
										<div class="card-body">
											<h5 class="card-title">{{ artistForm.id ? 'Chỉnh sửa artist' : 'Tạo artist mới' }}</h5>
											<div class="row g-2">
												<div class="col-md-8"><label class="form-label">Name</label><input v-model="artistForm.name" class="form-control"/></div>
												<div class="col-md-4"><label class="form-label">Avatar</label><input type="file" class="form-control" @change="(e)=>{ artistForm.avatar_file = e.target.files[0]; }" accept="image/*"/></div>
												<div class="col-12"><label class="form-label">Bio</label><textarea v-model="artistForm.bio" class="form-control"></textarea></div>
											</div>
											<div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="showArtistModal=false">Hủy</button><button class="btn btn-primary" @click="saveArtist">Lưu</button></div>
										</div>
									</div>
								</div>

								<hr/>
								<div class="d-flex justify-content-between align-items-center mt-3">
									<h4>Event Lineup</h4>
									<div class="d-flex">
										<select v-model="selectedEventForLineup" class="form-select me-2">
											<option :value="null">-- chọn event --</option>
											<option v-for="ev in eventsList" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
										</select>
										<button class="btn btn-sm btn-primary" @click="loadLineupForEvent">Load</button>
										<button class="btn btn-sm btn-outline-secondary ms-2" @click="openAddLineup">+ Thêm lineup</button>
									</div>
								</div>

								<table class="table table-sm table-striped mt-3">
									<thead><tr><th>ID</th><th>Artist</th><th>Performance time</th><th>Actions</th></tr></thead>
									<tbody>
										<tr v-for="l in lineupEntries" :key="l.id">
											<td>{{ l.id }}</td>
											<td>{{ l.artist_name }}</td>
											<td>{{ l.performance_time }}</td>
											<td>
												<button class="btn btn-sm btn-outline-secondary me-2" @click="openEditLineup(l)">Edit</button>
												<button class="btn btn-sm btn-outline-danger" @click="confirmDeleteLineup(l.id)">Delete</button>
											</td>
										</tr>
									</tbody>
								</table>

								<!-- Lineup modal -->
								<div v-if="showLineupModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;">
									<div class="card" style="width:600px;max-width:95%;">
										<div class="card-body">
											<h5 class="card-title">{{ lineupForm.id ? 'Chỉnh sửa lineup' : 'Thêm lineup mới' }}</h5>
											<div class="row g-2">
												<div class="col-md-6"><label class="form-label">Event</label><select v-model="lineupForm.event_id" class="form-select"><option :value="null">-- chọn --</option><option v-for="ev in eventsList" :key="ev.id" :value="ev.id">{{ev.title}}</option></select></div>
												<div class="col-md-6"><label class="form-label">Artist</label><select v-model="lineupForm.artist_id" class="form-select"><option :value="null">-- chọn --</option><option v-for="a in artistsList" :key="a.id" :value="a.id">{{a.name}}</option></select></div>
												<div class="col-12"><label class="form-label">Performance time</label><input v-model="lineupForm.performance_time" type="datetime-local" class="form-control"/></div>
											</div>
											<div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="showLineupModal=false">Hủy</button><button class="btn btn-primary" @click="saveLineup">Lưu</button></div>
										</div>
									</div>
								</div>
							</div>

						<div v-if="selected === 'tickets'">
							<div class="d-flex justify-content-between align-items-center">
								<h4>Tickets</h4>
								<div><button class="btn btn-sm btn-primary" @click="openAddTicket">+ Thêm vé</button></div>
							</div>

							<table class="table table-sm table-striped mt-3">
							<thead>
								<tr><th>ID</th><th>Event</th><th>Seat</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr>
							</thead>
							<tbody>
								<tr v-for="t in tickets" :key="t.id">
									<td>{{ t.id }}</td>
									<td>{{ t.event_id }}</td>
									<td>{{ t.seat_number }}</td>
									<td>{{ t.Type }}</td>
									<td>{{ t.price }}</td>
									<td>{{ t.status }}</td>
									<td>
										<button class="btn btn-sm btn-outline-secondary me-2" @click="openEditTicket(t)">Edit</button>
										<button class="btn btn-sm btn-outline-danger" @click="confirmDeleteTicket(t.id)">Delete</button>
									</td>
								</tr>
							</tbody>
						</table>

						<!-- Ticket modal -->
						<div v-if="showTicketModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;">
							<div class="card" style="width:600px;max-width:95%;">
								<div class="card-body">
									<h5 class="card-title">{{ ticketForm.id ? 'Chỉnh sửa vé' : 'Tạo vé mới' }}</h5>
									<div class="row g-2">
										<div class="col-md-6"><label class="form-label">Event</label>
											<select v-model="ticketForm.event_id" class="form-select">
												<option :value="null">-- chọn event --</option>
												<option v-for="ev in eventsList" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
											</select>
										</div>
										<div class="col-md-3"><label class="form-label">Seat</label><input v-model.number="ticketForm.seat_number" class="form-control" type="number"/></div>
										<div class="col-md-3"><label class="form-label">Type</label>
											<select v-model="ticketForm.Type" class="form-select"><option value="student">student</option><option value="standard">standard</option><option value="vip">vip</option></select>
										</div>
										<div class="col-md-4"><label class="form-label">Price</label><input v-model.number="ticketForm.price" class="form-control" type="number"/></div>
									</div>
									<div class="mt-3 d-flex justify-content-end">
										<button class="btn btn-secondary me-2" @click="showTicketModal=false">Hủy</button>
										<button class="btn btn-primary" @click="saveTicket">Lưu</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-if="selected === 'categories'">
						<div class="d-flex justify-content-between align-items-center">
							<h4>Categories</h4>
							<div><button class="btn btn-sm btn-primary" @click="openAddCategory">+ Thêm danh mục</button></div>
						</div>
						<table class="table table-sm table-striped mt-3">
							<thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
							<tbody>
								<tr v-for="c in categoriesList" :key="c.id"><td>{{c.id}}</td><td>{{c.name}}</td><td>{{c.description}}</td><td><button class="btn btn-sm btn-outline-secondary me-2" @click="openEditCategory(c)">Edit</button><button class="btn btn-sm btn-outline-danger" @click="confirmDeleteCategory(c.id)">Delete</button></td></tr>
							</tbody>
						</table>

						<!-- Category modal -->
						<div v-if="showCategoryModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;">
							<div class="card" style="width:600px;max-width:95%;">
								<div class="card-body">
									<h5 class="card-title">{{ categoryForm.id ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới' }}</h5>
									<div class="row g-2">
										<div class="col-12"><label class="form-label">Name</label><input v-model="categoryForm.name" class="form-control"/></div>
										<div class="col-12"><label class="form-label">Description</label><textarea v-model="categoryForm.description" class="form-control"></textarea></div>
									</div>
									<div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="showCategoryModal=false">Hủy</button><button class="btn btn-primary" @click="saveCategory">Lưu</button></div>
								</div>
							</div>
						</div>
					</div>

					<div v-if="selected === 'venues'">
						<div class="d-flex justify-content-between align-items-center">
							<h4>Venues</h4>
							<div><button class="btn btn-sm btn-primary" @click="openAddVenue">+ Thêm địa điểm</button></div>
						</div>
						<table class="table table-sm table-striped mt-3">
							<thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Capacity</th><th>Actions</th></tr></thead>
							<tbody>
								<tr v-for="v in venuesList" :key="v.id"><td>{{v.id}}</td><td>{{v.name}}</td><td>{{v.address}}</td><td>{{v.capacity}}</td><td><button class="btn btn-sm btn-outline-secondary me-2" @click="openEditVenue(v)">Edit</button><button class="btn btn-sm btn-outline-danger" @click="confirmDeleteVenue(v.id)">Delete</button></td></tr>
							</tbody>
						</table>

						<!-- Venue modal -->
						<div v-if="showVenueModal" class="modal-backdrop d-flex align-items-start justify-content-center" style="position:fixed;inset:0;z-index:1050;overflow:auto;padding-top:40px;">
							<div class="card" style="width:700px;max-width:95%;">
								<div class="card-body">
									<h5 class="card-title">{{ venueForm.id ? 'Chỉnh sửa địa điểm' : 'Tạo địa điểm mới' }}</h5>
									<div class="row g-2">
										<div class="col-md-6"><label class="form-label">Name</label><input v-model="venueForm.name" class="form-control"/></div>
										<div class="col-md-6"><label class="form-label">Capacity</label><input v-model.number="venueForm.capacity" class="form-control" type="number"/></div>
										<div class="col-12"><label class="form-label">Address</label><input v-model="venueForm.address" class="form-control"/></div>
										<div class="col-12"><label class="form-label">Description</label><textarea v-model="venueForm.description" class="form-control"></textarea></div>
									</div>
									<div class="mt-3 d-flex justify-content-end"><button class="btn btn-secondary me-2" @click="showVenueModal=false">Hủy</button><button class="btn btn-primary" @click="saveVenue">Lưu</button></div>
								</div>
							</div>
						</div>
					</div>

					<div v-if="selected === 'reviews'">
						<h4>Reviews</h4>
						<table class="table table-sm table-striped mt-3">
							<thead><tr><th>ID</th><th>Event</th><th>Rating</th><th>Name</th><th>Content</th><th>Actions</th></tr></thead>
							<tbody>
								<tr v-for="r in reviews" :key="r.id"><td>{{r.id}}</td><td>{{r.event_id}}</td><td>{{r.rating}}</td><td>{{r.name}}</td><td>{{r.content}}</td><td><button class="btn btn-sm btn-outline-danger" @click="confirmDeleteReview(r.id)">Delete</button></td></tr>
							</tbody>
						</table>
					</div>

		</main>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import {
		fetchEvents,
	getVenues,
	getCategories,
		fetchOverview,
		getArtists,
		createArtist,
		updateArtist,
		deleteArtist,
		getEventLineup,
		createLineup,
		updateLineup,
		deleteLineup,
	createEvent,
	updateEvent,
	deleteEvent,
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	getTickets,
	updateTicket,
	deleteTicket,
	createCategory,
	updateCategory,
	deleteCategory,
	createVenue,
	updateVenue,
	deleteVenue,
	getReviews,
	deleteReview,
	createTicket,
} from '../../scripts/admin';

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

const users = ref([]);
const eventsList = ref([]);
const tickets = ref([]);
const categoriesList = ref([]);
const venuesList = ref([]);
const reviews = ref([]);
const artistsList = ref([]);
const lineupEntries = ref([]);

// Event form state
const showEventModal = ref(false);
const isEditing = ref(false);
const eventForm = reactive({
	id: null,
	title: '',
	description: '',
	category_id: null,
	venue_id: null,
	start_time: '',
	end_time: '',
	standard_price: 0,
	image_file: null,
	image_url: null, // data URL for preview / sending
});
const deleting = ref(null); // id being deleted

// User modal state
const showUserModal = ref(false);
const userForm = reactive({ id: null, username: '', email: '', role: 'user', full_name: '', phone: '' });

// Ticket modal state
const showTicketModal = ref(false);
const ticketForm = reactive({ id: null, event_id: null, seat_number: null, Type: 'standard', price: 0 });

// Artists & lineup state
const showArtistModal = ref(false);
const artistForm = reactive({ id: null, name: '', bio: '', avatar_file: null, avatar_url: null });

const selectedEventForLineup = ref(null);
const showLineupModal = ref(false);
const lineupForm = reactive({ id: null, event_id: null, artist_id: null, performance_time: '' });

function resetEventForm() {
	eventForm.id = null;
	eventForm.title = '';
	eventForm.description = '';
	eventForm.category_id = null;
	eventForm.venue_id = null;
	eventForm.start_time = '';
	eventForm.end_time = '';
	eventForm.standard_price = 0;
	eventForm.image_file = null;
	eventForm.image_url = null;
}

function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		if (!file) return resolve(null);
		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function select(key) {
	selected.value = key;
	// load data for that section
	if (key === 'users') loadUsers();
	if (key === 'events') loadEvents();
	if (key === 'lineups') loadEvents();
	if (key === 'tickets') loadTickets();
	if (key === 'categories') loadCategories();
	if (key === 'venues') loadVenues();
	if (key === 'reviews') loadReviews();
}

onMounted(async () => {
	// initial stats + overview
	await loadOverview();
});

// load categories/venues early for the event form
onMounted(async () => {
	try {
		const [cats, vens, arts] = await Promise.all([getCategories(), getVenues(), getArtists()]);
		categoriesList.value = cats || [];
		venuesList.value = vens || [];
		artistsList.value = arts || [];
	} catch (err) {
		console.error('Failed to load categories or venues', err);
	}
});

async function loadOverview() {
	try {
		const res = await fetchOverview();
		stats.value[0].value = Array.isArray(res.events) ? res.events.length : '—';
		stats.value[1].value = res.users?.pagination?.total ?? (Array.isArray(res.users) ? res.users.length : '—');
		stats.value[2].value = res.tickets?.pagination?.total ?? (Array.isArray(res.tickets) ? res.tickets.length : '—');
		stats.value[3].value = '—';
	} catch (err) {
		console.error('Error loading overview', err);
	}
}

async function loadUsers() {
	try {
		const res = await getUsers({ limit: 200 });
		users.value = res.users || res.data || res || [];
	} catch (err) { console.error(err); }
}

// --- Users CRUD ---
function resetUserForm() { userForm.id = null; userForm.username = ''; userForm.email = ''; userForm.role = 'user'; userForm.full_name = ''; userForm.phone = ''; }

function openAddUser() { resetUserForm(); showUserModal.value = true; }
function openEditUser(u) { userForm.id = u.id; userForm.username = u.username; userForm.email = u.email; userForm.role = u.role || 'user'; userForm.full_name = u.full_name; userForm.phone = u.phone; showUserModal.value = true; }

async function saveUser() {
	try {
		const payload = { username: userForm.username, email: userForm.email, role: userForm.role, full_name: userForm.full_name, phone: userForm.phone };
		if (userForm.id) await updateUser(userForm.id, payload);
		else await createUser(payload);
		showUserModal.value = false;
		await loadUsers();
	} catch (err) { console.error('Failed to save user', err); alert('Lỗi khi lưu user'); }
}

async function confirmDeleteUser(id) {
	if (!confirm('Bạn có chắc muốn xóa user này?')) return;
	try { await deleteUser(id); await loadUsers(); } catch (err) { console.error(err); alert('Lỗi khi xóa user'); }
}

async function loadEvents() {
	try {
		const res = await fetchEvents();
        console.log('Fetched events:', res);
		// fetchEvents may return an array or an object with data
		eventsList.value = Array.isArray(res) ? res : res.events || res.data || [];
	} catch (err) { console.error(err); }
}

// --- Tickets CRUD ---
async function loadTickets() {
	try {
		const res = await getTickets({ limit: 200 });
		tickets.value = res.tickets || res.data || res || [];
	} catch (err) { console.error(err); }
}

function openAddTicket() {
	ticketForm.id = null;
	ticketForm.event_id = null;
	ticketForm.seat_number = null;
	ticketForm.Type = 'standard';
	ticketForm.price = 0;
	showTicketModal.value = true;
}

function openEditTicket(t) {
	ticketForm.id = t.id;
	ticketForm.event_id = t.event_id;
	ticketForm.seat_number = t.seat_number;
	ticketForm.Type = t.Type || 'standard';
	ticketForm.price = t.price;
	showTicketModal.value = true;
}

async function saveTicket() {
	try {
		const payload = { event_id: ticketForm.event_id, seat_number: ticketForm.seat_number, Type: ticketForm.Type, price: Number(ticketForm.price) };
		if (ticketForm.id) await updateTicket(ticketForm.id, payload);
		else await createTicket(payload);
		showTicketModal.value = false;
		await loadTickets();
	} catch (err) { console.error('Failed to save ticket', err); alert('Lỗi khi lưu ticket'); }
}

async function confirmDeleteTicket(id) {
	if (!confirm('Bạn có chắc muốn xóa vé này?')) return;
	try { await deleteTicket(id); await loadTickets(); } catch (err) { console.error(err); alert('Lỗi khi xóa ticket'); }
}

// --- Event CRUD UI handlers ---
function openAddEvent() {
	resetEventForm();
	isEditing.value = false;
	showEventModal.value = true;
}

function openEditEvent(ev) {
	isEditing.value = true;
	eventForm.id = ev.id;
	eventForm.title = ev.title || '';
	eventForm.description = ev.description || '';
	eventForm.category_id = ev.category_id || null;
	eventForm.venue_id = ev.venue_id || null;
	eventForm.start_time = ev.start_time ? ev.start_time.split('.').shift() : ev.start_time || '';
	eventForm.end_time = ev.end_time ? ev.end_time.split('.').shift() : ev.end_time || '';
	eventForm.standard_price = ev.standard_price || 0;
	eventForm.image_url = ev.image_url || null;
	eventForm.image_file = null;
	showEventModal.value = true;
}

async function saveEvent() {
	try {
		// prepare payload
		const payload = {
			title: eventForm.title,
			description: eventForm.description,
			category_id: eventForm.category_id,
			venue_id: eventForm.venue_id,
			start_time: eventForm.start_time,
			end_time: eventForm.end_time,
			standard_price: Number(eventForm.standard_price) || 0,
		};

		if (eventForm.image_file) {
			payload.image_url = await fileToDataUrl(eventForm.image_file);
		} else if (eventForm.image_url) {
			payload.image_url = eventForm.image_url;
		}

		if (isEditing.value && eventForm.id) {
			await updateEvent(eventForm.id, payload);
		} else {
			await createEvent(payload);
		}

		showEventModal.value = false;
		await loadEvents();
	} catch (err) {
		console.error('Failed to save event', err);
		alert('Lỗi khi lưu sự kiện. Xem console để biết chi tiết.');
	}
}

async function confirmDeleteEvent(id) {
	if (!confirm('Bạn có chắc muốn xóa sự kiện này?')) return;
	try {
		deleting.value = id;
		await deleteEvent(id);
		deleting.value = null;
		await loadEvents();
	} catch (err) {
		deleting.value = null;
		console.error('Failed to delete event', err);
		alert('Lỗi khi xóa sự kiện. Xem console để biết chi tiết.');
	}
}

// NOTE: loadTickets is implemented earlier using getTickets helper; remove duplicate axios-based loader.

async function loadCategories() {
	try {
		const res = await getCategories();
		categoriesList.value = Array.isArray(res) ? res : res.data || res || [];
	} catch (err) { console.error(err); }
}

// --- Categories CRUD ---
const showCategoryModal = ref(false);
const categoryForm = reactive({ id: null, name: '', description: '' });

function resetCategoryForm() { categoryForm.id = null; categoryForm.name=''; categoryForm.description=''; }
function openAddCategory() { resetCategoryForm(); showCategoryModal.value = true; }
function openEditCategory(c) { categoryForm.id = c.id; categoryForm.name = c.name; categoryForm.description = c.description; showCategoryModal.value = true; }

async function saveCategory() {
	try {
		const payload = { name: categoryForm.name, description: categoryForm.description };
		if (categoryForm.id) await updateCategory(categoryForm.id, payload);
		else await createCategory(payload);
		showCategoryModal.value = false;
		const fresh = await getCategories(); categoriesList.value = fresh || [];
	} catch (err) { console.error(err); alert('Lỗi khi lưu category'); }
}

async function confirmDeleteCategory(id) { if (!confirm('Xóa category?')) return; try { await deleteCategory(id); const fresh = await getCategories(); categoriesList.value = fresh || []; } catch (err) { console.error(err); alert('Lỗi khi xóa category'); } }

async function loadVenues() {
	try {
		const res = await getVenues();
		venuesList.value = res || res.data || [];
	} catch (err) { console.error(err); }
}

// --- Venues CRUD ---
const showVenueModal = ref(false);
const venueForm = reactive({ id: null, name:'', address:'', description:'', capacity:0 });

function resetVenueForm(){ venueForm.id=null; venueForm.name=''; venueForm.address=''; venueForm.description=''; venueForm.capacity=0; }
function openAddVenue(){ resetVenueForm(); showVenueModal.value=true; }
function openEditVenue(v){ venueForm.id=v.id; venueForm.name=v.name; venueForm.address=v.address; venueForm.description=v.description; venueForm.capacity=v.capacity; showVenueModal.value=true; }

async function saveVenue(){ try{ const payload={ name:venueForm.name,address:venueForm.address,description:venueForm.description,capacity:venueForm.capacity }; if(venueForm.id) await updateVenue(venueForm.id,payload); else await createVenue(payload); showVenueModal.value=false; await loadVenues(); }catch(err){console.error(err); alert('Lỗi khi lưu venue');} }

async function confirmDeleteVenue(id){ if(!confirm('Xóa venue?')) return; try{ await deleteVenue(id); await loadVenues(); }catch(err){console.error(err); alert('Lỗi khi xóa venue');} }

async function loadReviews() {
	try {
		const res = await getReviews({ limit: 200 });
		reviews.value = res || res.data || [];
	} catch (err) { console.error(err); }
}

async function confirmDeleteReview(id){ if(!confirm('Xóa review?')) return; try{ await deleteReview(id); await loadReviews(); }catch(err){ console.error(err); alert('Lỗi khi xóa review'); } }

// ------------------------
// Artists & Lineup actions
// ------------------------

async function loadArtists() {
	try {
		const res = await getArtists();
		artistsList.value = res || res.data || [];
	} catch (err) { console.error('Failed to load artists', err); }
}

function resetArtistForm() { artistForm.id = null; artistForm.name = ''; artistForm.bio = ''; artistForm.avatar_file = null; artistForm.avatar_url = null; }
function openAddArtist() { resetArtistForm(); showArtistModal.value = true; }
function openEditArtist(a) { artistForm.id = a.id; artistForm.name = a.name; artistForm.bio = a.bio; artistForm.avatar_file = null; artistForm.avatar_url = a.avatar_url || null; showArtistModal.value = true; }

async function saveArtist() {
	try {
		const payload = { name: artistForm.name, bio: artistForm.bio };
		if (artistForm.avatar_file) {
			payload.avatar_url = await fileToDataUrl(artistForm.avatar_file);
		} else if (artistForm.avatar_url) {
			payload.avatar_url = artistForm.avatar_url;
		}

		if (artistForm.id) await updateArtist(artistForm.id, payload);
		else await createArtist(payload);

		showArtistModal.value = false;
		await loadArtists();
	} catch (err) { console.error('Failed to save artist', err); alert('Lỗi khi lưu artist'); }
}

async function confirmDeleteArtist(id) { if (!confirm('Xóa artist?')) return; try { await deleteArtist(id); await loadArtists(); } catch (err) { console.error(err); alert('Lỗi khi xóa artist'); } }

async function loadLineupForEvent() {
	try {
		if (!selectedEventForLineup) { alert('Chọn event trước.'); return; }
		const res = await getEventLineup({ event_id: selectedEventForLineup });
		lineupEntries.value = res || [];
	} catch (err) { console.error('Failed to load lineup', err); }
}

function openAddLineup() { lineupForm.id = null; lineupForm.event_id = selectedEventForLineup || null; lineupForm.artist_id = null; lineupForm.performance_time = ''; showLineupModal.value = true; }
function openEditLineup(l) { lineupForm.id = l.id; lineupForm.event_id = l.event_id; lineupForm.artist_id = l.artist_id; lineupForm.performance_time = l.performance_time ? l.performance_time.split('.').shift() : ''; showLineupModal.value = true; }

async function saveLineup() {
	try {
		const payload = { event_id: lineupForm.event_id, artist_id: lineupForm.artist_id, performance_time: lineupForm.performance_time };
		if (lineupForm.id) await updateLineup(lineupForm.id, payload);
		else await createLineup(payload);
		showLineupModal.value = false;
		if (lineupForm.event_id) { selectedEventForLineup.value = lineupForm.event_id; await loadLineupForEvent(); }
	} catch (err) { console.error('Failed to save lineup', err); alert('Lỗi khi lưu lineup'); }
}

async function confirmDeleteLineup(id) { if (!confirm('Xóa lineup entry?')) return; try { await deleteLineup(id); await loadLineupForEvent(); } catch (err) { console.error(err); alert('Lỗi khi xóa lineup'); } }
</script>

<style scoped>
aside { min-height: 100vh; }
main { background: #f8f9fa; }
</style>
