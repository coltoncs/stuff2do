import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { useMap } from "react-map-gl/mapbox";
import { MdFormatListBulleted, MdOutlineChevronLeft, MdOutlineChevronRight, MdOutlineLocalHotel, MdOutlineZoomOutMap, MdSearch } from "react-icons/md";
import useMapStore from "~/store";
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import EventList from "./EventList";
import { BsArrows, BsArrowsVertical, BsBadge3D } from "react-icons/bs";
import { FaSliders } from "react-icons/fa6";
import { TbApple, TbBeer, TbGrave2 } from "react-icons/tb";
import { HiOutlineWrench } from "react-icons/hi2";

export function ControlPanel() {
  const [showMenu, setShowMenu] = useState(false);
  const [showBtns, setShowBtns] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<{ responseId: string, suggestions: any[] } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: btnsRef });
  const { current: map } = useMap();
  const date = useMapStore((state) => state.date);
  const setPoi = useMapStore((state) => state.setPoi);
  const setDate = useMapStore((state) => state.setDate);
  const setSelectedEvents = useMapStore((state) => state.setSelectedEvents);

  useGSAP(() => {
    gsap.set(btnsRef.current!.children, { x: -1000 });
    gsap.set('.searchBox', { x: -1000 });
  });
  const handleShowControls = contextSafe(() => {
    gsap.to(btnsRef.current!.children, {
      x: !showBtns ? 0 : -200, stagger: {
        from: 'end',
        amount: 0.25
      }, duration: 0.87, ease: 'power3.inOut'
    });
    setShowBtns(!showBtns);
  });
  const getPoiIcon = (suggestions) => {
    let icon;
    if (suggestions) {
      let beerOptions = ['beer', 'brewery', 'bar'];
      beerOptions.forEach(option => {
        let sgtns = suggestions.map(suggestion => suggestion.toLowerCase());
        if (sgtns.includes(option)) {
          icon = <TbBeer size="25px" />;
        } else if (sgtns.includes('restaurant')) {
          icon = <TbApple size="25px" />;
        } else if (sgtns.includes('hotel')) {
          icon = <MdOutlineLocalHotel size="25px" />;
        } else if (sgtns.includes('cemetary')) {
          icon = <TbGrave2 size="25px" />;
        } else if (sgtns.includes('services')) {
          icon = <HiOutlineWrench size="25px" />;
        }
      });
    }
    return icon;
  };
  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    if (query.length >= 3) {
      // lets get the suggestions per onChange....lots of requests
      const baseURL = 'https://api.mapbox.com/search/searchbox/v1/suggest';
      const params = {
        q: query,
        language: 'en',
        limit: '5',
        session_token: '1234',
        origin: '-78.6382,35.7796',
        country: 'US',
        access_token: 'pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdXVtem5zcDBiZ3AyanNmZGwzamt4d2oifQ.j98Apz4tCtnO2SnlgpntJw'
      };
      const endpoint = `${baseURL}?${new URLSearchParams(Object.entries(params))}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      console.log(data);
      if (data.suggestions) {
        setShowSearchSuggestions({ responseId: data.response_id, suggestions: data.suggestions });
      }
    } else {
      if (showSearchSuggestions) {
        setShowSearchSuggestions(null);
      }
    }
  };
  const handleToggleSearch = () => {
    gsap.to('.searchBox', { x: !showSearch ? 0 : -1000, duration: 0.87, ease: 'power3.inOut' });
    setShowSearch(!showSearch);
  };
  const handleResetZoom = useCallback(() => {
    map?.easeTo({
      center: [-78.6382, 35.7796],
      zoom: 10,
      bearing: 0,
      pitch: 0,
      duration: 2000
    });
  }, []);
  const handleChangePitch = useCallback(() => {
    map?.easeTo({
      pitch: map?.getPitch() !== 45 ? 45 : 0,
    })
  }, []);
  const handleChangeBearing = useCallback(() => {
    map?.easeTo({
      bearing: map?.getBearing() !== -45 ? -45 : 0,
    })
  }, []);
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if user selects "Clear", reset date to today (same as "Today" button)
    if (e.target.value) {
      const selectedDate = new Date(e.target.value);
      selectedDate.setUTCHours(8)
      setDate(selectedDate);
      setSelectedEvents(null);
    } else {
      const today = new Date();
      today.setUTCHours(8)
      setDate(today);
      setSelectedEvents(null);
    }
  }
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    gsap.to(menuRef.current, { y: showMenu ? 600 : 0, duration: 1, ease: 'power2.inOut' });
  };
  const handleDayPrevious = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    currentDate.setUTCHours(8)
    setDate(currentDate);
    setSelectedEvents(null);
  }
  const handleDayNext = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setUTCHours(8)
    setDate(currentDate);
    setSelectedEvents(null);
  }
  return (
    <>
      <EventList ref={menuRef} toggle={handleMenuToggle} />
      <div ref={btnsRef} className="flex flex-col fixed bottom-7/50 sm:bottom-9/50 left-5 gap-5">
        <button className="bg-slate-600 test border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleToggleSearch}><MdSearch size="50px" /></button>
        <button className="bg-slate-600 test border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleResetZoom}><MdOutlineZoomOutMap size="50px" /></button>
        <button className="bg-slate-600 test border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleChangePitch}><BsArrowsVertical size="50px" /></button>
        <button className="bg-slate-600 test border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleChangeBearing}><BsArrows size="50px" /></button>
      </div>
      <div>
        <div className="pointer-events-none fixed bottom-7 w-full flex justify-between px-5">
          <div className="pointer-events-auto">
            <button className="bg-slate-600 border-2 border-slate-400 p-1 w-fit sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md" onClick={handleShowControls}><FaSliders size="50px" /></button>
          </div>
          <form className="searchBox pointer-events-auto relative bottom-40 left-7">
            <input type='text' onChange={handleSearchChange} placeholder="Search points of interest..." className="bg-slate-400 p-0 sm:px-6 sm:py-2 shadow-lg shadow-gray-900 text-lg w-0 sm:w-full sm:text-2xl rounded has-[+div]:rounded-t-lg has-[+div]:rounded-b-none box-border pr-50" />
            {showSearchSuggestions && <div className="w-full bg-slate-100 h-fit fixed overflow-y-scroll text-slate-800 rounded-b-lg">
              {showSearchSuggestions.suggestions.map(suggestion => (<li className="px-5 w-full py-1 flex justify-between cursor-pointer hover:bg-slate-400" onClick={async () => {
                const baseUrl = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}`;
                const params = {
                  session_token: '1234',
                  access_token: 'pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdXVtem5zcDBiZ3AyanNmZGwzamt4d2oifQ.j98Apz4tCtnO2SnlgpntJw'
                };
                const endpoint = `${baseUrl}?${new URLSearchParams(Object.entries(params))}`;
                const res = await fetch(endpoint);
                const data = await res.json();
                if (data.features) {
                  console.log(data.features[0]);
                  map?.flyTo({
                    center: data.features[0].geometry.coordinates,
                    zoom: 16
                  });
                  gsap.to('.searchBox', { x: -1000, duration: 0.87, ease: 'power3.inOut' });
                  setShowSearch(false);
                  setPoi(data.features[0]);
                }
              }}><div>{suggestion.name} {suggestion.context.place?.name && <small>({suggestion.context.place?.name})</small>}</div>{getPoiIcon(suggestion.poi_category)}</li>))}
            </div>}
          </form>
          <button className="bg-slate-600 border-2 border-slate-400 p-1 sm:p-5 rounded-lg cursor-pointer hover:bg-slate-400 shadow-md pointer-events-auto h-fit self-end" onClick={handleMenuToggle}><MdFormatListBulleted size="50px" /></button>
        </div>
        <div className="fixed top-20 sm:top-5 w-full pointer-events-none flex justify-center gap-5">
          <button disabled={date.toISOString().split('T')[0] === '2025-03-07'} onClick={handleDayPrevious} className={`
              pointer-events-auto
              cursor-pointer
              w-fit
              bg-slate-600 
              hover:bg-slate-400
              rounded 
              px-3
              py-1
              sm:px-5 
              sm:py-3 
              border 
              font-black
              text-md
              border-blue-200 
              text-slate-200 
              shadow-md 
              shadow-slate-600
              disabled:border-gray-600
              disabled:text-gray-600
              disabled:bg-slate-700
              disabled:cursor-not-allowed
              `}><MdOutlineChevronLeft size={35} /></button>
          <input
            type="date"
            defaultValue={date.toISOString().split('T')[0]}
            value={date.toISOString().split('T')[0]}
            min={"2025-03-07"}
            className={`
              pointer-events-auto
              cursor-pointer
              w-4xs
              sm:w-3xs 
              bg-slate-600 
              hover:bg-slate-400
              rounded 
              px-3
              py-1
              sm:px-5 
              sm:py-3 
              border 
              font-black
              text-md
              border-blue-200 
              text-slate-200 
              shadow-md 
              shadow-slate-600
              `}
            onChange={handleDateChange}></input>
          <button onClick={handleDayNext} className={`
              pointer-events-auto
              w-fit
              cursor-pointer
              bg-slate-600 
              hover:bg-slate-400
              rounded 
              px-3
              py-1
              sm:px-5 
              sm:py-3 
              border 
              font-black
              text-md
              border-blue-200 
              text-slate-200 
              shadow-md 
              shadow-slate-600
              `}><MdOutlineChevronRight size={35} /></button>
        </div>
      </div>
    </>
  );
}