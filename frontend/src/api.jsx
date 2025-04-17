// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8800'; // backend URL

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//  call procedure
export const callProcedure = async (endpoint, data) => {
    try {
        const response = await apiClient.post(`/proc/${endpoint}`, data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error calling procedure ${endpoint}:`, error.response || error);
        return { success: false, error: error.response?.data?.message || 'An unexpected error occurred.' };
    }
};

// get data from view
export const getViewData = async (endpoint) => {
    try {
        const response = await apiClient.get(`/view/${endpoint}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error getting view ${endpoint}:`, error.response || error);
        return { success: false, error: error.response?.data?.message || 'Failed to fetch data.' };
    }
};