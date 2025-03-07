import useMapStore from '~/store';
import { FiExternalLink } from 'react-icons/fi';
import { IoMdBicycle, IoMdCar, IoMdWalk } from 'react-icons/io';

export const EventViewer = () => {
  const event = useMapStore((state) => state.event);
  const geolocation = useMapStore((state) => state.geolocation);
  const routes = useMapStore((state) => state.routes)
  const setRoutes = useMapStore((state) => state.setRoutes);

  const handleDriveDirections = async () => {
    const profile = 'mapbox/driving';
    const eventCoordsSplit = event?.coordinates.substring(1, event.coordinates.length - 1);
    const coords = eventCoordsSplit.split(',');
    const formattedCoords = `${coords[1]},${coords[0]}`;
    const userCoords = `${geolocation?.longitude},${geolocation?.latitude}`;
    const req = await fetch(`https://api.mapbox.com/directions/v5/${profile}/${userCoords};${formattedCoords}?geometries=geojson&access_token=pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdzlsMDd5NDAybGsybG1td2c2Z2QwazkifQ.0a3dDvVgzpwLwMGHmnY4VQ`);
    const res = await req.json();
    if (res.code === 'Ok') {
      const { routes } = res;
      setRoutes(routes);
    }
  }
  const handleWalkDirections = async () => {
    const profile = 'mapbox/walking';
    const eventCoordsSplit = event?.coordinates.substring(1, event.coordinates.length - 1);
    const coords = eventCoordsSplit.split(',');
    const formattedCoords = `${coords[1]},${coords[0]}`;
    const userCoords = `${geolocation?.longitude},${geolocation?.latitude}`;
    const req = await fetch(`https://api.mapbox.com/directions/v5/${profile}/${userCoords};${formattedCoords}?geometries=geojson&walkway_bias=1&access_token=pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdzlsMDd5NDAybGsybG1td2c2Z2QwazkifQ.0a3dDvVgzpwLwMGHmnY4VQ`);
    const res = await req.json();
    if (res.code === 'Ok') {
      const { routes } = res;
      setRoutes(routes);
    }
  }
  const handleCycleDirections = async () => {
    const profile = 'mapbox/cycling';
    const eventCoordsSplit = event?.coordinates.substring(1, event.coordinates.length - 1);
    const coords = eventCoordsSplit.split(',');
    const formattedCoords = `${coords[1]},${coords[0]}`;
    const userCoords = `${geolocation?.longitude},${geolocation?.latitude}`;
    const req = await fetch(`https://api.mapbox.com/directions/v5/${profile}/${userCoords};${formattedCoords}?geometries=geojson&access_token=pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdzlsMDd5NDAybGsybG1td2c2Z2QwazkifQ.0a3dDvVgzpwLwMGHmnY4VQ`);
    const res = await req.json();
    if (res.code === 'Ok') {
      const { routes } = res; 
      console.log(routes);
      setRoutes(routes);
    }
  }

  return event && (
    <div className="fixed rounded border bottom-1/10 left-0 w-dvw sm:bottom-1/10 sm:left-25/100 sm:w-1/2 bg-gray-800 border-slate-600 p-5 h-fit shadow-lg shadow-slate-950">
      <h2 className='text-base font-bold text-blue-200 hover:text-blue-500'><a href={event.url} className='flex justify-center items-center gap-2 text-center' target="_blank">{event.name}<FiExternalLink size="10px" /></a></h2>
      <p className='text-sm font-bold text-blue-200 hover:text-blue-500'><a className='flex justify-center items-center gap-2 text-center' href={event.googleMapsUrl} target="_blank">{event.location}<FiExternalLink size="10px" /></a></p>
      <p className='w-full text-center'>
        {event.date}
        {
          !event.datetime.includes('undefined') &&
          ` @ ${Intl.DateTimeFormat('us-EN', { timeStyle: 'short' }).format(new Date(event.datetime))}`
        }
      </p>
      <p className='w-full text-center'>{event.cost}</p>
      {/* {geolocation && (
        <div className='w-full flex justify-center gap-5 mt-5'>
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
      {routes && (
        routes.map(route => <div><p>{(route.duration / 60).toFixed(1)} minutes</p><p>{(route.distance / 1609).toFixed(1)} mi</p></div>)
      )} */}
    </div>
  )
}