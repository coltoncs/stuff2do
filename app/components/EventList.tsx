import { MdOutlineClose } from "react-icons/md";
import { useMap } from "react-map-gl/mapbox";
import useMapStore from "~/store";
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import { useState } from "react";

function EventList({ toggle, ref }) {
  const { current: map } = useMap();
  const events = useMapStore((state) => state.events);
  const setSelectedEvents = useMapStore((state) => state.setSelectedEvents);
  const [filteredEvents, setFilteredEvents] = useState(events);
  useGSAP(() => {
    gsap.set(ref.current, { y: '520px' })
  });
  const groupedEvents = Object.groupBy(filteredEvents, (event) => event.city);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const newFilteredEvents = events.filter(event => event.name.toLowerCase().includes(searchTerm));
    setFilteredEvents(newFilteredEvents);
  }
  return (
    <div ref={ref} className="fixed z-[9999] bottom-1/100 right-1/100 w-sm h-[500px] overflow-y-scroll bg-slate-800 px-5 py-1 rounded border border-slate-600 shadow-lg shadow-slate-800">
      <div className="flex justify-between items-center my-3">
        <h2 className="font-bold text-xl text-slate-300 p-2">Events</h2>
        <button className="p-3 bg-slate-600 hover:bg-slate-400 border-2 border-slate-400 rounded-xl cursor-pointer" onClick={toggle}><MdOutlineClose size='30px' /></button>
      </div>
      <div>
        <input type="text" placeholder='Search' onChange={handleSearch} className='w-full px-4 py-2 my-2 rounded-lg bg-slate-700/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-400' />
        <ol className="list-decimal list-inside">
          {filteredEvents.length ? Object.entries(groupedEvents).map(([city, events], index) => (
            <div key={index}>
              <h2 className="text-slate-300 font-bold text-lg">{city !== 'undefined' ? city : 'N/A'}</h2>
              {events?.map(event => <button key={event.id} className="w-full text-left" onClick={() => {
                if (window.innerWidth < 768) toggle();
                setSelectedEvents([event]);
                map?.flyTo({
                  center: [event.coordinates[1], event.coordinates[0]],
                  pitch: 45,
                  zoom: 16
                });
              }}><li className="cursor-pointer bg-slate-600 hover:bg-slate-400 my-1 rounded px-3 py-2">{event.name}</li></button>)}
            </div>
          )) : 'No events yet, check back later!'}
        </ol>
      </div>
    </div>
  )
}

export default EventList;