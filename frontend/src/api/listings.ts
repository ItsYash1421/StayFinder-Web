import axios from "axios";
const API_URL = "http://localhost:8000/api/listings"; // adjust as needed

export const fetchListings = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};