import { MdOutlineClose } from "react-icons/md";
import { useMap } from "react-map-gl/mapbox";
import useMapStore from "~/store";
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";

function EventList({ toggle, ref }) {
  const { current: map } = useMap();
  const events = useMapStore((state) => state.events);
  const setEvent = useMapStore((state) => state.setEvent);
  useGSAP(() => {
    gsap.set(ref.current, { y: '520px' })
  });
  return (
    <div ref={ref} className="fixed z-[9999] bottom-1/100 right-1/100 w-sm h-[500px] overflow-y-scroll bg-slate-800 px-5 py-1 rounded border border-slate-600 shadow-lg shadow-slate-800">
      <div className="flex justify-between items-center my-3">
        <h2 className="font-bold text-xl text-slate-300 p-2">Events</h2>
        <button className="p-3 bg-slate-600 hover:bg-slate-400 rounded-xl cursor-pointer" onClick={toggle}><MdOutlineClose size='30px' /></button>
      </div>
      <div>
        <ol className="list-decimal list-inside">
          {events.map(event => <button className="w-full text-left" onClick={() => {
            setEvent(event);
            map?.flyTo({
              center: [event.coordinates[1], event.coordinates[0]],
              pitch: 45,
              zoom: 16
            });
          }}><li key={event.id} className="cursor-pointer bg-slate-600 hover:bg-slate-400 my-1 rounded px-3 py-2">{event.name}</li></button>)}
        </ol>
      </div>
    </div>
  )
}

export default EventList;