"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Crosshair, Loader2, MapPinned, Navigation } from 'lucide-react'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import { UserRole } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from 'next/navigation'
import 'leaflet-routing-machine'

// CSS Imports
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/assets/css/leaflet.css'

// Action and Hook Imports
import { getEventById, getEvents, getEventsByOrgId, OrgEvent } from "@/actions/event"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { Enrollments, getEnrollmentsByUserId } from "@/actions/enrollment"

// Type Definitions
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

interface RoutingState {
  isRouting: boolean;
  destination: LatLng | null;
  routingControl: L.Routing.Control | null;
}

// Default Location
const defaultCenter: LatLng = {
  lat: 12.9141,
  lng: 74.8560,
}

// Custom Marker Icons
const createMarkerIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl: iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

const createMarkerIconRounded = (iconUrl: string) => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        width: 35px;
        height: 35px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        background: white;
      ">
        <img 
          src="${iconUrl}" 
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          "
        />
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
  })
}

const createCustomIcon = () =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 20px; height: 20px;">
        <div 
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            overflow: hidden;
            background: url('/logoSmall.png') no-repeat center center;
            background-size: contain;
          "
        ></div>
        <div 
          style="
            position: absolute;
            top: 0px;
            right: -15px;
            width: 12px;
            height: 12px;
            background-color: green;
            border-radius: 50%;
            border: 2px solid white;
          "
        ></div>
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
  });

const markerIcons = {
  default: createMarkerIconRounded('/logoSmall.png'),
  red: createMarkerIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'),
  blue: createMarkerIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'),
}

// Custom Search Control Styles
const customSearchStyle = `
.leaflet-control-geosearch {
  position: absolute !important;
  top: 20px !important;
  left: 50% !important;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  z-index: 1000;
  padding-left: 2rem;
}

.leaflet-control-geosearch form {
  margin-block: auto;
  padding: 0.25rem;
  border-radius: 0.4rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leaflet-control-geosearch form .reset { 
  position: absolute;
  right: 0.5rem;
  top: 0.3rem;
  cursor: pointer;
}

.leaflet-control-geosearch form input {
  width: 100%;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
}

.leaflet-control-geosearch .results {
  background: white;
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.leaflet-control-geosearch .results > * {
  padding: 10px 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.leaflet-control-geosearch .results > *:hover {
  background: #f8f9fa;
}
`;

const customRoutingStyle = `
.leaflet-routing-container {
  background-color: white;
  padding: 1rem;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 300px !important;
  max-height: 340px; /* Reduced fixed height */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(229, 231, 235, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: scroll;
  text-align: center;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* Inner container for scrolling */
.leaflet-routing-alt {
  height: calc(100% - 50px); /* Account for header space */
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding-right: 10px;
}

/* Hide scrollbar for Chrome, Safari, Opera */
.leaflet-routing-alt::-webkit-scrollbar {
  display: none;
}

.leaflet-routing-instruction-distance {
  color: #6366F1;
  font-weight: 500;
  padding-right: 8px;
  min-width: 40px;
}

/* Container when collapsed */
.leaflet-routing-container.leaflet-routing-container-hide {
  width: 32px !important;
  height: 32px !important;
  padding: 0;
  margin: 10px;
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Collapse button */
.leaflet-routing-collapse-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  margin-left: auto;
  margin-right: auto;
}

.leaflet-routing-collapse-btn::before {
  content: "−";
  font-size: 18px;
  color: #4B5563;
  line-height: 1;
}

.leaflet-routing-container.leaflet-routing-container-hide .leaflet-routing-collapse-btn {
  position: static;
  height: 30px;
  border: none;
  background: transparent;
}

.leaflet-routing-container.leaflet-routing-container-hide .leaflet-routing-collapse-btn::before {
  content: "+";
}

/* Hide content when collapsed */
.leaflet-routing-container.leaflet-routing-container-hide .leaflet-routing-alt {
  display: none;
}

/* Route instructions styling */
.leaflet-routing-alt h2 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.leaflet-routing-instruction-row {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.leaflet-routing-instruction-distance {
  color: #6366F1;
  font-weight: 500;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .leaflet-routing-container {
    width: 280px !important;
    height: 350px;
  }
}
`;

// Map Events Component
const MapEvents: React.FC<{ onLocationUpdate: (pos: LatLng) => void }> = ({ onLocationUpdate }) => {
  useMapEvents({
    click(e) {
      onLocationUpdate(e.latlng)
    },
  })
  return null
}

// Draggable Marker Component
const DraggableMarker: React.FC<{
  position: LatLng,
  onPositionChange: (pos: LatLng) => void
}> = ({ position, onPositionChange }) => {
  const map = useMap()

  return (
    <Marker
      position={position}
      icon={markerIcons.red}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const newPosition = marker.getLatLng()
          onPositionChange(newPosition)
          map.panTo(newPosition)
        },
      }}
    />
  )
}

// Search Control Component
const SearchControl: React.FC<{ map: L.Map }> = ({ map }) => {
  useEffect(() => {
    const provider = new OpenStreetMapProvider()
    const styleSheet = document.createElement("style")
    styleSheet.textContent = customSearchStyle
    document.head.appendChild(styleSheet)

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
      styleSheet.remove()
    }
  }, [map])

  return null
}

// Main Map Component
const Map: React.FC = () => {
  const router = useRouter()
  const [markerPosition, setMarkerPosition] = useState<LatLng>(defaultCenter)
  const [userLocation, setUserLocation] = useState<LatLng | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [map, setMap] = useState<L.Map | null>(null)
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null)

  const [routing, setRouting] = useState<RoutingState>({
    isRouting: false,
    destination: null,
    routingControl: null
  });

  const [events, setEvents] = useState<OrgEvent[]>([])
  const [enrolledEvents, setEnrolledEvents] = useState<OrgEvent[]>([])

  const { data: organizationOrUser, status } = useCurrentOrgORUser()

  // Events Query
  const { data, error, isLoading: isLoadingEvents } = useQuery<OrgEvent[]>({
    queryKey: ["events", organizationOrUser?.id],
    queryFn: () => {
      if (organizationOrUser?.role === UserRole.ORGANIZATION) {
        return getEventsByOrgId(organizationOrUser?.id)
      } else {
        return getEvents()
      }
    },
    enabled: status === "authenticated"
  })

  // Enrollments Query
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery<Enrollments[]>({
    queryKey: ["enrollments", organizationOrUser?.id],
    queryFn: () => {
      return getEnrollmentsByUserId(organizationOrUser?.id)
    },
    enabled: !!organizationOrUser?.id
  })

  // Enrolled Events Query
  const { data: enrolledEventsData } = useQuery<OrgEvent[]>({
    queryKey: ["enrolled-events", enrollments],
    queryFn: async () => {
      if (!enrollments || enrollments.length === 0) return []

      const events = await Promise.all(enrollments.map(async (enrollment) => {
        const event = await getEventById(enrollment.eventId)
        if (event && !("error" in event)) {
          return event
        }
        return null
      }))

      return events.filter(event => event !== null) as OrgEvent[]
    },
    enabled: !!enrollments && !!enrollments.length
  })

  const createRoute = useCallback((map: L.Map, start: LatLng, end: LatLng) => {
    if (routing.routingControl) {
      map.removeControl(routing.routingControl);
    }

    const routingControl = new L.Routing.Control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#6366F1', weight: 4 }]
      },
      createMarker: function() { return null; },
      collapsible: true,
      formatter: new L.Routing.Formatter({
        units: 'metric',
        roundingSensitivity: 4,
        distanceTemplate: '{value} {unit}'
      })
    });

    routingControl.addTo(map);

    // In your createRoute function
    setTimeout(() => {
      const container = routingControl.getContainer();
      if (container) {
        container.style.position = 'absolute';
        container.style.right = '10px';
        container.style.top = '10px';
        container.style.zIndex = '1000';

        // Add a class for proper styling
        const routingContainer = container.querySelector('.leaflet-routing-container');
        if (routingContainer) {
          routingContainer.classList.add('with-custom-scroll');
        }
      }
    }, 100);

    setRouting(prev => ({
      ...prev,
      routingControl,
      isRouting: true,
      destination: end
    }));
  }, [routing.routingControl]);

  const clearRoute = useCallback(() => {
    if (map && routing.routingControl) {
      const container = routing.routingControl.getContainer();
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      map.removeControl(routing.routingControl);
      setRouting({
        isRouting: false,
        destination: null,
        routingControl: null
      });
    }
  }, [map, routing.routingControl]);

  const navigateToEvent = useCallback((eventId: string) => {
    router.push(`/dashboard/event/${eventId}`);
  }, [router]);

  // Effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = customRoutingStyle;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  // Update events and enrolled events
  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data]);

  useEffect(() => {
    if (enrolledEventsData) {
      setEnrolledEvents(enrolledEventsData);
    }
  }, [enrolledEventsData]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos: LatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setMarkerPosition(pos);
          setIsLoading(false);
        },
        (error: GeolocationPositionError) => {
          console.error("Error: The Geolocation service failed.", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
      setIsLoading(false);
    }
  }, []);

  const renderEventMarker = useCallback((event: OrgEvent) => {
    if (!event.location?.lat || !event.location?.lng) return null;

    return (
      <Marker
        key={event.id}
        position={{ lat: event.location.lat, lng: event.location.lng }}
        icon={markerIcons.default}
      >
        <Popup>
          <div className="flex flex-col gap-2">
            <div
              className="cursor-pointer"
              onClick={() => navigateToEvent(event.id)}
            >
              <div className="font-bold hover:text-blue-600 transition-colors">
                {event.name}
              </div>
              <div className="text-sm">{event.description}</div>
              <div className="text-sm text-gray-600">
                Date: {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="mt-2 text-xs text-black hover:underline">
                Click to view details
              </div>
            </div>

            {userLocation && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (map && userLocation && event.location) {
                    if (routing.isRouting) {
                      clearRoute();
                    } else {
                      createRoute(map, userLocation, {
                        lat: event.location.lat,
                        lng: event.location.lng
                      });
                    }
                  }
                }}
                className="flex items-center justify-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
              >
                <Navigation className="w-4 h-4" />
                {routing.isRouting && routing.destination?.lat === event.location.lat
                  ? 'Clear Route'
                  : 'Get Directions'
                }
              </button>
            )}
          </div>
        </Popup>
      </Marker>
    );
  }, [userLocation, map, routing.isRouting, routing.destination?.lat, createRoute, clearRoute, navigateToEvent]);

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

  // Geolocation Effect
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

  // Location Details Effect
  useEffect(() => {
    if (markerPosition) {
      fetchLocationDetails(markerPosition.lat, markerPosition.lng)
    }
  }, [markerPosition])

  // Loading State
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
          zoom={10}
          style={{ width: '100%', height: '100%' }}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Event Markers */}
          {events
            .filter((event) =>
              !enrolledEvents.some((enrolledEvent) => enrolledEvent.id === event.id)
            )
            .map(renderEventMarker)}

          {/* Enrolled Events Markers */}
          {enrolledEvents.map((event) =>
            event.location?.lat && event.location?.lng ? (
              <Marker
                key={event.id}
                position={{ lat: event.location.lat, lng: event.location.lng }}
                icon={createCustomIcon()}
              >
                {/* Marker Popup */}
                <Popup>
                  <div className="flex flex-col gap-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigateToEvent(event.id)}
                    >
                      <div className="font-bold hover:text-blue-600 transition-colors">
                        {event.name} (Enrolled)
                      </div>
                      <div className="text-sm">{event.description}</div>
                      <div className="text-sm text-gray-600">
                        Date: {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="mt-2 text-xs text-black hover:underline">
                        Click to view details
                      </div>
                    </div>

                    {userLocation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (map && userLocation && event.location) {
                            if (routing.isRouting) {
                              clearRoute();
                            } else {
                              createRoute(map, userLocation, {
                                lat: event.location.lat,
                                lng: event.location.lng
                              });
                            }
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                      >
                        <Navigation className="w-4 h-4" />
                        {routing.isRouting && routing.destination?.lat === event.location.lat
                          ? 'Clear Route'
                          : 'Get Directions'
                        }
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}

          {/* User's Current Draggable Marker */}
          <DraggableMarker
            position={markerPosition}
            onPositionChange={setMarkerPosition}
          />

          {/* User's Original Location Marker */}
          {userLocation && userLocation !== markerPosition && (
            <Marker position={userLocation} icon={markerIcons.blue} />
          )}

          <MapEvents onLocationUpdate={setMarkerPosition} />
          {map && !routing.isRouting && <SearchControl map={map} />}
        </MapContainer>
      </div>

      {/* Location and Event Details Section */}
      <div className="bg-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Selected Location Details */}
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <MapPin className="mr-2" /> Selected Location
              </h2>
              <p className="mb-1">Latitude: {markerPosition.lat.toFixed(6)}</p>
              <p className="mb-4">Longitude: {markerPosition.lng.toFixed(6)}</p>

              {locationDetails && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <MapPinned className="mr-2" /> Location Details
                  </h3>
                  <p className="mb-1">City: {locationDetails.city}</p>
                  <p className="mb-1">District: {locationDetails.district}</p>
                  <p className="mb-1">State: {locationDetails.state}</p>
                  <p>Pincode: {locationDetails.pincode}</p>
                </div>
              )}
            </div>

            {/* Event Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Event Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Total Events</h3>
                  <p>{events.length}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Enrolled Events</h3>
                  <p>{enrolledEvents.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User's Original Location */}
          {userLocation && userLocation !== markerPosition && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Crosshair className="mr-2" /> Your Detected Location
              </h2>
              <p className="mb-1">Latitude: {userLocation.lat.toFixed(6)}</p>
              <p>Longitude: {userLocation.lng.toFixed(6)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Map)
