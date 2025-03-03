import useMapStore from '~/store';
import { FiExternalLink } from 'react-icons/fi';

export const EventViewer = () => {
  const event = useMapStore((state) => state.event);
  return event && (
    <div className="fixed rounded border bottom-1/10 left-7/20 bg-gray-800 border-slate-600 p-5 w-lg h-fit shadow-lg shadow-slate-950">
      <h2 className='text-base font-bold text-blue-200 hover:text-blue-500'><a href={event.url} className='flex justify-center items-center gap-2 text-center' target="_blank">{event.name}<FiExternalLink size="10px" /></a></h2>
      <p className='text-sm font-bold text-blue-200 hover:text-blue-500'><a className='flex justify-center items-center gap-2 text-center' href={event.googleMapsUrl} target="_blank">{event.location}<FiExternalLink size="10px" /></a></p>
      <p className='w-full text-center'>
        {event.date} 
        { 
          !event.datetime.includes('undefined') && 
          ` @ ${Intl.DateTimeFormat('us-EN', { timeStyle: 'short' }).format(new Date(event.datetime))}`
        }
      </p>
      <p className='w-full text-center'>{event.cost}</p>
    </div>
  )
}