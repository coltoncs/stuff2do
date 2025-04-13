import { useCallback, useRef, useState, type ChangeEvent } from "react";
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
  const { contextSafe: ctxSafe } = useGSAP({ scope: btnsRef });
  const { current: map } = useMap();
  const date = useMapStore((state) => state.date);
  const setDate = useMapStore((state) => state.setDate);
  const setSelectedEvents = useMapStore((state) => state.setSelectedEvents);

  useGSAP(() => {
    gsap.set(btnsRef.current!.children, { x: -1000 })
  });

  const handleShowControls = ctxSafe(() => {
    gsap.to(btnsRef.current!.children, {
      x: !showBtns ? 0 : -200,
      stagger: {
        from: 'end',
        amount: 0.25
      },
      duration: 0.5,
      ease: 'power2.inOut'
    });
    setShowBtns(!showBtns);
  });

  const handleResetZoom = useCallback(() => {
    map?.easeTo({
      center: [-78.6382, 35.7796],
      zoom: 10,
      bearing: 0,
      pitch: 0,
      duration: 2000
    });
  }, []);

  const handleChangePitch = useCallback(() => {
    map?.easeTo({
      pitch: map?.getPitch() !== 45 ? 45 : 0,
    })
  }, []);

  const handleChangeBearing = useCallback(() => {
    map?.easeTo({
      bearing: map?.getBearing() !== -45 ? -45 : 0,
    })
  }, []);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    gsap.to(menuRef.current, { 
      y: showMenu ? 600 : 0, 
      duration: 0.5, 
      ease: 'power2.inOut' 
    });
  };

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
      
      {/* Map Control Buttons */}
      <div ref={btnsRef} className="fixed bottom-24 left-6 flex flex-col gap-4">
        <button 
          onClick={handleResetZoom}
          className="group flex items-center justify-center w-14 h-14 bg-slate-800/80 backdrop-blur-sm 
                   border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                   hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          aria-label="Reset map view"
        >
          <MdOutlineZoomOutMap className="text-slate-300 group-hover:text-orange-400" size={28} />
        </button>

        <button 
          onClick={handleChangePitch}
          className="group flex items-center justify-center w-14 h-14 bg-slate-800/80 backdrop-blur-sm 
                   border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                   hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          aria-label="Toggle map pitch"
        >
          <BsArrowsVertical className="text-slate-300 group-hover:text-orange-400" size={28} />
        </button>

        <button 
          onClick={handleChangeBearing}
          className="group flex items-center justify-center w-14 h-14 bg-slate-800/80 backdrop-blur-sm 
                   border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                   hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          aria-label="Toggle map bearing"
        >
          <BsArrows className="text-slate-300 group-hover:text-orange-400" size={28} />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-6 left-0 right-0 px-6 pointer-events-none">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleShowControls}
            className="group flex items-center justify-center w-14 h-14 bg-slate-800/80 backdrop-blur-sm 
                     border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                     pointer-events-auto hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            aria-label="Toggle map controls"
          >
            <FaSliders className="text-slate-300 group-hover:text-orange-400" size={28} />
          </button>

          <button 
            onClick={handleMenuToggle}
            className="group flex items-center justify-center w-14 h-14 bg-slate-800/80 backdrop-blur-sm 
                     border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                     pointer-events-auto hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            aria-label="Toggle event list"
          >
            <MdFormatListBulleted className="text-slate-300 group-hover:text-orange-400" size={28} />
          </button>
        </div>
      </div>

      {/* Date Controls */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <button 
          disabled={date.toISOString().split('T')[0] === '2025-03-20'} 
          onClick={handleDayPrevious}
          className="group flex items-center justify-center w-14 h-14 bg-slate-800/80 backdrop-blur-sm 
                   border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                   hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   disabled:hover:border-slate-700/50"
          aria-label="Previous day"
        >
          <MdOutlineChevronLeft className="text-slate-300 group-hover:text-orange-400" size={28} />
        </button>

        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          min="2025-03-20"
          max="2025-04-18"
          className="h-14 px-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 
                   rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none 
                   focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50
                   transition-all duration-200 text-lg"
          onChange={handleDateChange}
        />

        <button 
          disabled={date.toISOString().split('T')[0] === '2025-04-18'}
          onClick={handleDayNext}
          className="group flex items-center justify-center w-14 h-14 bg-slate-800/80 backdrop-blur-sm 
                   border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                   hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   disabled:hover:border-slate-700/50"
          aria-label="Next day"
        >
          <MdOutlineChevronRight className="text-slate-300 group-hover:text-orange-400" size={28} />
        </button>
      </div>
    </>
  );
}