import type { Route } from "./+types/index";
import Map, { Source, Layer, GeolocateControl } from 'react-map-gl/mapbox';
import { type GeoJsonProperties, type Feature, type FeatureCollection } from "geojson";
import { useState, useRef, useEffect } from "react";
import type { MapRef } from 'react-map-gl/mapbox';
import type { CircleLayerSpecification, SymbolLayerSpecification, FillExtrusionLayerSpecification, GeoJSONSource, MapMouseEvent, Map } from "mapbox-gl";
import './index.css';
import { ControlPanel } from "~/components/ControlPanel/ControlPanel";
import { EventViewer } from "~/components/EventViewer/EventViewer";
import useMapStore from "~/store";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "919 Events" },
    { name: "description", content: "A map listing of things to do in the Raleigh area." },
  ];
}

const clustersLayerStyle: CircleLayerSpecification = {
  id: 'clusters',
  type: 'circle',
  source: 'events',
  filter: ['has', 'point_count'],
  paint: {
    "circle-emissive-strength": 1,
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      10,
      '#f1f075',
      20,
      '#f28cb1'
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,
      100,
      30,
      750,
      40
    ]
  }
};

const clusterCountLayerStyle: SymbolLayerSpecification = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'events',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
}

const unclusteredLayerStyle: CircleLayerSpecification = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'events',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#7ccf00',
    "circle-emissive-strength": 1,
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};

export default function Index() {
  const [showSource, setShowSource] = useState(false);
  const setZoom = useMapStore((state) => state.setZoom)
  const events = useMapStore((state) => state.events);
  const setDate = useMapStore((state) => state.setDate);
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: -78.6382,
    latitude: 35.7796,
    zoom: 10
  });
  const [selectedEvent, setSelectedEvent] = useState<GeoJsonProperties>(null);

  const eventsGeoJson: FeatureCollection = {
    type: 'FeatureCollection',
    features: events.map((event) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [event.coordinates[1], event.coordinates[0]] },
      properties: event
    } as Feature)),
  }

  const onClick = (event: MapMouseEvent) => {
    event.originalEvent.stopPropagation();
    const feature = event.features?.at(0);
    if (feature) {
      const pointType = feature.layer?.id;
      let clusterId, mapboxSource;
      switch (pointType) {
        case 'clusters':
          clusterId = feature.properties?.cluster_id;
          mapboxSource = mapRef.current?.getSource('events') as GeoJSONSource;
          mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            mapRef.current?.easeTo({
              center: event.lngLat,
              zoom: zoom ?? 12,
              duration: 500
            });
          });
          break;
        case 'unclustered-point':
          const { properties } = feature;
          setSelectedEvent(properties);
          mapRef.current?.easeTo({
            center: JSON.parse(properties?.coordinates).reverse(),
            zoom: 16,
            duration: 2123
          });
          break;
        default:
          break;
      }
    } else {
      setSelectedEvent(null)
    }
  }

  const handleMapEnter = (event: MapMouseEvent) => {
    const nearestPoint = event.features?.at(0);
    if (nearestPoint) {
      const pointType = nearestPoint.layer?.id;
      let mapCanvas;
      switch (pointType) {
        case 'clusters':
          mapCanvas = mapRef.current?.getCanvas();
          if (mapCanvas) {
            mapCanvas.style.cursor = 'pointer';
          }
          break;
        case 'unclustered-point':
          mapCanvas = mapRef.current?.getCanvas();
          if (mapCanvas) {
            mapCanvas.style.cursor = 'pointer';
          }
          break;
        default:
          break;
      }
    }
  }
  const handleMapLeave = (event: MapMouseEvent) => {
    const nearestPoint = event.features?.at(0);
    if (nearestPoint) {
      const pointType = nearestPoint.layer?.id;
      let mapCanvas;
      switch (pointType) {
        case 'clusters':
          mapCanvas = mapRef.current?.getCanvas();
          if (mapCanvas) {
            mapCanvas.style.cursor = '';
          }
          break;
        case 'unclustered-point':
          mapCanvas = mapRef.current?.getCanvas();
          if (mapCanvas) {
            mapCanvas.style.cursor = '';
          }
          break;
        default:
          break;
      }
    }
  }

  const handleStyleLoad = () => {
    const map = mapRef.current;
    map?.setConfigProperty('basemap', 'lightPreset', 'night');
    setShowSource(true);
  }

  return (
    <main className="w-[100vw] h-[100vh]">
      <Map
        ref={mapRef}
        mapboxAccessToken='pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdXVtem5zcDBiZ3AyanNmZGwzamt4d2oifQ.j98Apz4tCtnO2SnlgpntJw'
        {...viewState}
        antialias={true}
        onMove={({ viewState }) => {
          setZoom(viewState.zoom)
          setViewState(viewState);
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/standard"
        onClick={onClick}
        onMouseEnter={handleMapEnter}
        onMouseLeave={handleMapLeave}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        onLoad={handleStyleLoad}
      >
        { showSource && 
          <Source id="events" type="geojson" data={eventsGeoJson} cluster={true} clusterMaxZoom={14} clusterRadius={50}>
            <Layer {...clustersLayerStyle} />
            <Layer {...clusterCountLayerStyle} />
            <Layer {...unclusteredLayerStyle} />
          </Source> 
        }
        <GeolocateControl position="top-left" />
        <ControlPanel />
        <EventViewer event={selectedEvent} />
      </Map>
    </main>
  );
}
