import useMapStore from '~/store';
import './EventViewer.css';
import { FiExternalLink } from 'react-icons/fi';

export const EventViewer = () => {
  const event = useMapStore((state) => state.event);
  return event && (
    <div className="eventViewer">
      <h2><a href={event.url} target="_blank">{event.name}<FiExternalLink size="10px" /></a></h2>
      <p><a href={event.googleMapsUrl} target="_blank">{event.location}<FiExternalLink size="10px" /></a></p>
      <p>
        {event.date} 
        { 
          !event.datetime.includes('undefined') && 
          ` @ ${Intl.DateTimeFormat('us-EN', { timeStyle: 'short' }).format(new Date(event.datetime))}`
        }
      </p>
      <p>{event.cost}</p>
    </div>
  )
}