import { create } from 'zustand';
import { PUNE_ZONES } from '../data/zones';

interface ZoneStore {
  zones: typeof PUNE_ZONES; selectedZone: typeof PUNE_ZONES[0] | null;
  zoneListings: any[]; filters: any; loadingListings: boolean;
  setSelectedZone: (z: typeof PUNE_ZONES[0] | null) => void;
  setZoneListings: (l: any[]) => void;
  setFilters: (f: any) => void;
  setLoadingListings: (v: boolean) => void;
  clearZone: () => void;
}
export const useZoneStore = create<ZoneStore>((set) => ({
  zones:PUNE_ZONES, selectedZone:null, zoneListings:[], filters:{}, loadingListings:false,
  setSelectedZone:    z => set({ selectedZone:z }),
  setZoneListings:    l => set({ zoneListings:l }),
  setFilters:         f => set({ filters:f }),
  setLoadingListings: v => set({ loadingListings:v }),
  clearZone:          () => set({ selectedZone:null, zoneListings:[] }),
}));