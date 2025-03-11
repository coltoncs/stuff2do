import { create } from "zustand";
import { events as jsonEvents } from "./data/events";
import { haversineDistanceKM, matchesTodaysDate } from "./utils/helpers";

type Event = {
  id: string,
  name: string,
  cost: string,
  url: string,
  date: string,
  streetaddr: string,
  city: string,
  times: string,
  location: string,
  coordinates: [number, number],
  googleMapsUrl: string,
  datetime: string,
  routes?: any[],
}

interface MapState {
  selectedEvents: Event[] | null;
  events: any[];
  date: Date;
  geolocation: GeolocationCoordinates | null;
  routes: any[] | null;
  setEventsForGeolocation: (coords: GeolocationCoordinates) => void;
  setDate: (date: Date) => void;
  setSelectedEvents: (event: Event[] | null) => void;
  setRoutes: (route: any[] | null) => void;
}

const useMapStore = create<MapState>()((set) => ({
  selectedEvents: null,
  events: jsonEvents.filter(matchesTodaysDate),
  date: new Date(),
  geolocation: null,
  routes: null,
  setEventsForGeolocation: (coords) => {
    const filteredEvents = jsonEvents
      .filter(matchesTodaysDate)
      .sort(
        (event1, event2) => 
          haversineDistanceKM(event1.coordinates, [coords.latitude, coords.longitude]) - haversineDistanceKM(event2.coordinates, [coords.latitude, coords.longitude])
      );
    set({ events: filteredEvents, geolocation: coords })
  },
  setDate: (date) => {
    let filteredEvents = jsonEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
    set(state => { 
      if (state.geolocation) {
        // we have the users coordinates, sort the events by proximity
        filteredEvents = filteredEvents.sort(
          (event1, event2) => 
            haversineDistanceKM(
              event1.coordinates, 
              [state.geolocation!.latitude, state.geolocation!.longitude]
            ) - haversineDistanceKM(
              event2.coordinates, 
              [state.geolocation!.latitude, state.geolocation!.longitude]
            )
        )
      }
      return { date: date, events: filteredEvents, routes: null }
     });
  },
  setSelectedEvents: (event: Event[] | null) => {
    set(state => {
      if (state.routes) {
        return { selectedEvents: event, routes: state.routes };
      }
      return { selectedEvents: event, routes: null };
    });
  },
  setRoutes: (routes: any[] | null) => {
    set({ routes });
  }
}));

export default useMapStore;
