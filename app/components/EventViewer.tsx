import useMapStore from '~/store';
import { FiExternalLink } from 'react-icons/fi';
import { IoMdBicycle, IoMdCar, IoMdWalk } from 'react-icons/io';
import { useMap, type LngLatLike } from 'react-map-gl/mapbox';

export const EventViewer = () => {
  const selectedEvents = useMapStore((state) => state.selectedEvents);
  const geolocation = useMapStore((state) => state.geolocation);
  const setRoutes = useMapStore((state) => state.setRoutes);
  const { current: map } = useMap();

  const handleDriveDirections = () => {
    const profile = 'mapbox/driving';
    getDirections(profile);
  }
  const handleWalkDirections = () => {
    const profile = 'mapbox/walking';
    getDirections(profile);
  }
  const handleCycleDirections = () => {
    const profile = 'mapbox/cycling';
    getDirections(profile);
  }

  const getDirections = async (profile: string) => {
    let coords;
    const event = selectedEvents && selectedEvents[0];
    if (typeof event?.coordinates === 'string') {
      const eventCoordsSplit = event?.coordinates.substring(1, event.coordinates.length - 1);
      coords = eventCoordsSplit.split(',');
    } else {
      coords = event?.coordinates;
    }
    const formattedCoords = `${coords[1]},${coords[0]}`;
    const userCoords = `${geolocation?.longitude},${geolocation?.latitude}`;
    const req = await fetch(`https://api.mapbox.com/directions/v5/${profile}/${userCoords};${formattedCoords}?geometries=geojson&alternatives=true&access_token=pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdzlsMDd5NDAybGsybG1td2c2Z2QwazkifQ.0a3dDvVgzpwLwMGHmnY4VQ`);
    const res = await req.json();
    if (res.code === 'Ok') {
      const { routes } = res;
      setRoutes(routes);
      map?.flyTo({
        center: [geolocation?.longitude, geolocation?.latitude] as LngLatLike,
        zoom: 20,
        bearing: geolocation?.heading || 0,
      })
    }
  }

  return selectedEvents && (
    <div className="fixed rounded border bottom-1/10 left-0 w-dvw sm:bottom-1/10 sm:left-25/100 sm:w-1/2 bg-gray-800 border-slate-600 p-5 h-fit shadow-lg shadow-slate-950">
      {selectedEvents.map(e => (
        <div className='bg-gray-700 rounded p-2 my-2 shadow-lg shadow-gray-800'>
          <h2 className='text-base font-bold text-blue-200 hover:text-blue-500'><a href={e.url} className='flex justify-center items-center gap-2 text-center' target="_blank">{e.name}<FiExternalLink size="10px" /></a></h2>
          <p className='text-sm font-bold text-blue-200 hover:text-blue-500'><a className='flex justify-center items-center gap-2 text-center' href={e.googleMapsUrl} target="_blank">{e.location}<FiExternalLink size="10px" /></a></p>
          <p className='w-full text-center'>
            {e.date}
            {
              !e.datetime.includes('undefined') &&
              ` @ ${Intl.DateTimeFormat('us-EN', { timeStyle: 'short' }).format(new Date(e.datetime))}`
            }
          </p>
          <p className='w-full text-center'>{e.cost}</p>
        </div>
      )) }
      {geolocation && (
        <div className='w-full flex justify-center gap-5 my-5'>
          <button
            onClick={handleDriveDirections}
            className='bg-slate-600 hover:bg-slate-300 px-5 py-2 rounded-md border-2 border-slate-400 cursor-pointer'>
            <IoMdCar size='25px' />
          </button>
          <button
            onClick={handleCycleDirections}
            className='bg-slate-600 hover:bg-slate-300 px-5 py-2 rounded-md border-2 border-slate-400 cursor-pointer'>
            <IoMdBicycle size='25px' />
          </button>
          <button
            onClick={handleWalkDirections}
            className='bg-slate-600 hover:bg-slate-300 px-5 py-2 rounded-md border-2 border-slate-400 cursor-pointer'>
            <IoMdWalk size='25px' />
          </button>
        </div>
      )}
    </div>
  )
}