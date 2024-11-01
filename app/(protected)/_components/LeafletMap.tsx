"use client"

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Crosshair, Loader2, MapPinned } from 'lucide-react'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

// Need to import Leaflet CSS
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/assets/css/leaflet.css'

interface LatLng {
  lat: number
  lng: number
}

interface LocationDetails {
  city: string
  state: string
  district: string
  pincode: string
}

const defaultCenter: LatLng = {
  lat: 12.9141,
  lng: 74.8560,
}

// Existing marker icon configurations from previous code...
const markerIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const blueMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Existing MapEvents and DraggableMarker components...
interface MapEventsProps {
  onLocationUpdate: (pos: LatLng) => void
}

const MapEvents: React.FC<MapEventsProps> = ({ onLocationUpdate }) => {
  const map = useMapEvents({
    click(e) {
      onLocationUpdate(e.latlng)
    },
  })
  return null
}

interface DraggableMarkerProps {
  position: LatLng
  onPositionChange: (pos: LatLng) => void
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({ position, onPositionChange }) => {
  const map = useMap()

  return (
    <Marker
      position={position}
      icon={redMarkerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const position = marker.getLatLng()
          onPositionChange(position)
          map.panTo(position)
        },
      }}
    />
  )
}

const SearchControl: React.FC<{ map: L.Map }> = ({ map }) => {
  useEffect(() => {
    const provider = new OpenStreetMapProvider()

    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Enter address',
    })

    map.addControl(searchControl)

    return () => {
      map.removeControl(searchControl)
    }
  }, [map])

  return null
}

const Map: React.FC = () => {
  const [markerPosition, setMarkerPosition] = useState<LatLng>(defaultCenter)
  const [userLocation, setUserLocation] = useState<LatLng | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [map, setMap] = useState<L.Map | null>(null)
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null)

  // New function to fetch location details using Nominatim reverse geocoding
  const fetchLocationDetails = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
      const data = await response.json()
      
      if (data.address) {
        setLocationDetails({
          city: data.address.city || data.address.town || data.address.village || 'N/A',
          state: data.address.state || 'N/A',
          district: data.address.county || 'N/A',
          pincode: data.address.postcode || 'N/A'
        })
      }
    } catch (error) {
      console.error("Error fetching location details:", error)
      setLocationDetails(null)
    }
  }

  // Fetch location details whenever marker position changes
  useEffect(() => {
    if (markerPosition) {
      fetchLocationDetails(markerPosition.lat, markerPosition.lng)
    }
  }, [markerPosition])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos: LatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(pos)
          setMarkerPosition(pos)
          setIsLoading(false)
        },
        (error: GeolocationPositionError) => {
          console.error("Error: The Geolocation service failed.", error)
          setIsLoading(false)
        }
      )
    } else {
      console.error("Error: Your browser doesn't support geolocation.")
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        <MapContainer
          center={markerPosition}
          zoom={14}
          style={{ width: '100%', height: '100%' }}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker
            position={markerPosition}
            onPositionChange={setMarkerPosition}
          />
          {userLocation && userLocation !== markerPosition && (
            <Marker position={userLocation} icon={blueMarkerIcon} />
          )}
          <MapEvents onLocationUpdate={setMarkerPosition} />
          {map && <SearchControl map={map} />}
        </MapContainer>
      </div>

      <div className="bg-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <MapPin className="mr-2" /> Selected Location
          </h2>
          <p className="mb-1">Latitude: {markerPosition.lat.toFixed(6)}</p>
          <p className="mb-4">Longitude: {markerPosition.lng.toFixed(6)}</p>
          
          {locationDetails && (
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <MapPinned className="mr-2" /> Location Details
              </h2>
              <p className="mb-1">City: {locationDetails.city}</p>
              <p className="mb-1">District: {locationDetails.district}</p>
              <p className="mb-1">State: {locationDetails.state}</p>
              <p>Pincode: {locationDetails.pincode}</p>
            </div>
          )}

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
  )
}

export default React.memo(Map)
