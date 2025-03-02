import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { events } from '~/events';

function WeeklyEvents({ dateRange, events }: { dateRange: string, events: any[] }) {
  return (
    <div className='weeksEvents'>
      <h2>{dateRange}</h2>
      <li className='eventsList'>
        {events.map(event => <li key={event.id}>{event.name}</li>)}
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

  console.log('weeklyEvents', weeklyEvents);
  
  
  return (
    <main className="flex flex-col items-center justify-center pt-16 pb-4">
      { Object.entries(weeklyEvents).map(week => <WeeklyEvents dateRange={week[0]} events={week[1]} />) }
    </main>
  )
}