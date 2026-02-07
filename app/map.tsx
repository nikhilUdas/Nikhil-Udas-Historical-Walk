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
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude
      );
      setDistance(dist);

      // Fit map to show both locations
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          [userLocation, destinationCoords],
          {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
          }
        );
      }, 500);
    }
  }, [userLocation, destinationCoords]);

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

      {/* Header with distance info */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Map Navigation</Text>
        {destinationName ? (
          <Text style={styles.subtitle}>Route to {destinationName}</Text>
        ) : (
          <Text style={styles.subtitle}>Your current location</Text>
        )}
        {distance !== null && (
          <View style={styles.distanceCard}>
            <Ionicons name="navigate" size={20} color="#b91c1c" />
            <Text style={styles.distanceText}>
              {distance < 1
                ? `${(distance * 1000).toFixed(0)} meters away`
                : `${distance.toFixed(2)} km away`
              }
            </Text>
          </View>
        )}
      </View>

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
          {/* User location marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              description="You are here"
              pinColor="blue"
            />
          )}

          {/* Destination marker */}
          {destinationCoords && (
            <Marker
              coordinate={destinationCoords}
              title={destinationName || 'Destination'}
              description="Heritage Site Location"
              pinColor="red"
            />
          )}

          {/* Route line between user and destination */}
          {userLocation && destinationCoords && (
            <Polyline
              coordinates={[userLocation, destinationCoords]}
              strokeColor="#b91c1c"
              strokeWidth={3}
              lineDashPattern={[10, 5]}
            />
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
});
