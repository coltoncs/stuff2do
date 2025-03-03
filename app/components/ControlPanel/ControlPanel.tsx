import { useRef, useState, type ChangeEvent } from "react";
import './ControlPanel.css';
import { useMap } from "react-map-gl/mapbox";
import { MdFormatListBulleted, MdOutlineClose, MdOutlineZoomOutMap } from "react-icons/md";
import useMapStore from "~/store";
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import EventList from "../EventList";
import { PiSecurityCameraDuotone } from "react-icons/pi";
import { FaRotate } from "react-icons/fa6";
import { TbRotate360 } from "react-icons/tb";
import { LuRotate3D } from "react-icons/lu";
import { BsArrows, BsArrowsVertical } from "react-icons/bs";

export function ControlPanel() {
  const [showMenu, setShowMenu] = useState(false);
  const pitchRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: menuRef });
  const { current: map } = useMap();
  const date = useMapStore((state) => state.date);
  const setDate = useMapStore((state) => state.setDate);
  const handleResetZoom = () => {
    map?.easeTo({
      center: [-78.6382, 35.7796],
      zoom: 10,
      duration: 2000
    });
  }
  const handleChangePitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    map?.easeTo({
      pitch: map?.getPitch() !== 45 ? 45 : 0,
    })
  }
  const handleChangeBearing = (e: React.MouseEvent<HTMLButtonElement>) => {
    map?.easeTo({
      bearing: map?.getBearing() !== -45 ? -45 : 0,
    })
  }
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setUTCHours(8)
    setDate(selectedDate);
  }
  const handleMenuToggle = contextSafe(() => {
    setShowMenu(!showMenu);
    gsap.to(menuRef.current, { y: showMenu ? 600 : 0, duration: 1, ease: 'power2.inOut' });
  });
  return (
    <>
      <EventList ref={menuRef} toggle={handleMenuToggle} />
      <div className="controls">
        <div id="bottom-controls">
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="control" onClick={handleResetZoom}><MdOutlineZoomOutMap size="50px" /></button>
            <button className="control" onClick={handleChangePitch}><BsArrowsVertical size="50px" /></button>
            <button className="control" onClick={handleChangeBearing}><BsArrows size="50px" /></button>
          </div>
          <button className="control" onClick={handleMenuToggle}><MdFormatListBulleted size="50px" /></button>
        </div>
        <div id="date-container">
          <input defaultValue={date.toISOString().split('T')[0]} className="control" onChange={handleDateChange} id="datePicker" type="date"></input>
        </div>
      </div>
    </>
  );
}