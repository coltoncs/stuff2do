import { create } from "zustand";
import { events as jsonEvents } from "./events";

interface MapState {
  events: any[];
  date: Date;
  setDate: (date: Date) => void;
}

const useMapStore = create<MapState>()((set) => ({
  events: jsonEvents,
  date: new Date(),
  setDate: (date: Date) => {
    const filteredEvents = jsonEvents.filter((event) => {
      const eventDate = new Date(event.date).toDateString();
      const selectedDate = date.toDateString();
      return eventDate === selectedDate;
    });
    set(() => ({ events: filteredEvents }));
    set((state) => ({ date: state.date }));
  },
}));

export default useMapStore;
