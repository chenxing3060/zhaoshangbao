import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

const CustomHeatmapLayer = ({ points, radius, blur, max }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: radius,
      blur: blur,
      max: max,
    });

    map.addLayer(heatLayer);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, max]);

  return null;
};

export default CustomHeatmapLayer;