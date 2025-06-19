import axios from "axios";
const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/listings'; // adjust as needed

export const fetchListings = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};
