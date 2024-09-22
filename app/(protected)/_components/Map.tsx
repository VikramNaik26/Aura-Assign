"use client"

import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { MapPin, Crosshair, Search, Loader2 } from 'lucide-react';

interface LatLng {
  lat: number;
  lng: number;
}

const defaultCenter: LatLng = {
  lat: 12.9141,
  lng: 74.8560,
};

const Map: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const [markerPosition, setMarkerPosition] = useState<LatLng>(defaultCenter);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: LatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setMarkerPosition(pos);
          setIsLoading(false);
        },
        () => {
          console.error("Error: The Geolocation service failed.");
          setIsLoading(false);
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
      setIsLoading(false);
    }
  }, []);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      setMarkerPosition({ lat: newLat, lng: newLng });
    }
  }, []);

  const onMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      setMarkerPosition({ lat: newLat, lng: newLng });
    }
  }, []);

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      const place = places?.[0];
      if (place?.geometry?.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(newPos);
        setUserLocation(newPos);
      }
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow-md z-10">
        <StandaloneSearchBox
          onLoad={onSearchBoxLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <div className="flex items-center">
            <Search className="absolute ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a location"
              className="w-full p-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </StandaloneSearchBox>
      </div>
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={markerPosition}
          zoom={14}
          onClick={onMapClick}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
          }}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            icon={{
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: "#E02020",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
            }}
          />
          {userLocation && userLocation !== markerPosition && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
              }}
            />
          )}
        </GoogleMap>
      </div>
      <div className="bg-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <MapPin className="mr-2" /> Selected Location
          </h2>
          <p className="mb-1">Latitude: {markerPosition.lat.toFixed(6)}</p>
          <p className="mb-4">Longitude: {markerPosition.lng.toFixed(6)}</p>
          {userLocation && userLocation !== markerPosition && (
            <>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Crosshair className="mr-2" /> Your Detected Location
              </h2>
              <p className="mb-1">Latitude: {userLocation.lat.toFixed(6)}</p>
              <p>Longitude: {userLocation.lng.toFixed(6)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Map);
