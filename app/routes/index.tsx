import type { Route } from "./+types/index";
import ReactMap, { Source, Layer, GeolocateControl, useMap } from 'react-map-gl/mapbox';
import { type Feature, type FeatureCollection, type GeoJsonProperties } from "geojson";
import { useState, useRef, useCallback, useMemo } from "react";
import type { MapRef, ViewState } from 'react-map-gl/mapbox';
import type { GeoJSONSource, MapMouseEvent } from "mapbox-gl";
import { ControlPanel } from "~/components/ControlPanel";
import { EventViewer } from "~/components/EventViewer";
import useMapStore from "~/store";
import locations from "~/data/locations";
import {
  areasFillLayerStyle,
  areasFillOutlineLayerStyle,
  clusterCountLayerStyle,
  clustersLayerStyle,
  routesLineLayerStyle,
  routesLineSourceSpec,
  unclusteredLayerStyle
} from "~/data/layerStyles";
import { Navbar } from "~/components/Navbar/Navbar";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "919 Events | Map" },
    { name: "description", content: "A map plot of events in the Raleigh area." },
  ];
}

export default function Index() {
  const [showSource, setShowSource] = useState(false);
  const events = useMapStore((state) => state.events);
  const date = useMapStore((state) => state.date);
  const routes = useMapStore((state) => state.routes);
  const setSelectedEvents = useMapStore((state) => state.setSelectedEvents);
  const setEventsForGeolocation = useMapStore((state) => state.setEventsForGeolocation);
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: -78.6382,
    latitude: 35.7796,
    zoom: 12,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  const wideAreaLocationNames = useMemo(() => locations.features.map((location) => location.properties.name), [locations]);
  const eventsGeoJson: FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: events.map((event) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [event.coordinates[1], event.coordinates[0]] },
      properties: event,
    } as Feature)),
  }), [events]);
  const areaEventsGeoJson: FeatureCollection = useMemo(() => {
    const filteredFeatures = events.filter(event => wideAreaLocationNames.includes(event.location)).map((event) => ({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [locations.features.find(
        feature => feature.properties.name === event.location)?.geometry.coordinates[0].map(coord => coord.reverse()
      )] },
      properties: event
    }));
    return ({
      type: 'FeatureCollection',
      features: filteredFeatures,
    } as FeatureCollection);
  }, [events, date])

  const onClick = useCallback((event: MapMouseEvent) => {
    event.originalEvent.stopPropagation();
    const features = event.features;
    if (features) {
      let eventInformation: GeoJsonProperties = [];
      features.forEach((feature) => {
        if (feature.layer?.id === 'clusters') {
          let clusterId = feature.properties?.cluster_id;
          let mapboxSource = mapRef.current?.getSource('events') as GeoJSONSource;
          mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            mapRef.current?.easeTo({
              center: event.lngLat,
              zoom: zoom ?? 12,
              duration: 500
            });
          });
        } else if (feature.layer?.id.includes('route')) {
          // TODO: DO SOMETHING WITH THE ROUTE
        } else if (feature.layer?.id === 'unclustered-point') {
          eventInformation.push(feature.properties)
        } else if (feature.layer?.id.includes('area')) {
          eventInformation.push(feature.properties)
          mapRef.current?.easeTo({
            center: event.lngLat,
            zoom: 17,
            duration: 500
          });
        }
      })
      if (eventInformation.length > 0) {
        const uniqueEvents = [...new Map(eventInformation.map((event: any) => [event['name'], event])).values()];
        setSelectedEvents(uniqueEvents);
        mapRef.current?.easeTo({
          center: JSON.parse(eventInformation[0].coordinates).reverse(),
          zoom: 16,
          duration: 2123
        });
      } else {
        setSelectedEvents(null)
      }
    } else {
      setSelectedEvents(null)
    }
  }, []);

  const handleMapEnter = useCallback((event: MapMouseEvent) => {
    const nearestPoint = event.features?.at(0);
    if (nearestPoint) {
      const pointType = nearestPoint.layer?.id;
      let mapCanvas;
      const showPointer = () => {
        mapCanvas = mapRef.current?.getCanvas();
        if (mapCanvas) {
          mapCanvas.style.cursor = 'pointer';
        }
      }
      switch (pointType) {
        case 'clusters':
          showPointer();
          break;
        case 'route-line-0':
          showPointer();
          break;
        case 'route-line-1':
          showPointer();
          break;
        case 'route-line-2':
          showPointer();
          break;
        case 'route-line-3':
          showPointer();
          break;
        case 'areas-fill':
          showPointer();
          break;
        case 'unclustered-point':
          showPointer();
          break;
        default:
          break;
      }
    }
  }, []);
  const handleMapLeave = useCallback((event: MapMouseEvent) => {
    const nearestPoint = event.features?.at(0);
    if (nearestPoint) {
      const pointType = nearestPoint.layer?.id;
      let mapCanvas;
      const hidePointer = () => {
        mapCanvas = mapRef.current?.getCanvas();
        if (mapCanvas) {
          mapCanvas.style.cursor = '';
        }
      }
      switch (pointType) {
        case 'clusters':
          hidePointer();
          break;
        case 'route-line-0':
          hidePointer();
          break;
        case 'route-line-1':
          hidePointer();
          break;
        case 'route-line-2':
          hidePointer();
          break;
        case 'route-line-3':
          hidePointer();
          break;
        case 'areas-fill':
          hidePointer();
          break;
        case 'unclustered-point':
          hidePointer();
          break;
        default:
          break;
      }
    }
  }, []);

  const handleGeolocation = useCallback((e) => {
    setEventsForGeolocation(e.coords);
  }, []);

  const handleStyleLoad = useCallback(() => {
    const map = mapRef.current;
    map?.setConfigProperty('basemap', 'lightPreset', 'night').setConfigProperty('basemap', 'font', 'Inter');
    setShowSource(true);
  }, []);

  return (
    <main className="w-dvw h-dvh">
      <Navbar />
      <ReactMap
        ref={mapRef}
        mapboxAccessToken='pk.eyJ1IjoiY2Nzd2VlbmV5IiwiYSI6ImNsdXVtem5zcDBiZ3AyanNmZGwzamt4d2oifQ.j98Apz4tCtnO2SnlgpntJw'
        {...viewState}
        antialias={true}
        onMove={({ viewState }) => setViewState(viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/standard"
        onClick={onClick}
        onMouseEnter={handleMapEnter}
        onMouseLeave={handleMapLeave}
        interactiveLayerIds={['clusters', 'unclustered-point', 'route', 'areas-fill', 'route-line-0', 'route-line-1', 'route-line-2', 'route-line-3']}
        onLoad={handleStyleLoad}
      >
        {showSource && <>
          <Source id="events" type="geojson" data={eventsGeoJson} cluster={true} clusterMaxZoom={14} clusterRadius={50} generateId>
            <Layer {...clustersLayerStyle} />
            <Layer {...clusterCountLayerStyle} />
            <Layer {...unclusteredLayerStyle} />
          </Source>
          <Source id='areas' type="geojson" data={areaEventsGeoJson}>
            <Layer {...areasFillLayerStyle} />
            <Layer {...areasFillOutlineLayerStyle} />
          </Source>
        </>}
        {routes && routes.map((route, idx) => {
          return (
            <Source key={idx} {...routesLineSourceSpec(idx, route)}>
              <Layer {...routesLineLayerStyle(idx)} />
            </Source>
          )
        })}
        <GeolocateControl onGeolocate={handleGeolocation} position="top-left" />
        <ControlPanel />
        <EventViewer />
      </ReactMap>
    </main>
  );
}
