import axios from "axios";

const API_URL = "http://localhost:3000"; // phù hợp với server/index.js


export async function createEvent(eventData) {
  try {
    const res = await axios.post(`${API_URL}/create-event`, eventData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo sự kiện:", error);
    throw error;
  }
}

export async function getVenues() {
  try {
    const res = await axios.get(`${API_URL}/venues`);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy venues:', error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy categories:', error);
    throw error;
  }
}

// Fetch overview stats used by admin dashboard
export async function fetchOverview() {
  try {
    const [eRes, uRes, tRes, revRes] = await Promise.all([
      axios.get(`${API_URL}/events`),
      axios.get(`${API_URL}/admin/users?limit=1`),
      axios.get(`${API_URL}/admin/tickets?limit=1`),
      axios.get(`${API_URL}/admin/reviews?limit=1`),
    ]);
    return {
      events: eRes.data,
      users: uRes.data,
      tickets: tRes.data,
      reviews: revRes.data,
    };
  } catch (error) {
    console.error('Lỗi khi lấy overview:', error);
    throw error;
  }
}

// ------------------------
// Generic CRUD helpers
// ------------------------

// EVENTS
export async function fetchEvents(params = {}) {
  try {
    const res = await axios.get(`${API_URL}/events`, { params });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách events:', error);
    throw error;
  }
}

export async function getEventById(id) {
  try {
    const res = await axios.get(`${API_URL}/events/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi lấy event ${id}:`, error);
    throw error;
  }
}

export async function updateEvent(id, data) {
  try {
    const res = await axios.put(`${API_URL}/admin/events/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật event ${id}:`, error);
    throw error;
  }
}

export async function deleteEvent(id) {
  try {
    const res = await axios.delete(`${API_URL}/admin/events/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa event ${id}:`, error);
    throw error;
  }
}

// USERS
export async function getUsers(params = {}) {
  try {
    const res = await axios.get(`${API_URL}/admin/users`, { params });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy users:', error);
    throw error;
  }
}

export async function createUser(userData) {
  try {
    const res = await axios.post(`${API_URL}/admin/users`, userData);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi tạo user:', error);
    throw error;
  }
}

export async function updateUser(id, data) {
  try {
    const res = await axios.put(`${API_URL}/admin/users/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật user ${id}:`, error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const res = await axios.delete(`${API_URL}/admin/users/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa user ${id}:`, error);
    throw error;
  }
}

// TICKETS
export async function getTickets(params = {}) {
  try {
    const res = await axios.get(`${API_URL}/admin/tickets`, { params });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy tickets:', error);
    throw error;
  }
}

export async function createTicket(data) {
  try {
    const res = await axios.post(`${API_URL}/admin/tickets`, data);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi tạo ticket:', error);
    throw error;
  }
}

export async function updateTicket(id, data) {
  try {
    const res = await axios.put(`${API_URL}/admin/tickets/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật ticket ${id}:`, error);
    throw error;
  }
}

export async function deleteTicket(id) {
  try {
    const res = await axios.delete(`${API_URL}/admin/tickets/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa ticket ${id}:`, error);
    throw error;
  }
}

// CATEGORIES
export async function createCategory(data) {
  try {
    const res = await axios.post(`${API_URL}/categories`, data);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi tạo category:', error);
    throw error;
  }
}

export async function updateCategory(id, data) {
  try {
    const res = await axios.put(`${API_URL}/categories/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật category ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    const res = await axios.delete(`${API_URL}/categories/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa category ${id}:`, error);
    throw error;
  }
}

// VENUES
export async function createVenue(data) {
  try {
    const res = await axios.post(`${API_URL}/venues`, data);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi tạo venue:', error);
    throw error;
  }
}

export async function updateVenue(id, data) {
  try {
    const res = await axios.put(`${API_URL}/venues/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật venue ${id}:`, error);
    throw error;
  }
}

export async function deleteVenue(id) {
  try {
    const res = await axios.delete(`${API_URL}/venues/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa venue ${id}:`, error);
    throw error;
  }
}

// REVIEWS
export async function getReviews(params = {}) {
  try {
    const res = await axios.get(`${API_URL}/reviews`, { params });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy reviews:', error);
    throw error;
  }
}

export async function deleteReview(id) {
  try {
    const res = await axios.delete(`${API_URL}/admin/reviews/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa review ${id}:`, error);
    throw error;
  }
}

// ------------------------
// Artists & Lineup helpers
// ------------------------

export async function getArtists(params = {}) {
  try {
    const res = await axios.get(`${API_URL}/admin/artists`, { params });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy artists:', error);
    throw error;
  }
}

export async function createArtist(data) {
  try {
    const res = await axios.post(`${API_URL}/admin/artists`, data);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi tạo artist:', error);
    throw error;
  }
}

export async function updateArtist(id, data) {
  try {
    const res = await axios.put(`${API_URL}/admin/artists/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật artist ${id}:`, error);
    throw error;
  }
}

export async function deleteArtist(id) {
  try {
    const res = await axios.delete(`${API_URL}/admin/artists/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa artist ${id}:`, error);
    throw error;
  }
}

// Lineup entries
export async function getEventLineup(params = {}) {
  try {
    // public endpoint exists: /event-lineup?event_id=...
    const res = await axios.get(`${API_URL}/event-lineup`, { params });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy event lineup:', error);
    throw error;
  }
}

export async function createLineup(data) {
  try {
    const res = await axios.post(`${API_URL}/admin/event-lineup`, data);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi tạo lineup:', error);
    throw error;
  }
}

export async function updateLineup(id, data) {
  try {
    const res = await axios.put(`${API_URL}/admin/event-lineup/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật lineup ${id}:`, error);
    throw error;
  }
}

export async function deleteLineup(id) {
  try {
    const res = await axios.delete(`${API_URL}/admin/event-lineup/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa lineup ${id}:`, error);
    throw error;
  }
}

// ------------------------
// Support (admin)
// ------------------------
export async function getSupportTickets(params = {}) {
  try {
    const res = await axios.get(`${API_URL}/admin/support-tickets`, { params });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy support tickets:', error);
    throw error;
  }
}

export async function updateSupportTicket(id, data) {
  try {
    const res = await axios.put(`${API_URL}/admin/support-tickets/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật support ticket ${id}:`, error);
    throw error;
  }
}
