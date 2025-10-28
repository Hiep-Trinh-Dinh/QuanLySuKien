import axios from 'axios';

export async function eventReview(event_id, user_id, rating, name, email, phone, comment) {
  try {
    
    const requestData = { event_id, user_id, rating, name, email, phone, content: comment };
    console.log('EventReview.js - Request data:', requestData);
    
    const res = await axios.post('http://localhost:3000/event-review', requestData);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}