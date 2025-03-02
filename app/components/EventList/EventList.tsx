import { useRef } from "react";
import { MdFilterAlt, MdOutlineClose } from "react-icons/md";
import { useMap } from "react-map-gl/mapbox";
import useMapStore from "~/store";
import './EventList.css';

function EventList({ toggle, ref }) {
  const { current: map } = useMap();
  const events = useMapStore((state) => state.events);
  const setEvent = useMapStore((state) => state.setEvent);
  return (
    <div style={{ translate: '0 520px' }} ref={ref} id="menu">
      <div id='title-bar'>
        <h2 id='menu-title'>Events</h2>
        <button className="control" id="close-menu" onClick={toggle}><MdOutlineClose size='30px' /></button>
      </div>
      <div id='menu-events'>
        {events.map(event => <li className="event-item" onClick={() => {
          setEvent(event);
          map?.flyTo({
            center: [event.coordinates[1], event.coordinates[0]],
            pitch: 45,
            zoom: 16
          });
        }}>{event.name}</li>)}
      </div>
    </div>
  )
}

export default EventList;