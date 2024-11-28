"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import { LeafletEvent, LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import { toast } from "sonner"
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/assets/css/leaflet.css'

interface Location {
  address: string
  lat: number
  lng: number
}

interface MapComponentProps {
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
  disabled?: boolean
}

interface SearchFieldProps {
  onLocationSelect: (location: Location) => void
  disabled?: boolean
}

interface GeoSearchResultEvent extends LeafletEvent {
  location: {
    label: string
    x: number
    y: number
  }
}

// Custom icon setup
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})


const SearchField: React.FC<SearchFieldProps> = ({ onLocationSelect, disabled }) => {
  const map = useMap()
  const [marker, setMarker] = useState<L.Marker | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const provider = new OpenStreetMapProvider()

  const handleCurrentLocation = async () => {
    setIsLocating(true)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          try {
            const results = await provider.search({ query: `${lat}, ${lng}` })
            if (results.length > 0) {
              const location: Location = {
                address: results[0].label,
                lat: lat,
                lng: lng
              }
              updateMarker(location)
              onLocationSelect(location)
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error)
            toast.error("Failed to get address for current location")
          }
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          toast.error("Failed to get current location. Please check your browser permissions.")
          setIsLocating(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      toast.error("Geolocation is not supported by your browser")
      setIsLocating(false)
    }
  }

  const updateMarker = (location: Location) => {
    if (marker) {
      marker.remove()
    }

    const newMarker = L.marker([location.lat, location.lng], { icon: customIcon })
      .addTo(map)
    setMarker(newMarker)

    map.setView([location.lat, location.lng], 13)
  }

  useEffect(() => {
    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoComplete: true,
      autoCompleteDelay: 250,
      searchLabel: 'Search location...',
      keepResult: true,
    })

    map.addControl(searchControl)

    // Handle search results
    const handleSearch = (event: unknown) => {
      const searchEvent = event as GeoSearchResultEvent;
      const location: Location = {
        address: searchEvent.location.label,
        lat: searchEvent.location.y,
        lng: searchEvent.location.x
      }

      updateMarker(location)
      onLocationSelect(location)
    }

    // Handle map clicks
    const handleMapClick = async (e: LeafletMouseEvent) => {
      if (disabled) return
      const { lat, lng } = e.latlng

      try {
        const results = await provider.search({ query: `${lat}, ${lng}` })
        if (results.length > 0) {
          const location: Location = {
            address: results[0].label,
            lat: lat,
            lng: lng
          }
          updateMarker(location)
          onLocationSelect(location)
        }
      } catch (error) {
        console.error("Error reverse geocoding:", error)
      }
    }

    map.on('geosearch/showlocation', handleSearch)
    map.on('click', handleMapClick)

    // Add custom control for current location
    const locationControl = L.Control.extend({
      options: {
        position: 'topleft'
      },

      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
        const button = L.DomUtil.create('a', 'leaflet-control-button', container)

        // Style the button
        button.style.width = '34px'
        button.style.height = '34px'
        button.style.backgroundColor = 'white'
        button.style.cursor = 'pointer'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'

        // Create the button content
        const buttonContent = `
          <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            ${isLocating ?
            '<div class="animate-spin" style="border: 2px solid #ccc; border-top-color: #000; border-radius: 50%; width: 16px; height: 16px;"></div>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>'
          }
          </div>
        `;
        button.innerHTML = buttonContent

        L.DomEvent.on(button, 'click', function(e) {
          L.DomEvent.stopPropagation(e)
          handleCurrentLocation()
        })

        return container
      }
    })

    const locationBtn = new locationControl()
    map.addControl(locationBtn)

    return () => {
      map.removeControl(searchControl)
      map.removeControl(locationBtn)
      map.off('geosearch/showlocation', handleSearch)
      map.off('click', handleMapClick)
      if (marker) {
        marker.remove()
      }
    }
  }, [map, onLocationSelect, marker, provider, isLocating, disabled])

  return null
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedLocation, onLocationSelect, disabled }) => {
  return (
    <div className="h-[300px] rounded-md border flex justify-center items-center">
      <MapContainer
        center={[
          selectedLocation?.lat || 12.9716,
          selectedLocation?.lng || 77.5946
        ]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        dragging={!disabled}
        zoomControl={!disabled}
        scrollWheelZoom={!disabled}
        doubleClickZoom={!disabled}
        attributionControl={!disabled}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {!disabled && (
          <SearchField onLocationSelect={onLocationSelect} disabled={disabled} />
        )}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={customIcon}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default MapComponent
