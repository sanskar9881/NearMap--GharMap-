import api from './client';
export async function fetchConversations(){const{data}=await api.get('/api/chat/conversations');return data.conversations;}
export async function fetchMessages(id:string){const{data}=await api.get(`/api/chat/${id}/messages`);return data.messages;}
