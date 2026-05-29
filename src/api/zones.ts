import api from './client';
export async function fetchZones(city:string){const{data}=await api.get('/api/zones',{params:{city}});return data.zones;}
export async function fetchListingsByZone(zoneId:string,filters:any){const{data}=await api.get(`/api/zones/${zoneId}/listings`,{params:filters});return data.listings;}
export async function fetchListingById(listingId:string){const{data}=await api.get(`/api/listings/${listingId}`);return data.listing;}
