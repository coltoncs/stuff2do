import type { Route } from "./+types/index";
import Map, { Source, Layer, GeolocateControl } from 'react-map-gl/mapbox';
import { type Feature, type FeatureCollection, type GeoJsonProperties, type Geometry } from "geojson";
import { useState, useRef, useCallback } from "react";
import type { MapRef } from 'react-map-gl/mapbox';
import type { CircleLayerSpecification, SymbolLayerSpecification, GeoJSONSource, MapMouseEvent, LngLatLike } from "mapbox-gl";
import { ControlPanel } from "~/components/ControlPanel";
import { EventViewer } from "~/components/EventViewer";
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
    'circle-color': '#22c55e',
    'circle-radius': 12,
    'circle-stroke-color': '#bbf7d0',
    'circle-stroke-width': 4,
    'circle-emissive-strength': 1,
  }
};

export default function Index() {
  const events = useMapStore((state) => state.events);
  const routes = useMapStore((state) => state.routes);
  const setSelectedEvents = useMapStore((state) => state.setSelectedEvents);
  const setEventsForGeolocation = useMapStore((state) => state.setEventsForGeolocation);
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: -78.6382,
    latitude: 35.7796,
    zoom: 10
  });

  const eventsGeoJson: FeatureCollection = {
    type: 'FeatureCollection',
    features: events.map((event) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [event.coordinates[1], event.coordinates[0]] },
      properties: event
    } as Feature)),
  };

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
        } else if (feature.layer.id.includes('route')) {
          // TODO: DO SOMETHING WITH THE ROUTE
          console.log(feature);
        } else if (feature.layer?.id === 'unclustered-point') {
          eventInformation.push(feature.properties)
        }
      })
      if (eventInformation.length > 0) {
        setSelectedEvents(eventInformation);
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
      switch (pointType) {
        case 'clusters':
        case 'route':
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
  }, []);
  const handleMapLeave = useCallback((event: MapMouseEvent) => {
    const nearestPoint = event.features?.at(0);
    if (nearestPoint) {
      const pointType = nearestPoint.layer?.id;
      let mapCanvas;
      switch (pointType) {
        case 'clusters':
        case 'route':
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
  }, []);

  const handleGeolocation = useCallback((e) => {
    setEventsForGeolocation(e.coords);
  }, []);

  const handleStyleLoad = useCallback(() => {
    const map = mapRef.current;
    map?.setConfigProperty('basemap', 'lightPreset', 'night').setConfigProperty('basemap', 'font', 'Inter');
  }, []);

  return (
    <main className="w-dvw h-dvh">
      <Map
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
        interactiveLayerIds={['clusters', 'unclustered-point', 'route']}
        onLoad={handleStyleLoad}
        reuseMaps
      >
        <Source id="events" type="geojson" data={eventsGeoJson} cluster={true} clusterMaxZoom={14} clusterRadius={50} generateId>
          <Layer {...clustersLayerStyle} />
          <Layer {...clusterCountLayerStyle} />
          <Layer {...unclusteredLayerStyle} />
        </Source>
        {routes && routes.map((route, idx) => {
          return (
            <Source key={idx} id={`route-${idx}`} type='geojson' lineMetrics data={{
              type: 'LineString',
              coordinates: route.geometry.coordinates,
            }}>
              <Layer id="route" type="line" source={`route-${idx}`} layout={{
                "line-join": 'round',
                "line-cap": 'round'
              }} paint={{
                "line-gradient": [
                  "interpolate",
                  [
                    "linear"
                  ],
                  [
                    "line-progress"
                  ],
                  0,
                  "#3b82f6",
                  1,
                  "#22c55e",
                ],
                "line-occlusion-opacity": 0,
                "line-opacity": 0.8,
                "line-width": 8,
                "line-blur": 1,
                "line-emissive-strength": 1,
              }} />
            </Source>
          )
        })}
        <GeolocateControl onGeolocate={handleGeolocation} position="top-left" />
        <ControlPanel />
        <EventViewer />
      </Map>
    </main>
  );
}
