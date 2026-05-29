import api from './client';
export async function sendOtp(phone: string) { const { data } = await api.post('/api/auth/send-otp', { phone }); return data; }
export async function verifyOtp(phone: string, otp: string) { const { data } = await api.post('/api/auth/verify-otp', { phone, otp }); return data; }

