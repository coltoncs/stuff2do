import './EventViewer.css';

type Event = {
  id: string,
  name: string,
  cost: string,
  url: string,
  date: string,
  streetaddr: string,
  city: string,
  times: string,
  location: string,
  coordinates: [number, number],
  googleMapsUrl: string,
  datetime: string
}

export const EventViewer = ({ event }: { event: Event | null }) => {
  return event && (
    <div className="eventViewer">
      <h2><a href={event.url} target="_blank">{event.name}</a></h2>
      <p><a href={event.googleMapsUrl} target="_blank">{event.location}</a></p>
      <p>{event.date}</p>
      <p>{event.cost}</p>
    </div>
  )
}