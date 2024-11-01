"use client"

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Crosshair, Loader2 } from 'lucide-react'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

// Need to import Leaflet CSS
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/assets/css/leaflet.css'

interface LatLng {
  lat: number
  lng: number
}

interface GeoSearchResult {
  x: number
  y: number
  label: string
  bounds: [[number, number], [number, number]]
  raw: any
  provider: string
}

const defaultCenter: LatLng = {
  lat: 12.9141,
  lng: 74.8560,
}

// Fix for default marker icons in Leaflet with Next.js
const markerIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom marker icons
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

interface MapEventsProps {
  onLocationUpdate: (pos: LatLng) => void
}

// Component to handle map events and updates
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

// Component to handle marker dragging
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
