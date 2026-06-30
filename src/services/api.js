import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://financial-fraud-detection-using-xgboost.onrender.com/';
const api = axios.create({ baseURL: API_BASE_URL });

export const getDashboardStats = () => api.get('/dashboard');
export const getTransactions = () => api.get('/transactions');
export const getAnalyticsData = () => api.get('/analytics');
export const predictFraud = (transactionData) => api.post('/predict', transactionData);

export default api;