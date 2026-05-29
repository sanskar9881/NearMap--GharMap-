import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string; name: string; phone: string; email?: string;
  profilePhoto?: string; bio?: string; occupation?: string;
  isOtpVerified: boolean; isEmailVerified: boolean;
  isIdVerified: boolean; isAadhaarVerified: boolean;
  isBroker: boolean; credits: number; createdAt: string;
}
interface AuthStore {
  user: User | null; token: string | null; isLoggedIn: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}
export const useAuthStore = create<AuthStore>()(persist((set) => ({
  user:null, token:null, isLoggedIn:false,
  setAuth:   (user,token) => set({ user, token, isLoggedIn:true }),
  logout:    ()           => set({ user:null, token:null, isLoggedIn:false }),
  updateUser:(data)       => set(s => ({ user: s.user ? { ...s.user, ...data } : null })),
}), { name:'gharmap-auth', storage: createJSONStorage(() => AsyncStorage) }));