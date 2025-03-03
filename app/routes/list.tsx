import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { events } from '~/events';

function WeeklyEvents({ dateRange, events }: { dateRange: string, events: any[] }) {
  useEffect(() => {
    gsap.fromTo('.listItem', { opacity: 0, x: -100 }, { opacity: 1, x: 0, stagger: 0.025 });
  }, [])
  return (
    <div className='weeksEvents'>
      <h2>{dateRange}</h2>
      <li className='eventsList'>
        {events.map(event => <li className='listItem' key={event.id}>{event.name}</li>)}
      </li>
    </div>
  )
}

export default function List() {
  const weeklyEvents = events.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const weekStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate() - eventDate.getDay() + 1);
    const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);
    const weekKey = `${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`;
    acc[weekKey] = [...(acc[weekKey] || []), event];
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <main className="flex flex-col items-center justify-center pt-16 pb-4">
      { Object.entries(weeklyEvents).map(week => <WeeklyEvents dateRange={week[0]} events={week[1]} />) }
    </main>
  )
}