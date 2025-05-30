import useMapStore from '~/store';
import { FiExternalLink } from 'react-icons/fi';
import { IoMdBicycle, IoMdCar, IoMdWalk } from 'react-icons/io';
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const EventViewer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedEvents, setCollapsedEvents] = useState<Record<string, boolean>>({});
  const selectedEvents = useMapStore((state) => state.selectedEvents);
  const geolocation = useMapStore((state) => state.geolocation);
  const setRoutes = useMapStore((state) => state.setRoutes);
  const containerRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleEvent = (eventId: string) => {
    setCollapsedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));

    const contentElement = document.getElementById(`event-content-${eventId}`);
    if (contentElement) {
      gsap.to(contentElement, {
        height: collapsedEvents[eventId] ? 'auto' : 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }
  };

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
    const formattedCoords = `${coords![1]},${coords![0]}`;
    const userCoords = `${geolocation?.longitude},${geolocation?.latitude}`;
    const req = await fetch(`https://api.mapbox.com/directions/v5/${profile}/${userCoords};${formattedCoords}?geometries=geojson&alternatives=true&access_token=pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdzlsMDd5NDAybGsybG1td2c2Z2QwazkifQ.0a3dDvVgzpwLwMGHmnY4VQ`);
    const res = await req.json();
    if (res.code === 'Ok') {
      const { routes } = res;
      setRoutes(routes);
    }
  }

  return selectedEvents && (
    <div className="fixed bottom-20 sm:bottom-10 left-0 w-full sm:left-1/4 sm:w-1/2 bg-slate-900/95 backdrop-blur-md 
                    border-t border-slate-800/50 shadow-2xl transform transition-transform duration-300
                    rounded-2xl overflow-hidden">
      <div ref={containerRef} className="p-6">
        {selectedEvents.map((event) => (
          <div key={event.id} className="bg-slate-800/50 rounded-xl mb-4 last:mb-0 border border-slate-700/50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleEvent(event.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <h2 className="text-lg font-semibold text-slate-100">
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.name}
                  <FiExternalLink className="text-orange-400" size={16} />
                </a>
              </h2>
              {collapsedEvents[event.id] ? <IoChevronUp size={20} className="text-slate-300" /> : <IoChevronDown size={20} className="text-slate-300" />}
            </button>
            
            <div 
              id={`event-content-${event.id}`} 
              className={`px-4 pb-4 ${collapsedEvents[event.id] ? 'h-0' : 'h-auto'} overflow-hidden`}
            >
              <div className="space-y-3">
                {/* Location */}
                <p className="text-slate-300">
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-200"
                  >
                    {event.location}
                    <FiExternalLink className="text-orange-400" size={14} />
                  </a>
                </p>

                {/* Description */}
                {event.description && (
                  <p className="text-slate-400 text-sm">{event.description}</p>
                )}

                {/* Date and Time */}
                <div className="flex items-center gap-2 text-slate-300">
                  <span>{Intl.DateTimeFormat('us-EN', { dateStyle: 'full' }).format(new Date(event.date))}</span>
                  <span>•</span>
                  <span>
                    {event.times}
                  </span>
                </div>

                {/* Cost */}
                {event.cost && (
                  <p className="text-orange-400 font-medium">{event.cost}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Directions Buttons */}
        {geolocation && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleDriveDirections}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 
                       text-slate-300 rounded-lg transition-all duration-200 
                       border border-slate-700/50 hover:border-orange-500/50
                       focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <IoMdCar size={20} />
              <span>Drive</span>
            </button>

            <button
              onClick={handleCycleDirections}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 
                       text-slate-300 rounded-lg transition-all duration-200 
                       border border-slate-700/50 hover:border-orange-500/50
                       focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <IoMdBicycle size={20} />
              <span>Bike</span>
            </button>

            <button
              onClick={handleWalkDirections}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 
                       text-slate-300 rounded-lg transition-all duration-200 
                       border border-slate-700/50 hover:border-orange-500/50
                       focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <IoMdWalk size={20} />
              <span>Walk</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}