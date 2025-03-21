import React, { useRef } from "react";
import { NavLink } from "react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IoSettingsSharp } from "react-icons/io5";
import './Navbar.css';
import useMapStore from "~/store";

export function Navbar() {
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: navRef });
  const setSelectedEvents = useMapStore((state) => state.setSelectedEvents);
  const setRoutes = useMapStore((state) => state.setRoutes);

  const onClick = contextSafe((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const element = e.target as HTMLElement;
    const toggle = toggleRef.current! as Element;
    const cogIcon = toggle.firstChild;

    const isToggleButton = element.tagName === 'BUTTON' || element.tagName === 'svg' || element.tagName === 'path';
    gsap.to(cogIcon, {
      rotate: isToggleButton ? "+=360" : '-=360',
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.to(navRef.current, {
      x: isToggleButton ? 0 : '100%',
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        setSelectedEvents(null);
        setRoutes(null);
      }
    });
  });

  return (
    <>
      <button
        ref={toggleRef}
        onClick={onClick}
        className="fixed top-5 right-5 z-[9999] bg-slate-800/80 backdrop-blur-sm 
                border border-slate-700/50 p-3 rounded-full cursor-pointer 
              hover:bg-slate-700/80 transition-all duration-200 
                shadow-lg hover:shadow-xl hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        aria-label="Toggle navigation"
      >
        <IoSettingsSharp className="text-orange-400" size='24px' />
      </button>

      <nav
        ref={navRef}
        className="fixed top-0 right-0 w-full sm:w-96 h-full bg-slate-900/95 backdrop-blur-md 
                shadow-2xl border-l border-slate-800/50 z-[99999] 
                transform translate-x-full"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800/50">
            <h2 className="text-2xl font-bold text-slate-100">919 Events</h2>
          </div>

          <div className="flex-1 flex flex-col">
            <NavLink
              to="/"
              onClick={onClick}
              className={({ isActive }) => `
                px-6 py-4 text-lg font-medium transition-all duration-200
                ${isActive
                  ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                }
              `}
            >
              Map View
            </NavLink>

            <NavLink
              to="/list"
              onClick={onClick}
              className={({ isActive }) => `
                px-6 py-4 text-lg font-medium transition-all duration-200
                ${isActive
                  ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                }
              `}
            >
              List View
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}