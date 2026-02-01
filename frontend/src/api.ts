import axios from 'axios';
import type { Beverage, Order } from './types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
    getBeverages: async (): Promise<Beverage[]> => {
        const response = await axios.get<Beverage[]>(`${API_BASE_URL}/beverages`);
        return response.data;
    },

    createOrder: async (order: Order) => {
        const response = await axios.post(`${API_BASE_URL}/orders`, order);
        return response.data;
    }
};