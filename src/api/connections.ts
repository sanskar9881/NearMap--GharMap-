import api from './client';
export async function requestConnect(l:string,m:string){const{data}=await api.post('/api/connections/request',{listingId:l,message:m});return data.connection;}
export async function approveRequest(id:string){const{data}=await api.post(`/api/connections/${id}/approve`);return data.connection;}
export async function declineRequest(id:string){const{data}=await api.post(`/api/connections/${id}/decline`);return data.connection;}
export async function unlockPhone(id:string){const{data}=await api.post('/api/connections/unlock-phone',{connectionId:id});return data;}
export async function fetchMyConnections(){const{data}=await api.get('/api/connections/mine');return data.connections;}
export async function fetchIncomingRequests(){const{data}=await api.get('/api/connections/requests');return data.requests;}
