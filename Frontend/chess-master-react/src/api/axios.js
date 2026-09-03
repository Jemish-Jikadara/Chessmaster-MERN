import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chess-master-algd.onrender.com/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;