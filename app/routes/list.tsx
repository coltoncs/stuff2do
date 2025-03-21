import { useRef, useState } from 'react';
import { FiExternalLink, FiChevronDown } from 'react-icons/fi';
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
  const accordionRef = useRef<HTMLDivElement>(null);
  
  const handleAccordionClick = () => {
    setIsOpen(!isOpen);
  }
  
  return (
    <div ref={accordionRef} className='w-full max-w-4xl mx-auto rounded-lg mb-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50'>
      <button 
        className='flex items-center justify-between w-full px-6 py-4 cursor-pointer transition-colors duration-200 hover:bg-slate-700/50' 
        onClick={handleAccordionClick} 
        aria-expanded={isOpen}
      >
        <h2 className='text-orange-400 font-semibold text-lg md:text-xl'>{dateRange}</h2>
        <FiChevronDown 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          size={24}
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[2000px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}>
        <ol className='px-6 py-4 space-y-2'>
          {events.map(event => {
            const formatter = Intl.DateTimeFormat('en-US', { dateStyle: 'short' });
            const todaysDate = new Date(formatter.format(new Date()));
            const eventsDate = new Date(formatter.format(new Date(event.date)));
            if (eventsDate < todaysDate) return null;
            return (
              <a 
                href={event.url} 
                target='_blank' 
                rel='noreferrer' 
                key={event.id}
                className='block transition-colors duration-200 hover:bg-slate-700/30 rounded-lg'
              >
                <li
                  className={`
                    px-4 py-3 rounded-lg
                    ${eventsDate.getDate() === todaysDate.getDate() ? 'text-green-400' : 'text-slate-300'}
                  `}
                >
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <p className='font-medium'>{event.name}</p>
                    <div className='flex items-center gap-2 text-sm text-slate-400'>
                      <span>{event.location}</span>
                      <span>•</span>
                      <span>{formatter.format(eventsDate)}</span>
                      <FiExternalLink size={14} className='text-blue-400' />
                    </div>
                  </div>
                </li>
              </a>
            );
          })}
        </ol>
      </div>
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
    <main className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-8 text-center">Upcoming Events</h1>
        <div className="space-y-4">
          {Object.entries(weeklyEvents)
            .filter((group) => {
              const yesterdaysDate = new Date();
              yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
              const eventDate = new Date(group[0].split('to')[1]);
              return eventDate >= yesterdaysDate;
            })
            .map(week => (
              <WeeklyEvents 
                key={week[1][0].id} 
                dateRange={week[0]} 
                events={week[1]} 
              />
            ))
          }
        </div>
      </div>
    </main>
  )
}