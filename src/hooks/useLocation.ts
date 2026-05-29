import { useState } from 'react';
import * as Location from 'expo-location';
export function useLocation(){
  const [location,setLocation]=useState<Location.LocationObject|null>(null);
  const [error,setError]=useState<string|null>(null);
  const requestLocation=async()=>{
    const{status}=await Location.requestForegroundPermissionsAsync();
    if(status!=='granted'){setError('Permission denied');return null;}
    const loc=await Location.getCurrentPositionAsync({});
    setLocation(loc);return loc;
  };
  return{location,error,requestLocation};
}
