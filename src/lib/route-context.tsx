'use client';

import * as React from 'react';

export interface Route {
  path: google.maps.LatLngLiteral[];
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
}

interface RouteContextType {
  route: Route | null;
  setRoute: (route: Route | null) => void;
}

const RouteContext = React.createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = React.useState<Route | null>(null);

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = React.useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};
