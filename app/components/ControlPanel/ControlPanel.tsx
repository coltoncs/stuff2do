import React, { useRef, useState } from "react";
import './ControlPanel.css';
import { useMap } from "react-map-gl/mapbox";
import { MdOutlineZoomOutMap, MdZoomInMap } from "react-icons/md";
import { useLocation } from "react-router";

export function ControlPanel() {
  const {current: map} = useMap();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryDate = queryParams.get('date');
  const [date, setDate] = useState<Date | null>(new Date(queryDate ?? ''));
  const handleResetZoom = () => {
    map?.easeTo({
      center: [-78.6382,35.7796],
      zoom: 10,
      duration: 2000
    });
  }
  return (
    <div className="controls">
      <button className="control" onClick={handleResetZoom} id="resetZoom"><MdOutlineZoomOutMap size="50px" /></button>
      <button className="control" onClick={handleResetZoom} id="inZoom"><MdZoomInMap size="50px" /></button>
    </div>
  );
}