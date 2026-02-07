import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { sites } from "../api";
import { getImageUrl } from "../utils/image";

import { useLanguage } from "../hooks/i18n";

function HeritageSiteScreen() {
  const { t } = useLanguage();
  const [heritage, setHeritage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [userType, setUserType] = useState<string | null>(null);
  const [showHeritageSiteForm, setShowHeritageSiteForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [heritageSiteForm, setHeritageSiteForm] = useState({
    name: '',
    description: '',
    gps_coordinates: '',
    photo_url: ''
  });
  const [submittingHeritageSite, setSubmittingHeritageSite] = useState(false);
  const [editingHeritageSiteId, setEditingHeritageSiteId] = useState<number | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: 27.7172,
    longitude: 85.3240
  });
  const mapRef = React.useRef<MapView>(null);
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdmin = userType === 'admin';

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem('userType');
      setUserType(type);
    };
    fetchUserType();
  }, []);

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem('userType');
      setUserType(type);
    };
    fetchUserType();
  }, []);

  const refreshHeritageSites = async () => {
    try {
      const data = await sites.getAll(!!isAdmin);
      setHeritage(data.sites || []);
      console.log('Heritage sites refreshed successfully');
    } catch (err) {
      console.error("Failed to refresh heritage sites:", err);
    }
  };

  useEffect(() => {
    const fetchHeritageSites = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await sites.getAll(!!isAdmin);
        setHeritage(data.sites || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch heritage sites");
      } finally {
        setLoading(false);
      }
    };
    fetchHeritageSites();
  }, []);

  const filteredHeritage = heritage.filter((item) => {
    const matchesSearch = searchQuery.trim() === '' ||
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const openMapNavigation = (gpsCoordinates: string, siteName: string) => {
    try {
      // Parse coordinates in format "27.7172°N, 85.3240°E"
      const match = gpsCoordinates.match(/(\d+\.\d+)°[NS],\s*(\d+\.\d+)°[EW]/);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        // Navigate to map screen with coordinates
        const router = require('expo-router').router;
        router.push({
          pathname: '/map',
          params: {
            latitude: lat.toString(),
            longitude: lng.toString(),
            name: siteName,
          },
        });
      } else {
        Alert.alert('Error', 'Invalid coordinates format');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Could not open map navigation');
    }
  };

  const openGoogleMaps = (gpsCoordinates: string) => {
    try {
      // Parse coordinates in format "27.7172°N, 85.3240°E"
      const match = gpsCoordinates.match(/(\d+\.\d+)°[NS],\s*(\d+\.\d+)°[EW]/);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Invalid coordinates format');
      }
    } catch (error) {
      console.error('Google Maps error:', error);
      Alert.alert('Error', 'Could not open Google Maps');
    }
  };

  const pickHeritageSiteImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setHeritageSiteForm({ ...heritageSiteForm, photo_url: result.assets[0].uri });
    }
  };

  const submitHeritageSite = async () => {
    if (!isAdmin) {
      Alert.alert('Restricted', 'Only admins can manage heritage sites.');
      return;
    }
    if (!heritageSiteForm.name || !heritageSiteForm.description || !heritageSiteForm.photo_url || !heritageSiteForm.gps_coordinates) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Description, Photo URL, GPS Coordinates)');
      return;
    }

    setSubmittingHeritageSite(true);
    try {
      const isEditing = editingHeritageSiteId !== null;

      const formData = new FormData();
      formData.append('name', heritageSiteForm.name);
      formData.append('description', heritageSiteForm.description);
      formData.append('gps_coordinates', heritageSiteForm.gps_coordinates);
      formData.append('photo_url', heritageSiteForm.photo_url); // Keep for backwards compatibility or fallback

      // If a new image was picked (it would be in heritageSiteForm.photo_url or selectedImage)
      // Check if photo_url is a file URI
      if (heritageSiteForm.photo_url && heritageSiteForm.photo_url.startsWith('file://')) {
        const localUri = heritageSiteForm.photo_url;
        const filename = localUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Append image as file. Backend middleware 'upload.single("image")' expects field name "image"
        formData.append('image', { uri: localUri, name: filename, type } as any);
      }

      console.log('Submitting heritage site FormData:', { isEditing, editingHeritageSiteId });

      let data;
      if (isEditing && editingHeritageSiteId) {
        data = await sites.update(editingHeritageSiteId, formData);
      } else {
        data = await sites.add(formData);
      }

      Alert.alert('Success', isEditing ? 'Heritage site updated successfully' : 'Heritage site added successfully');
      setHeritageSiteForm({ name: '', description: '', gps_coordinates: '', photo_url: '' });
      setSelectedImage(null);
      setEditingHeritageSiteId(null);
      setShowHeritageSiteForm(false);
      await refreshHeritageSites();
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmittingHeritageSite(false);
    }
  };

  const openAddHeritageSiteForm = () => {
    if (!isAdmin) {
      Alert.alert('Restricted', 'Only admins can add heritage sites.');
      return;
    }
    setEditingHeritageSiteId(null);
    setShowHeritageSiteForm(true);
    setSelectedImage(null);
    setSelectedCoords({ latitude: 27.7172, longitude: 85.3240 });
    setHeritageSiteForm({ name: '', description: '', gps_coordinates: '', photo_url: '' });
  };

  const openEditHeritageSiteForm = (site: any) => {
    if (!isAdmin) {
      Alert.alert('Restricted', 'Only admins can edit heritage sites.');
      return;
    }
    const siteId = site.site_id || site.id;
    console.log('Opening edit form for heritage site:', { siteId, site });

    setEditingHeritageSiteId(siteId);
    setShowHeritageSiteForm(true);
    setSelectedImage(getImageUrl(site.image_url || site.photo_url || site.photoUrl || site.image) || null);
    setHeritageSiteForm({
      name: site.name || '',
      description: site.description || '',
      gps_coordinates: site.gps_coordinates || '',
      photo_url: getImageUrl(site.image_url || site.photo_url || site.photoUrl || site.image) || ''
    });
    // Parse coordinates for map
    if (site.gps_coordinates) {
      const match = site.gps_coordinates.match(/(\d+\.\d+)°[NS],\s*(\d+\.\d+)°[EW]/);
      if (match) {
        setSelectedCoords({
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        });
      }
    }
  };

  const deleteHeritageSite = async (site: any) => {
    if (!isAdmin) {
      Alert.alert('Restricted', 'Only admins can delete heritage sites.');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this heritage site? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const siteId = site.site_id || site.id;
              console.log('Attempting to delete heritage site:', { siteId, site });

              await sites.delete(siteId);
              Alert.alert('Success', 'Heritage site deleted successfully');
              await refreshHeritageSites();
            } catch (error: any) {
              console.error('Delete error:', error);
              Alert.alert('Error', error.message || 'Failed to delete heritage site');
            }
          }
        }
      ]
    );
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const handleMarkerDrag = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const handleSelectLocation = () => {
    const coordString = `${selectedCoords.latitude.toFixed(4)}°N, ${selectedCoords.longitude.toFixed(4)}°E`;
    setHeritageSiteForm({ ...heritageSiteForm, gps_coordinates: coordString });
    setShowMapModal(false);
  };

  const fetchSearchSuggestions = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=np&` +
        `limit=8&` +
        `addressdetails=1`,
        {
          headers: {
            'User-Agent': 'HistoricalWalkApp/1.0',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        setSearchResults([]);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid content type:', contentType);
        setSearchResults([]);
        return;
      }

      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = (text: string) => {
    setMapSearchQuery(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchSuggestions(text);
    }, 300);
  };

  const handleSelectSuggestion = (item: any) => {
    const newCoords = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    };
    setSelectedCoords(newCoords);
    setMapSearchQuery(item.display_name || '');
    setSearchResults([]);
    mapRef.current?.animateToRegion({
      latitude: newCoords.latitude,
      longitude: newCoords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#9C1C1C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Heritage Sites</Text>
              <Text style={styles.description}>Explore Nepal's rich cultural treasures</Text>
            </View>
            {userType === 'admin' && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={openAddHeritageSiteForm}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Site</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#9aa3b5" />
          <TextInput
            style={[styles.searchInput, styles.mainSearchInput]}
            placeholder="Search heritage sites..."
            placeholderTextColor="#9aa3b5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={18} color="#9aa3b5" />
            </TouchableOpacity>
          )}
        </View>

        {filteredHeritage.length === 0 && !loading ? (
          <Text style={styles.emptyText}>No heritage sites found</Text>
        ) : (
          filteredHeritage.map((site, idx) => {
            const imageUri = getImageUrl(site.image_url || site.photo_url || site.photoUrl || site.image);
            return (
              <View key={idx} style={styles.siteCard}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.siteImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.siteImagePlaceholder}>
                    <Text style={styles.placeholderText}>No image available</Text>
                  </View>
                )}
                <View style={styles.siteContent}>
                  <Text style={styles.siteName}>{site.name}</Text>
                  <Text style={styles.siteLocation}>{site.location}</Text>
                  <Text style={styles.siteDescription}>{site.description}</Text>
                  {site.gps_coordinates ? (
                    <View style={styles.navigationButtons}>
                      <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => openMapNavigation(site.gps_coordinates, site.name)}
                      >
                        <Ionicons name="navigate" size={16} color="#2563EB" />
                        <Text style={styles.navButtonText}>In-App Map</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.navButton, styles.googleMapButton]}
                        onPress={() => openGoogleMaps(site.gps_coordinates)}
                      >
                        <Ionicons name="logo-google" size={16} color="#059669" />
                        <Text style={styles.googleMapButtonText}>Google Maps</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  {userType === 'admin' && (
                    <View style={styles.footerRow}>
                      <TouchableOpacity style={[styles.bookButton, styles.editButton]} activeOpacity={0.9} onPress={() => openEditHeritageSiteForm(site)}>
                        <Ionicons name="pencil" size={16} color="#fff" />
                        <Text style={styles.bookButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.bookButton, styles.deleteButton]} activeOpacity={0.9} onPress={() => deleteHeritageSite(site)}>
                        <Ionicons name="trash" size={16} color="#fff" />
                        <Text style={styles.bookButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add/Edit Heritage Site Form Modal */}
      <Modal
        visible={isAdmin && showHeritageSiteForm}
        animationType="slide"
        onRequestClose={() => setShowHeritageSiteForm(false)}
      >
        <SafeAreaView style={styles.formSafeArea}>
          <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{editingHeritageSiteId ? t('edit') : t('heritageSites')}</Text>
              <TouchableOpacity onPress={() => setShowHeritageSiteForm(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('name')} *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Pashupatinath Temple"
                value={heritageSiteForm.name}
                onChangeText={(text) => setHeritageSiteForm({ ...heritageSiteForm, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('description')} *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Describe the heritage site..."
                value={heritageSiteForm.description}
                onChangeText={(text) => setHeritageSiteForm({ ...heritageSiteForm, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>GPS Coordinates</Text>
              <TouchableOpacity
                style={styles.mapInput}
                onPress={() => setShowMapModal(true)}
              >
                <Ionicons name="location" size={20} color="#6B7280" />
                <Text style={heritageSiteForm.gps_coordinates ? styles.mapInputText : styles.mapInputPlaceholder}>
                  {heritageSiteForm.gps_coordinates || 'Tap to select location on map'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('siteImage')}</Text>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickHeritageSiteImage}
              >
                {selectedImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.imagePreview}
                    />
                    <View style={styles.changeImageOverlay}>
                      <Ionicons name="camera" size={24} color="#fff" />
                      <Text style={styles.changeImageText}>{t('changeImage')}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Ionicons name="image" size={32} color="#9CA3AF" />
                    <Text style={styles.imagePickerText}>{t('tapToSelect')}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowHeritageSiteForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.submitButton]}
                onPress={submitHeritageSite}
                disabled={submittingHeritageSite}
              >
                <Text style={styles.submitButtonText}>
                  {submittingHeritageSite ? (editingHeritageSiteId ? 'Updating...' : 'Submitting...') : (editingHeritageSiteId ? 'Update Site' : 'Add Site')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Map Modal for Location Selection */}
      <Modal
        visible={isAdmin && showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.mapModalContainer}>
          <View style={styles.mapModalHeader}>
            <Text style={styles.mapModalTitle}>Select Location</Text>
            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <Ionicons name="close" size={28} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.mapSearchInput}
                placeholder="Search in Nepal (cities, landmarks...)"
                placeholderTextColor="#9CA3AF"
                value={mapSearchQuery}
                onChangeText={handleSearchInput}
                onSubmitEditing={() => { }}
                returnKeyType="search"
                autoCapitalize="words"
                autoCorrect={false}
              />
              {isSearching && mapSearchQuery.length >= 2 && (
                <View style={styles.loadingSpinner}>
                  <Text style={styles.loadingText}>...</Text>
                </View>
              )}
            </View>
          </View>

          {searchResults && searchResults.length > 0 && (
            <ScrollView
              style={styles.suggestionList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {searchResults.map((item, idx) => {
                const placeName = item.name || item.address?.city || item.address?.town || 'Unknown';
                const addressParts = [];

                if (item.address) {
                  if (item.address.city) addressParts.push(item.address.city);
                  if (item.address.state) addressParts.push(item.address.state);
                }
                const addressText = addressParts.join(', ');

                return (
                  <TouchableOpacity
                    key={`${item.place_id || idx}`}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suggestionIconContainer}>
                      <Ionicons name="location" size={20} color="#9CA3AF" />
                    </View>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionText} numberOfLines={1}>
                        {placeName}
                      </Text>
                      {addressText && (
                        <Text style={styles.suggestionSubtext} numberOfLines={1}>
                          {addressText}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="arrow-forward" size={16} color="#4B5563" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.mapInstructionBanner}>
            <Ionicons name="information-circle" size={16} color="#2563EB" />
            <Text style={styles.mapInstructionText}>
              Tap anywhere on the map or drag the marker to pin your location
            </Text>
          </View>

          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: selectedCoords.latitude,
              longitude: selectedCoords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={selectedCoords}
              title="Selected Location"
              description="Drag me to adjust position"
              draggable
              onDragEnd={handleMarkerDrag}
            />
          </MapView>

          <View style={styles.mapModalFooter}>
            <View style={styles.coordsDisplay}>
              <Text style={styles.coordsLabel}>Selected Coordinates:</Text>
              <Text style={styles.coordsValue}>
                {selectedCoords.latitude.toFixed(4)}°N, {selectedCoords.longitude.toFixed(4)}°E
              </Text>
            </View>
            <TouchableOpacity
              style={styles.selectLocationButton}
              onPress={handleSelectLocation}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.selectLocationButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerSection: {
    gap: 4,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },
  description: {
    fontSize: 13,
    color: "#4b5563",
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#F9FAFB',
  },
  mainSearchInput: {
    color: "#000000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  siteCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  siteImage: {
    width: "100%",
    height: 170,
  },
  siteImagePlaceholder: {
    width: "100%",
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  placeholderText: {
    color: "#6b7280",
    fontSize: 13,
  },
  siteContent: {
    padding: 14,
    gap: 8,
  },
  siteName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  siteLocation: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
  },
  siteDescription: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  coordinatesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  coordinatesLink: {
    fontSize: 12,
    color: "#2563EB",
    textDecorationLine: "underline",
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  navButtonText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  googleMapButton: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  googleMapButtonText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  bookButton: {
    backgroundColor: "#b0191e",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    flex: 1,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700"
  },
  editButton: {
    backgroundColor: "#2563EB",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
  formSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
    gap: 12,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mapInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  mapInputText: {
    fontSize: 14,
    color: '#111827',
  },
  mapInputPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    minHeight: 150,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#16A34A',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mapModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 0,
  },
  mapSearchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#F9FAFB',
  },
  loadingSpinner: {
    paddingHorizontal: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  suggestionList: {
    backgroundColor: '#1F2937',
    maxHeight: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    gap: 12,
    backgroundColor: '#1F2937',
  },
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  mapInstructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  mapInstructionText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
  },
  map: {
    flex: 1,
  },
  mapModalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  coordsDisplay: {
    marginBottom: 12,
  },
  coordsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  coordsValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginTop: 4,
  },
  selectLocationButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectLocationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HeritageSiteScreen;
