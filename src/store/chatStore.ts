import { create } from 'zustand';
interface ChatStore {
  unreadCount: number;
  setUnreadCount: (n:number) => void;
  decrementUnread: () => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  unreadCount:3,
  setUnreadCount:  n => set({ unreadCount:n }),
  decrementUnread: () => set(s => ({ unreadCount:Math.max(0,s.unreadCount-1) })),
}));