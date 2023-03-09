import React, { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { iconLocation } from "./icon";

export default function MapComponent({ location }) {
  const map = useMap();
 

  useEffect(() => {
    if (location) {
      map.flyTo(location, 13, {
        animate: true,
      });
    }
  }, [location, map]);

  return (
      <Marker icon={iconLocation} position={location}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
  );
}
