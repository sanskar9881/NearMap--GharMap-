import { create } from 'zustand';

interface Connection {
  id:string; listingId:string; seekerId:string; ownerId:string;
  status:'none'|'pending'|'approved'|'declined';
  message:string; phoneUnlocked:boolean; createdAt:string; updatedAt:string;
}
interface ConnectionStore {
  connections: Record<string, Connection>;
  setConnection: (listingId:string, conn:Connection) => void;
  getStatus: (listingId:string) => 'none'|'pending'|'approved'|'declined';
}
export const useConnectionStore = create<ConnectionStore>((set,get) => ({
  connections:{},
  setConnection: (listingId,conn) => set(s => ({ connections:{ ...s.connections, [listingId]:conn } })),
  getStatus:     (listingId)      => get().connections[listingId]?.status ?? 'none',
}));