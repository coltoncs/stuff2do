export function haversineDistanceKM(coord1: number[], coord2: number[]) {
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

export const matchesTodaysDate = (event: any) => {
  const eventDate = new Date(event.date);
  const todaysDate = new Date();
  todaysDate.setUTCHours(8);
  return eventDate.toDateString() === todaysDate.toDateString();
}