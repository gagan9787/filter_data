import axios from 'axios';
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'http://159.223.84.96:3000/api/v0/'
    : 'http://localhost:4000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

});

export default api;