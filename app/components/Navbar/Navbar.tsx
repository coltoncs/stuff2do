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
      duration: 2, 
      ease: 'expo.out' 
    });
    gsap.to(navRef.current, {
      y: element.tagName === 'BUTTON' ? 0 : '-105vh',
      position: 'fixed',
      ease: 'power3.inOut'
    });
  });
  return (
    <>
      <button ref={toggleRef} onClick={onClick} className="navtoggle"><IoSettingsSharp className="icon" size={28} /></button>
      <nav ref={navRef} className="navbar">
        <NavLink className='navlink' to="/" onClick={onClick} end>Map</NavLink>
        <NavLink className='navlink' to="/list" onClick={onClick} end>List</NavLink>
      </nav>
    </>
  );
}