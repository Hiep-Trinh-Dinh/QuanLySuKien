import axios from "axios";

export async function getEventByCategory(category_id, event_id) {
  try {
    const res = await axios.get(
      `http://localhost:3000/events/category/${category_id}/exclude/${event_id}`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
