import { useRef, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { events } from '~/data/events';
import type { Route } from './+types';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "919 Events | List" },
    { name: "description", content: "A list of events in the Raleigh area." },
  ];
}

function WeeklyEvents({ dateRange, events }: { dateRange: string, events: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef(null);
  const handleAccordionClick = () => {
    setIsOpen(!isOpen);
  }
  
  return (
    <div ref={accordionRef} className='w-full md:w-4xl rounded mb-5 bg-slate-800'>
      <button className='flex items-center justify-between w-full py-4 cursor-pointer shadow-lg shadow-slate-900 bg-slate-800 hover:bg-slate-700' onClick={handleAccordionClick} aria-expanded={isOpen}>
        <h2 className='text-orange-400 text-center font-bold p-5'>{dateRange}</h2>
      </button>
      <ol className={`${isOpen ? 'block' : 'hidden'} p-10 list-disc`}>
        {events.map(event => {
          const formatter = Intl.DateTimeFormat('en-US', { dateStyle: 'short' });
          const todaysDate = new Date(formatter.format(new Date()));
          const eventsDate = new Date(formatter.format(new Date(event.date)));
          return (
            <a href={event.url} target='_blank' rel='noreferrer' key={event.id}>
              <li
                className={`
                  listItem
                  rounded
                  px-5
                  py-1
                  ${eventsDate < todaysDate && ' line-through'}
                  ${eventsDate.getDate() === todaysDate.getDate() ? 'text-green-500' : 'text-slate-300'}
                  hover:bg-slate-600 
                  hover:text-blue-300
                  `} 
                key={event.id}>
                <p className='flex gap-2 justify items-center'>
                  {event.name} 
                  <span key={event.id} className='text-xs text-slate-400'>
                    {' @ '} 
                    {event.location} ({formatter.format(eventsDate)})
                  </span>
                  <FiExternalLink size="15px" className='text-blue-400' />
                </p>
              </li>
            </a>
          );
        })}
      </ol>
    </div>
  )
}

export default function List() {
  const weeklyEvents = events.reduce((acc, event) => {
    const dateFormatter = Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
    });
    const eventDate = new Date(event.date);
    const weekStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate() - eventDate.getDay() + 1);
    const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);
    const weekKey = `${dateFormatter.format(weekStart)} to ${dateFormatter.format(weekEnd)}`;
    acc[weekKey] = [...(acc[weekKey] || []), event];
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <main className="flex flex-col items-center justify-center pt-16 pb-4">
      { Object.entries(weeklyEvents).filter((group) => {
        const yesterdaysDate = new Date();
        yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
        const eventDate = new Date(group[0].split('to')[1]);
        return eventDate >= yesterdaysDate
      }).map(week => <div key={week[1][0].id}><WeeklyEvents dateRange={week[0]} events={week[1]} /></div>) }
    </main>
  )
}