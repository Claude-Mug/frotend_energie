import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://gestion-energie.onrender.com', // adapte selon ton backend
  // ...autres options si besoin...
});

export default instance;
