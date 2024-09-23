import React, { useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Loader2, ChevronDown } from "lucide-react";

const libraries: ("places")[] = ["places"];

export const CurrentLocation: React.FC = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries
  });

  const getCurrentLocation = useCallback(() => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new google.maps.Geocoder();
          
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const addressComponents = results[0].address_components;
              const city = addressComponents.find(component => component.types.includes('locality'))?.long_name || '';
              const country = addressComponents.find(component => component.types.includes('country'))?.long_name || '';
              setLocation(`${city}, ${country}`);
            } else {
              setError("Unable to determine location.");
            }
            setIsLoading(false);
          });
        },
        () => {
          setError("Unable to retrieve your location.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, [isLoaded]);

  React.useEffect(() => {
    if (isLoaded) {
      getCurrentLocation();
    }
  }, [isLoaded, getCurrentLocation]);

  if (loadError) {
    return <div className="text-red-500">Error loading Google Maps API</div>;
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center">
        <span className="text-indigo-200">Current Location</span>
      </div>
      {isLoading ? (
        <div className="flex items-center mt-2">
          <Loader2 className="animate-spin mr-2" />
          <span>Retrieving location...</span>
        </div>
      ) : error ? (
        <p className="text-red-300 mt-2">{error}</p>
      ) : location ? (
        <p className="text-2xl font-bold mt-1">{location}</p>
      ) : (
        <p className="text-indigo-200 mt-2">Location not available</p>
      )}
    </div>
  );
};
