import axios from "axios";
const API_URL = "http://localhost:8000/api/bookings"; // adjust as needed

export const bookListing = async (listingId: string, date: string, token: string) => {
  const { data } = await axios.post(
    API_URL,
    { listingId, date },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};