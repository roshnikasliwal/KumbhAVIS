
'use client';

import * as React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MapPin, X } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useRoute } from '@/lib/route-context';
import { Button } from '../ui/button';
import type { Route } from '@/lib/route-context';

const heatMapData = [
  { id: 1, position: { lat: 25.4485, lng: 81.872 }, density: 9 },
  { id: 2, position: { lat: 25.444, lng: 81.849 }, density: 7 },
  { id: 3, position: { lat: 25.451, lng: 81.865 }, density: 5 },
  { id: 4, position: { lat: 25.44, lng: 81.84 }, density: 2 },
  { id: 5, position: { lat: 25.445, lng: 81.858 }, density: 8 },
  { id: 6, position: { lat: 25.449, lng: 81.855 }, density: 6 },
];

const getDensityColor = (density: number) => {
  if (density > 7) return 'rgba(239, 68, 68, 0.6)'; // Red
  if (density > 4) return 'rgba(245, 158, 11, 0.6)'; // Amber
  return 'rgba(34, 197, 94, 0.6)'; // Green
};

const DensityCircle = ({ density }: { density: number }) => (
  <div
    className="rounded-full border-2 border-white/50 transition-all duration-300"
    style={{
      width: `${20 + density * 3}px`,
      height: `${20 + density * 3}px`,
      backgroundColor: getDensityColor(density),
      boxShadow: `0 0 15px ${getDensityColor(density)}`,
    }}
  />
);

const RoutePolyline = ({ route }: { route: Route }) => {
  const map = google.maps.event.getMap();
  const [polyline, setPolyline] = React.useState<google.maps.Polyline | null>(null);

  React.useEffect(() => {
    if (map) {
      const p = new google.maps.Polyline({
        path: route.path,
        strokeColor: route.strokeColor,
        strokeOpacity: route.strokeOpacity,
        strokeWeight: route.strokeWeight,
        map: map,
      });
      setPolyline(p);

      return () => {
        p.setMap(null);
      };
    }
  }, [map, route]);

  return null;
};

export function CrowdHeatmap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { route, setRoute } = useRoute();

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="size-5"/> Crowd Density Heatmap</CardTitle>
          <CardDescription>Real-time crowd distribution across key areas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">Google Maps API Key is not configured.</p>
            <p className="text-xs text-muted-foreground mt-1">Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.</p>
            <Skeleton className="w-full h-full mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="size-5"/> Crowd Density Heatmap</CardTitle>
        <CardDescription>Real-time crowd distribution and responder routes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg border">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={{ lat: 25.445, lng: 81.85 }}
              defaultZoom={14}
              mapId="kumbhavis_agent_map"
              disableDefaultUI={true}
              gestureHandling="greedy"
              styles={[
                { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
                { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
                { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
                { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },
                { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
                { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
                { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
                { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
                { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
                { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
                { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
                { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
                { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
                { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
                { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
                { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
              ]}
            >
              {heatMapData.map(point => (
                <AdvancedMarker key={point.id} position={point.position}>
                  <DensityCircle density={point.density} />
                </AdvancedMarker>
              ))}
              {route && (
                  <RoutePolyline route={route} />
              )}
            </Map>
          </APIProvider>
        </div>
      </CardContent>
       {route && (
        <CardFooter>
          <Button variant="outline" size="sm" onClick={() => setRoute(null)}>
            <X className="mr-2 h-4 w-4" />
            Clear Route
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
