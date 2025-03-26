import type { AmbientLightSpecification, CircleLayerSpecification, GeoJSONSourceSpecification, LightsSpecification, LineLayerSpecification, SymbolLayerSpecification } from "mapbox-gl";
import type { FillLayerSpecification } from "mapbox-gl";

const MIN_ZOOM = 10;

export const areasFillLayerStyle: FillLayerSpecification = {
  id: "areas-fill",
  type: "fill",
  source: "areas",
  minzoom: MIN_ZOOM,
  paint: {
    "fill-color": [
      "interpolate",
      ["linear"],
      ["zoom"],
      7,
      "#fff",
      18,
      "#22c55e",
    ],
    "fill-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      MIN_ZOOM,
      0.25,
      18,
      0.75,
    ],
    "fill-emissive-strength": 1,
  },
};

export const lightSourceStyle: AmbientLightSpecification = {
  id: 'test-lights',
  type: 'ambient',
  properties: {
    intensity: 1
  }
}

export const areasFillOutlineLayerStyle: LineLayerSpecification = {
  id: "areas-outline",
  type: "line",
  source: "areas",
  minzoom: 10,
  paint: {
    "line-color": [
      "interpolate",
      ["linear"],
      ["zoom"],
      7,
      "#fff",
      18,
      "#22c55e",
    ],
    "line-width": 4,
    "line-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      MIN_ZOOM,
      0,
      21,
      0.75,
    ],
    "line-emissive-strength": 1,
  },
};

export const clustersLayerStyle: CircleLayerSpecification = {
  id: "clusters",
  type: "circle",
  source: "events",
  filter: ["has", "point_count"],
  paint: {
    "circle-emissive-strength": 1,
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      10,
      "#f1f075",
      20,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayerStyle: SymbolLayerSpecification = {
  id: "cluster-count",
  type: "symbol",
  source: "events",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const unclusteredLayerStyle: CircleLayerSpecification = {
  id: "unclustered-point",
  type: "circle",
  source: "events",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#22c55e",
    "circle-radius": 12,
    "circle-stroke-color": "#bbf7d0",
    "circle-stroke-width": 4,
    "circle-emissive-strength": 1,
  },
};

export const routesLineSourceSpec = (idx: number, route: any) => ({
  id: `route-${idx}`,
  type: 'geojson',
  lineMetrics: true,
  data: {
    type: 'LineString',
    coordinates: route.geometry.coordinates,
  }
} as GeoJSONSourceSpecification);

export const routesLineLayerStyle = (idx: number) => ({
  id: `route-line-${idx}`,
  type: "line",
  source: `route-${idx}`,
  minzoom: 8,
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      "#3b82f6",
      1,
      "#22c55e",
    ],
    "line-occlusion-opacity": 0,
    "line-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      3,
      0,
      10,
      0.5,
      21,
      0.75,
    ],
    "line-width": 8,
    "line-blur": 1,
    "line-emissive-strength": 1,
  },
} as LineLayerSpecification);
