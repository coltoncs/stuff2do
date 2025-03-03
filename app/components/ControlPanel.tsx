import { useRef, useState, type ChangeEvent } from "react";
import { useMap } from "react-map-gl/mapbox";
import { MdFormatListBulleted, MdOutlineZoomOutMap } from "react-icons/md";
import useMapStore from "~/store";
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import EventList from "./EventList";
import { BsArrows, BsArrowsVertical } from "react-icons/bs";

export function ControlPanel() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: menuRef });
  const { current: map } = useMap();
  const date = useMapStore((state) => state.date);
  const setDate = useMapStore((state) => state.setDate);
  const setEvent = useMapStore((state) => state.setEvent);
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
    setEvent(null);
  }
  const handleMenuToggle = contextSafe(() => {
    setShowMenu(!showMenu);
    gsap.to(menuRef.current, { y: showMenu ? 600 : 0, duration: 1, ease: 'power2.inOut' });
  });
  return (
    <>
      <EventList ref={menuRef} toggle={handleMenuToggle} />
      <div>
        <div className="pointer-events-none fixed bottom-7 w-full flex justify-between px-5">
          <div className="pointer-events-auto flex flex-col sm:flex-row gap-5">
            <button className="bg-slate-600 p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleResetZoom}><MdOutlineZoomOutMap size="50px" /></button>
            <button className="bg-slate-600 p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleChangePitch}><BsArrowsVertical size="50px" /></button>
            <button className="bg-slate-600 p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleChangeBearing}><BsArrows size="50px" /></button>
          </div>
          <button className="bg-slate-600 p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md pointer-events-auto h-fit self-end" onClick={handleMenuToggle}><MdFormatListBulleted size="50px" /></button>
        </div>
        <div className="fixed top-5 w-full flex justify-center">
          <input 
            defaultValue={date.toISOString().split('T')[0]} 
            className={`
              w-3xs 
              bg-slate-600 
              rounded 
              px-5 
              py-3 
              border 
              font-black
              text-md
              border-blue-200 
              text-slate-200 
              shadow-md 
              shadow-slate-600
              `}
            onChange={handleDateChange} 
            type="date"></input>
        </div>
      </div>
    </>
  );
}