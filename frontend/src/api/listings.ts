import axios from "axios";
const API_URL = "https://stayfinder-backend-5wmn.onrender.com"; // adjust as needed

export const fetchListings = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};
