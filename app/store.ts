import { create } from "zustand";
import { events as jsonEvents } from "./events";

interface MapState {
  zoom: number;
  events: any[];
  date: Date;
  setDate: (date: Date) => void;
  setZoom: (zoom: number) => void;
}

const useMapStore = create<MapState>()((set) => ({
  zoom: 10,
  events: jsonEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const todaysDate = new Date();
    todaysDate.setUTCHours(8)
    return eventDate.toDateString() === todaysDate.toDateString();
  }),
  date: new Date(),
  setDate: (date: Date) => {
    const filteredEvents = jsonEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
    set((state) => ({ date: date, events: filteredEvents }));
  },
  setZoom: (zoom: number) => {
    set({ zoom });
  }
}));

export default useMapStore;
