import axios from "axios";
const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/bookings';// adjust as needed

export const bookListing = async (listingId: string, date: string, token: string) => {
  const { data } = await axios.post(
    API_URL,
    { listingId, date },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
