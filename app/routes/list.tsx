import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { events } from '~/events';

export default function List() {
  const listRef = useRef(null);
  useGSAP(() => {
    const list = listRef.current! as Element;
    gsap.from(list.children, { x: -50, opacity: 0, duration: 0.932, stagger: {
      each: 0.095,
      ease: 'power1.inOut'
    }, });
  });
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <ul ref={listRef}>
        {events.map(event => <li>{event.name}</li>)}
      </ul>
    </main>
  )
}