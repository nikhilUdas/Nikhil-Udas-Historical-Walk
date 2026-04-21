import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null); // New state for travel duration
  const [routeCoords, setRouteCoords] = useState<{ latitude: number, longitude: number }[]>([]); // New state for actual road path
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  const [destinationName, setDestinationName] = useState<string>('');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    // Check if navigated from heritage site with coordinates
    if (params.latitude && params.longitude) {
      const lat = parseFloat(params.latitude as string);
      const lng = parseFloat(params.longitude as string);
      const name = params.name as string || 'Heritage Site';

      setDestinationCoords({ latitude: lat, longitude: lng });
      setDestinationName(name);
    }
  }, [params.latitude, params.longitude, params.name]);

  useEffect(() => {
    if (userLocation && destinationCoords) {
      fetchRoute(userLocation, destinationCoords);
    }
  }, [userLocation, destinationCoords]);

  // Decode OSRM/Google polyline
  const decodePolyline = (t: string) => {
    let points = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return points;
  };

  const fetchRoute = async (start: any, end: any) => {
    try {
      // OSRM Public API (for driving)
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const decodedCoords = decodePolyline(route.geometry);
        setRouteCoords(decodedCoords);
        setDistance(route.distance / 1000); // meters to km
        setDuration(route.duration / 60); // seconds to minutes

        // Fit map to show the entire route
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(
            decodedCoords,
            {
              edgePadding: { top: 120, right: 60, bottom: 200, left: 60 },
              animated: true,
            }
          );
        }, 300);
      }
    } catch (error) {
      console.error('Error fetching OSRM route:', error);
      // Fallback to straight line if API fails
      setRouteCoords([start, end]);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
    }
  };

  // Haversine formula to calculate distance in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  const region = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : {
    latitude: 27.7172,
    longitude: 85.3240,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#b91c1c" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Header Info */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Navigate to {destinationName || 'Destiny'}</Text>
        <Text style={styles.subtitle}>Nepal Heritage Sites</Text>
      </View>

      {/* Navigation Info Popup */}
      {distance !== null && (
        <View style={styles.navCard}>
          <View style={styles.navCardInner}>
            <View style={styles.navInfoItem}>
              <Text style={styles.navInfoLabel}>DISTANCE</Text>
              <Text style={styles.navInfoValue}>{distance.toFixed(1)} km</Text>
            </View>
            <View style={styles.navDivider} />
            <View style={styles.navInfoItem}>
              <Text style={styles.navInfoLabel}>TRAVEL TIME</Text>
              <Text style={styles.navInfoValue}>
                {duration ? Math.round(duration) : '--'} mins
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.arriveButton}
            onPress={() => router.back()}
          >
            <Text style={styles.arriveButtonText}>CLOSE NAVIGATION</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b91c1c" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
        >
          {/* Accurate Road Route */}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#3b82f6" // Premium Google Blue
              strokeWidth={6}
              lineJoin="round"
              lineCap="round"
            />
          )}

          {/* User location marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="blue"
            />
          )}

          {/* Destination marker */}
          {destinationCoords && (
            <Marker
              coordinate={destinationCoords}
              title={destinationName}
            >
              <View style={styles.destMarker}>
                <Ionicons name="location" size={32} color="#b91c1c" />
              </View>
            </Marker>
          )}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f8fb" },
  backButtonContainer: {
    position: 'absolute',
    top: 12,
    left: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backButtonText: {
    fontSize: 17,
    color: '#b91c1c',
    fontWeight: '600',
  },
  headerSection: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#1f2937" },
  subtitle: { fontSize: 14, color: "#4b5563", fontWeight: '500' },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  distanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#b91c1c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  navCard: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  navCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  navInfoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  navInfoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  navDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f3f4f6',
  },
  arriveButton: {
    backgroundColor: '#1f2937', // Dark charcoal
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  arriveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  destMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
