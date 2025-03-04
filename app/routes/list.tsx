import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { events } from '~/events';

function WeeklyEvents({ dateRange, events }: { dateRange: string, events: any[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const accordionRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: accordionRef });
  const handleAccordionClick = contextSafe(() => {
    // todo: gsap animations here
    setIsOpen(!isOpen);
  })
  
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
          console.log(eventsDate)
          return (
            <a href={event.url}>
              <li 
                className={`
                  listItem 
                  rounded 
                  px-5 
                  py-1 
                  hover:bg-slate-600 
                  hover:text-slate-100
                  ${eventsDate < todaysDate && ' line-through'}
                  ${eventsDate === todaysDate ? ' text-green-500' : ' text-slate-300'}
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
      { Object.entries(weeklyEvents).map(week => <WeeklyEvents dateRange={week[0]} events={week[1]} />) }
    </main>
  )
}