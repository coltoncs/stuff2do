import React, { useRef } from "react";
import { NavLink } from "react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IoSettingsSharp } from "react-icons/io5";
import './Navbar.css';

export function Navbar() {
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: navRef });
  const onClick = contextSafe((e: React.MouseEvent<HTMLAnchorElement>) => {
    const element = e.target as HTMLElement;
    const toggle = toggleRef.current! as Element;
    const cogIcon = toggle.firstChild;
    gsap.to(cogIcon, { 
      rotate: element.tagName === 'BUTTON' ? "+=360" : '-=360', 
      duration: 3, 
      ease: 'expo.out' 
    });
    gsap.to(navRef.current, {
      y: element.tagName === 'BUTTON' ? 0 : '-105vh',
      delay: 0.5,
      position: 'fixed',
      ease: 'power2.inOut'
    });
  });
  return (
    <>
      <button 
        ref={toggleRef} 
        onClick={onClick} 
        className="fixed top-5 right-5 z-[9999] bg-slate-600 p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md">
          <IoSettingsSharp className="pointer-events-none" size={28} />
      </button>
      <nav ref={navRef} className="fixed w-full h-full -translate-y-full z-[9999] bg-slate-600 flex flex-col">
        <NavLink className='text-center h-1/2 w-full font-bold leading-100 hover:font-semibold hover:underline' to="/" onClick={onClick} end>Map</NavLink>
        <NavLink className='text-center h-1/2 w-full font-bold leading-100 hover:font-semibold hover:underline' to="/list" onClick={onClick} end>List</NavLink>
      </nav>
    </>
  );
}