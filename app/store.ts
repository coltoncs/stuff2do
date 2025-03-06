import { create } from "zustand";
import { events, events as jsonEvents } from "./events";

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
  datetime: string
}

interface MapState {
  event: Event | null;
  events: any[];
  date: Date;
  geolocation: GeolocationCoordinates | null;
  routes: any[] | null;
  setEventsForGeolocation: (coords: GeolocationCoordinates) => void;
  setDate: (date: Date) => void;
  setEvent: (event: Event | null) => void;
  setRoutes: (route: any[]) => void;
}

const matchesTodaysDate = (event) => {
  const eventDate = new Date(event.date);
  const todaysDate = new Date();
  todaysDate.setUTCHours(8)
  return eventDate.toDateString() === todaysDate.toDateString();
}

const useMapStore = create<MapState>()((set) => ({
  event: null,
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
      return { date: date, events: filteredEvents }
     });
  },
  setEvent: (event: Event | null) => {
    set({ event });
  },
  setRoutes: (routes: any[]) => {
    set({ routes });
  }
}));

function haversineDistanceKM(coord1: number[], coord2: number[]) {
  function toRad(degree: number) {
      return degree * Math.PI / 180;
  }

  const [lat1Deg, lon1Deg] = coord1;
  const [lat2Deg, lon2Deg] = coord2;
  
  const lat1 = toRad(lat1Deg);
  const lon1 = toRad(lon1Deg);
  const lat2 = toRad(lat2Deg);
  const lon2 = toRad(lon2Deg);
  
  const { sin, cos, sqrt, atan2 } = Math;
  
  const R = 6371; // earth radius in km 
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a = sin(dLat / 2) * sin(dLat / 2)
          + cos(lat1) * cos(lat2)
          * sin(dLon / 2) * sin(dLon / 2);
  const c = 2 * atan2(sqrt(a), sqrt(1 - a)); 
  const d = R * c;
  return d; // distance in km
}

export default useMapStore;
