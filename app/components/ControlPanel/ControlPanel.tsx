import { useRef, useState, type ChangeEvent } from "react";
import './ControlPanel.css';
import { useMap } from "react-map-gl/mapbox";
import { MdFormatListBulleted, MdOutlineClose, MdOutlineZoomOutMap } from "react-icons/md";
import useMapStore from "~/store";
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";

export function ControlPanel() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { contextSafe } = useGSAP({ scope: menuRef });
  const { current: map } = useMap();
  const zoom = useMapStore((state) => state.zoom);
  const setZoom = useMapStore((state) => state.setZoom);
  const date = useMapStore((state) => state.date);
  const setDate = useMapStore((state) => state.setDate);
  const events = useMapStore((state) => state.events);
  const handleResetZoom = () => {
    map?.easeTo({
      center: [-78.6382, 35.7796],
      zoom: 10,
      duration: 2000
    });
  }
  const handleRangeChange = (e) => {
    setZoom(e.target.value);
    map?.easeTo({
      center: [-78.6382, 35.7796],
      zoom: e.target.value,
      duration: 1000
    });
  }
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setUTCHours(8)
    setDate(selectedDate);
  }
  const handleMenuToggle = contextSafe(() => {
    const menu = menuRef.current;
    setShowMenu(!showMenu);
    gsap.to(menu, { y: showMenu ? 600 : 0, duration: 1, ease: 'power2.inOut' });
  });
  return (
    <>
      <div style={{translate: '0 520px'}} ref={menuRef} id="menu">
        <div id='title-bar'>
          <h2 id='menu-title'>Events</h2>
          <button className="control" id="close-menu" onClick={handleMenuToggle}><MdOutlineClose size='30px' /></button>
        </div>
        <div id='menu-events'>
          { events.map(event => <li>{event.name}</li>) }
        </div>
      </div>
      <div className="controls">
        <div id="bottom-controls">
          {
            navigator.userAgentData.mobile ? 
            <button className="control" onClick={handleResetZoom}><MdOutlineZoomOutMap size="50px" /></button> :
            <input type="range" value={zoom} min={9} max={19} onChange={handleRangeChange} />
          }
          <button className="control" onClick={handleMenuToggle}><MdFormatListBulleted size="50px" /></button>
        </div>
        <div id="date-container">
          <input defaultValue={date.toISOString().split('T')[0]} className="control" onChange={handleDateChange} id="datePicker" type="date"></input>
        </div>
      </div>
    </>
  );
}