import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const api = axios.create({ baseURL: API_BASE_URL });

export const getDashboardStats = () => api.get('/dashboard');
export const getTransactions = () => api.get('/transactions');
export const getAnalyticsData = () => api.get('/analytics');
export const predictFraud = (transactionData) => api.post('/predict', transactionData);

export default api;