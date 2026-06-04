import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const remoteApi = {
  getStatus: () => client.get('/remote/status'),
  connect: () => client.post('/remote/connect'),
  sendKey: (keycode: number) => client.post('/remote/key', { keycode }),
  sendText: (text: string) => client.post('/remote/text', { text }),
  sendSwipe: (x1: number, y1: number, x2: number, y2: number, duration: number = 300) => 
    client.post('/remote/swipe', { x1, y1, x2, y2, duration }),
};

export default client;
