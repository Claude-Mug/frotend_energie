import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // adapte selon ton backend
  // ...autres options si besoin...
});

export default instance;
