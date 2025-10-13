import axios from 'axios'
export async function fetchEvents(eventsRef) {
  try {
    const res = await axios.get('http://localhost:3000/events');
    eventsRef.value = res.data;
  } catch (err) {
    eventsRef.value = [];
  }
}