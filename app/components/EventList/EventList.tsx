import { forwardRef, useImperativeHandle } from 'react';
import { events } from '~/data/events';
import { FiExternalLink } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';

interface EventListProps {
  toggle: () => void;
}

const EventList = forwardRef<HTMLDivElement, EventListProps>(({ toggle }, ref) => {
  useImperativeHandle(ref, () => ({
    // Add any methods you want to expose to the parent
  } as HTMLDivElement));

  const formatter = Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
  const todaysDate = new Date(formatter.format(new Date()));

  return (
    <div className="fixed bottom-0 left-0 w-full h-[80vh] bg-slate-900/95 backdrop-blur-md 
                    border-t border-slate-800/50 shadow-2xl rounded-t-2xl transform transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
        <h2 className="text-2xl font-bold text-slate-100">Events List</h2>
        <button 
          onClick={toggle}
          className="group flex items-center justify-center w-12 h-12 bg-slate-800/80 
                   border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200
                   hover:bg-slate-700/80 hover:border-orange-500/50 hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          aria-label="Close event list"
        >
          <MdClose className="text-slate-300 group-hover:text-orange-400" size={24} />
        </button>
      </div>

      {/* Events List */}
      <div className="h-[calc(80vh-5rem)] overflow-y-auto">
        <div className="p-6 space-y-4">
          {events.map(event => {
            const eventDate = new Date(event.date);
            const isToday = eventDate.getDate() === todaysDate.getDate();
            const isPast = eventDate < todaysDate;

            return (
              <a 
                key={event.id}
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
              >
                <div className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${isPast 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-slate-800/80 border-slate-700/50 hover:border-orange-500/50'
                  }
                  ${isToday ? 'ring-2 ring-orange-500/50' : ''}
                `}>
                  <div className="space-y-2">
                    {/* Event Name */}
                    <h3 className={`
                      text-lg font-semibold flex items-center gap-2
                      ${isPast ? 'text-slate-500 line-through' : 'text-slate-100 group-hover:text-orange-400'}
                    `}>
                      {event.name}
                      <FiExternalLink className="text-orange-400" size={16} />
                    </h3>

                    {/* Location */}
                    <p className="text-slate-300 text-sm">
                      {event.location}
                    </p>

                    {/* Date and Time */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className={isPast ? 'text-slate-500' : 'text-slate-400'}>
                        {formatter.format(eventDate)}
                      </span>
                      {!event.datetime.includes('undefined') && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className={isPast ? 'text-slate-500' : 'text-slate-400'}>
                            {Intl.DateTimeFormat('us-EN', { timeStyle: 'short' }).format(new Date(event.datetime))}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Cost */}
                    {event.cost && (
                      <p className={`
                        text-sm font-medium
                        ${isPast ? 'text-slate-500' : 'text-orange-400'}
                      `}>
                        {event.cost}
                      </p>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className={`
                        text-sm mt-2
                        ${isPast ? 'text-slate-500' : 'text-slate-400'}
                      `}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
});

EventList.displayName = 'EventList';

export default EventList;
