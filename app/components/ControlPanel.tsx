import { useRef, useState, type ChangeEvent } from "react";
import { useMap } from "react-map-gl/mapbox";
import { MdFormatListBulleted, MdOutlineChevronLeft, MdOutlineChevronRight, MdOutlineZoomOutMap } from "react-icons/md";
import useMapStore from "~/store";
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import EventList from "./EventList";
import { BsArrows, BsArrowsVertical, BsBadge3D } from "react-icons/bs";
import { FaSliders } from "react-icons/fa6";

export function ControlPanel() {
  const [showMenu, setShowMenu] = useState(false);
  const [showBtns, setShowBtns] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: menuRef });
  const { contextSafe: ctxSafe } = useGSAP({ scope: btnsRef });
  const { current: map } = useMap();
  const date = useMapStore((state) => state.date);
  const setDate = useMapStore((state) => state.setDate);
  const setSelectedEvents = useMapStore((state) => state.setSelectedEvents);
  useGSAP(() => {
    gsap.set(btnsRef.current!.children, { x: -1000 })
  })
  const handleResetZoom = () => {
    map?.easeTo({
      center: [-78.6382, 35.7796],
      zoom: 10,
      bearing: 0,
      pitch: 0,
      duration: 2000
    });
  }
  const handleShowControls = ctxSafe(() => {
    gsap.to(btnsRef.current!.children, {
      x: !showBtns ? 0 : -200, stagger: {
        from: 'end',
        amount: 0.25
      }, duration: 0.87, ease: 'power3.inOut'
    });
    setShowBtns(!showBtns);
  });
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
    // if user selects "Clear", reset date to today (same as "Today" button)
    if (e.target.value) {
      const selectedDate = new Date(e.target.value);
      selectedDate.setUTCHours(8)
      setDate(selectedDate);
      setSelectedEvents(null);
    } else {
      const today = new Date();
      today.setUTCHours(8)
      setDate(today);
      setSelectedEvents(null);
    }
  }
  const handleMenuToggle = contextSafe(() => {
    setShowMenu(!showMenu);
    gsap.to(menuRef.current, { y: showMenu ? 600 : 0, duration: 1, ease: 'power2.inOut' });
  });
  const handleDayPrevious = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    currentDate.setUTCHours(8)
    setDate(currentDate);
    setSelectedEvents(null);
  }
  const handleDayNext = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setUTCHours(8)
    setDate(currentDate);
    setSelectedEvents(null);
  }
  return (
    <>
      <EventList ref={menuRef} toggle={handleMenuToggle} />
      <div ref={btnsRef} className="flex flex-col fixed bottom-7/50 sm:bottom-9/50 left-5 gap-5">
        <button className="bg-slate-600 test border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleResetZoom}><MdOutlineZoomOutMap size="50px" /></button>
        <button className="bg-slate-600 test border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleChangePitch}><BsArrowsVertical size="50px" /></button>
        <button className="bg-slate-600 test border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleChangeBearing}><BsArrows size="50px" /></button>
      </div>
      <div>
        <div className="pointer-events-none fixed bottom-7 w-full flex justify-between px-5">
          <div className="pointer-events-auto">
            <button className="bg-slate-600 border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleShowControls}><FaSliders size="50px" /></button>
          </div>
          <button className="bg-slate-600 border-2 border-slate-400 p-1 sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md pointer-events-auto h-fit self-end" onClick={handleMenuToggle}><MdFormatListBulleted size="50px" /></button>
        </div>
        <div className="fixed top-20 sm:top-5 w-full pointer-events-none flex justify-center gap-5">
          <button onClick={handleDayPrevious} className={`
              pointer-events-auto
              cursor-pointer
              w-fit
              bg-slate-600 
              hover:bg-slate-400
              rounded 
              px-3
              py-1
              sm:px-5 
              sm:py-3 
              border 
              font-black
              text-md
              border-blue-200 
              text-slate-200 
              shadow-md 
              shadow-slate-600
              `}><MdOutlineChevronLeft size={35} /></button>
          <input
            type="date"
            defaultValue={date.toISOString().split('T')[0]}
            value={date.toISOString().split('T')[0]}
            className={`
              pointer-events-auto
              cursor-pointer
              w-4xs
              sm:w-3xs 
              bg-slate-600 
              hover:bg-slate-400
              rounded 
              px-3
              py-1
              sm:px-5 
              sm:py-3 
              border 
              font-black
              text-md
              border-blue-200 
              text-slate-200 
              shadow-md 
              shadow-slate-600
              `}
            onChange={handleDateChange}></input>
          <button onClick={handleDayNext} className={`
              pointer-events-auto
              w-fit
              cursor-pointer
              bg-slate-600 
              hover:bg-slate-400
              rounded 
              px-3
              py-1
              sm:px-5 
              sm:py-3 
              border 
              font-black
              text-md
              border-blue-200 
              text-slate-200 
              shadow-md 
              shadow-slate-600
              `}><MdOutlineChevronRight size={35} /></button>
        </div>
      </div>
    </>
  );
}