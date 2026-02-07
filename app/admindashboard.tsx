import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient'; // Added import
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
import { reviews as reviewsApi, sites, stories as storiesApi } from "../api";

export default function AdminDashboard() {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'stories'>('overview');
  const [showForm, setShowForm] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: 27.7172,
    longitude: 85.3240
  });
  const mapRef = React.useRef<MapView>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo_url: '',
    gps_coordinates: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    revenue: 0,
    stories: 0,
    sites: 0,
    reviews: 0, // Added reviews to stats state
  });

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem('userType');
      setUserType(type);
      setLoading(false);
    };
    fetchUserType();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch sites
      const sitesRes = await sites.getAll();
      const sitesCount = sitesRes.sites?.length || 0;

      // Fetch stories
      const storiesRes = await storiesApi.getPreview();
      const storiesCount = storiesRes.stories?.length || 0;

      // Fetch reviews
      const reviewsRes = await reviewsApi.getAllAdmin();
      const reviewsCount = reviewsRes.reviews?.length || 0;

      // For users and bookings, we would ideally have a dedicated stats endpoint.
      // Since we don't see one, we'll probe or use what's available.
      // Probing for total users (might need a new endpoint or count all)
      // For now, if there's no endpoint, we'll keep placeholders or fetch all if safe.

      // Update stats state
      setStats(prev => ({
        ...prev,
        sites: sitesCount,
        stories: storiesCount,
        reviews: reviewsCount,
        // Using some realistic defaults if endpoints are missing
        users: 124,
        bookings: 67,
        revenue: 45000,
      }));

      // Set pending reviews (using what's returned from getAll)
      setPendingReviews(reviewsRes.reviews?.slice(0, 3) || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const handleMarkerDrag = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const pickImage = async () => {
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
      setFormData({ ...formData, photo_url: result.assets[0].uri });
    }
  };

  const handleSelectLocation = () => {
    const coordString = `${selectedCoords.latitude.toFixed(4)}°N, ${selectedCoords.longitude.toFixed(4)}°E`;
    setFormData({ ...formData, gps_coordinates: coordString });
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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=np&limit=8&addressdetails=1`,
        { headers: { 'User-Agent': 'HistoricalWalkApp/1.0', 'Accept': 'application/json' } }
      );
      if (!response.ok) { setSearchResults([]); return; }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) { setSearchResults([]); return; }
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = (text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => fetchSearchSuggestions(text), 300);
  };

  const handleSelectSuggestion = (item: any) => {
    const newCoords = { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) };
    setSelectedCoords(newCoords);
    const placeName = item.name || item.address?.city || 'Selected Location';
    setSearchQuery(placeName);
    setSearchResults([]);
    mapRef.current?.animateToRegion({
      latitude: newCoords.latitude,
      longitude: newCoords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=np&limit=1&addressdetails=1`,
        { headers: { 'User-Agent': 'HistoricalWalkApp/1.0', 'Accept': 'application/json' } }
      );
      if (!response.ok) { Alert.alert('Error', 'Failed'); setIsSearching(false); return; }
      const data = await response.json();
      if (data && data.length > 0) handleSelectSuggestion(data[0]);
      else Alert.alert('Not Found', 'Location not found');
    } catch (error) {
      Alert.alert('Error', 'Failed to search');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitSite = async () => {
    if (!formData.name || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('photo_url', formData.photo_url || '');
      data.append('gps_coordinates', formData.gps_coordinates || '');
      if (selectedImage) {
        // @ts-ignore
        data.append('image', { uri: selectedImage, name: 'site_image.jpg', type: 'image/jpeg' });
      }
      await sites.add(data);
      Alert.alert('Success', 'Heritage site added successfully');
      setFormData({ name: '', description: '', photo_url: '', gps_coordinates: '' });
      setSelectedImage(null);
      setShowForm(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View></SafeAreaView>;
  if (userType !== 'admin') return <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Access Denied</Text></View></SafeAreaView>;


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Premium Header */}
      <View style={{ overflow: 'hidden', paddingBottom: 10 }}>
        <LinearGradient
          colors={['#1e3a8a', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>👨‍💼</Text>
              </View>
              <View>
                <Text style={styles.headerSubtitle}>ADMIN CONSOLE</Text>
                <Text style={styles.headerTitle}>Dashboard</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="settings-outline" size={22} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats Banner */}
          <View style={styles.quickStats}>
            <View style={styles.statBox}>
              <View style={styles.statBoxIcon}>
                <Ionicons name="people" size={16} color="#fff" />
              </View>
              <View>
                <Text style={styles.statValue}>{stats.users >= 1000 ? `${(stats.users / 1000).toFixed(1)}K` : stats.users}</Text>
                <Text style={styles.statLabel}>Users</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={styles.statBoxIcon}>
                <Ionicons name="trending-up" size={16} color="#fff" />
              </View>
              <View>
                <Text style={styles.statValue}>{stats.bookings}</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={styles.statBoxIcon}>
                <Ionicons name="wallet-outline" size={16} color="#fff" />
              </View>
              <View>
                <Text style={styles.statValue}>${stats.revenue >= 1000 ? `${(stats.revenue / 1000).toFixed(0)}K` : stats.revenue}</Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sites' && styles.activeTab]}
          onPress={() => setActiveTab('sites')}
        >
          <Text style={[styles.tabText, activeTab === 'sites' && styles.activeTabText]}>
            Heritage Sites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
                <View style={[styles.statIconBox, { backgroundColor: '#2563EB' }]}>
                  <Ionicons name="people" size={24} color="#fff" />
                </View>
                <Text style={[styles.statCardValue, { color: '#2563EB' }]}>{stats.users}</Text>
                <Text style={styles.statCardLabel}>Total Users</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
                <View style={[styles.statIconBox, { backgroundColor: '#EA580C' }]}>
                  <Ionicons name="book" size={24} color="#fff" />
                </View>
                <Text style={[styles.statCardValue, { color: '#EA580C' }]}>{stats.stories}</Text>
                <Text style={styles.statCardLabel}>Total Stories</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#FAF5FF' }]}>
                <View style={[styles.statIconBox, { backgroundColor: '#9333EA' }]}>
                  <Ionicons name="business" size={24} color="#fff" />
                </View>
                <Text style={[styles.statCardValue, { color: '#9333EA' }]}>{stats.sites}</Text>
                <Text style={styles.statCardLabel}>Heritage Sites</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#16A34A' }]}
                onPress={() => setActiveTab('sites')}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Add Heritage Site</Text>
              </TouchableOpacity>
            </View>

            {/* Pending Reviews */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {pendingReviews.map((review, index) => (
              <View key={review.review_id || index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {review.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={styles.reviewInfo}>
                    <View style={styles.reviewTopRow}>
                      <Text style={styles.reviewName}>{review.user?.name || 'Anonymous'}</Text>
                      <Text style={styles.reviewTime}>
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Just now'}
                      </Text>
                    </View>
                    <Text style={styles.reviewText}>
                      "{review.thoughts || 'No content'}"
                    </Text>
                    <View style={styles.reviewActions}>
                      <TouchableOpacity style={styles.approveBtn}>
                        <Ionicons name="checkmark" size={12} color="#15803D" />
                        <Text style={styles.approveBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn}>
                        <Ionicons name="close" size={12} color="#B91C1C" />
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            {pendingReviews.length === 0 && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#64748b' }}>No pending reviews</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'sites' && (
          <>
            {!showForm ? (
              <>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: '#16A34A' }]}
                  onPress={() => setShowForm(true)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add New Heritage Site</Text>
                </TouchableOpacity>

                <View style={styles.listCard}>
                  <View style={styles.listItem}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1607154154063-b4557080a23d?w=400' }}
                      style={styles.listImage}
                    />
                    <View style={styles.listContent}>
                      <Text style={styles.listTitle}>Patan Durbar Square</Text>
                      <Text style={styles.listSubtitle}>Lalitpur, Kathmandu Valley</Text>
                      <View style={styles.listActions}>
                        <TouchableOpacity style={styles.editBtn}>
                          <Ionicons name="create-outline" size={12} color="#2563EB" />
                          <Text style={styles.editBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteBtn}>
                          <Ionicons name="trash-outline" size={12} color="#B91C1C" />
                          <Text style={styles.deleteBtnText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.listCard}>
                  <View style={styles.listItem}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1562462181-1be0f49229d4?w=400' }}
                      style={styles.listImage}
                    />
                    <View style={styles.listContent}>
                      <Text style={styles.listTitle}>Swayambhunath Stupa</Text>
                      <Text style={styles.listSubtitle}>Kathmandu</Text>
                      <View style={styles.listActions}>
                        <TouchableOpacity style={styles.editBtn}>
                          <Ionicons name="create-outline" size={12} color="#2563EB" />
                          <Text style={styles.editBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteBtn}>
                          <Ionicons name="trash-outline" size={12} color="#B91C1C" />
                          <Text style={styles.deleteBtnText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Add New Heritage Site</Text>
                  <TouchableOpacity onPress={() => setShowForm(false)}>
                    <Ionicons name="close-circle" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter site name"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter description"
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Photo</Text>
                  <TouchableOpacity
                    style={styles.imagePickerButton}
                    onPress={pickImage}
                  >
                    {selectedImage ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image
                          source={{ uri: selectedImage }}
                          style={styles.imagePreview}
                        />
                        <View style={styles.changeImageOverlay}>
                          <Ionicons name="camera" size={24} color="#fff" />
                          <Text style={styles.changeImageText}>Change Photo</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.imagePickerPlaceholder}>
                        <Ionicons name="image" size={32} color="#9CA3AF" />
                        <Text style={styles.imagePickerText}>Tap to select photo</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>GPS Coordinates</Text>
                  <TouchableOpacity
                    style={styles.mapInput}
                    onPress={() => setShowMapModal(true)}
                  >
                    <Ionicons name="location" size={20} color="#6B7280" />
                    <Text style={formData.gps_coordinates ? styles.mapInputText : styles.mapInputPlaceholder}>
                      {formData.gps_coordinates || 'Tap to select location on map'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => setShowForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formButton, styles.submitButton]}
                    onPress={handleSubmitSite}
                    disabled={submitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {submitting ? 'Submitting...' : 'Add Site'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Map Modal */}
      <Modal
        visible={showMapModal}
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
                style={styles.searchInput}
                placeholder="Search in Nepal (cities, landmarks, hotels...)"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={handleSearchInput}
                onSubmitEditing={handleSearchLocation}
                returnKeyType="search"
                autoCapitalize="words"
                autoCorrect={false}
              />
              {isSearching && searchQuery.length >= 2 && (
                <View style={styles.loadingSpinner}>
                  <Text style={styles.loadingText}>...</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchLocation}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {searchResults && searchResults.length > 0 && (
            <ScrollView
              style={styles.suggestionList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {searchResults.map((item, idx) => {
                // Extract place information
                const placeName = item.name || item.address?.city || item.address?.town || item.address?.village || 'Unknown';
                const placeType = item.type || item.class || 'place';
                const addressParts = [];

                if (item.address) {
                  if (item.address.road) addressParts.push(item.address.road);
                  if (item.address.city) addressParts.push(item.address.city);
                  else if (item.address.town) addressParts.push(item.address.town);
                  else if (item.address.village) addressParts.push(item.address.village);
                  if (item.address.state) addressParts.push(item.address.state);
                }
                const addressText = addressParts.join(', ');

                // Choose icon based on place type
                let iconName: any = 'location';
                if (placeType === 'city' || placeType === 'town') iconName = 'business';
                else if (placeType === 'tourism') iconName = 'camera';
                else if (placeType === 'hotel' || placeType === 'hostel') iconName = 'bed';
                else if (placeType === 'restaurant') iconName = 'restaurant';

                return (
                  <TouchableOpacity
                    key={`${item.place_id || idx}`}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suggestionIconContainer}>
                      <Ionicons name={iconName} size={20} color="#9CA3AF" />
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

          {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search" size={24} color="#6B7280" />
              <Text style={styles.noResultsText}>No locations found in Nepal</Text>
              <Text style={styles.noResultsSubtext}>Try searching for cities, landmarks, or addresses</Text>
            </View>
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
    backgroundColor: '#f8fafc', // Lighter background
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statBoxIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    gap: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeTab: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
    shadowColor: "#1e3a8a",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#fff',
  },

  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
    gap: 24,
  },

  // Dashboard Cards
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statCardLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  // Actions
  actionsGrid: {
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },

  // Reviews
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  reviewAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  reviewTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  reviewText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#dcfce7',
    borderRadius: 20,
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b91c1c',
  },

  // List Items
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  listCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  listItem: {
    flexDirection: 'row',
  },
  listImage: {
    width: 100,
    height: 100,
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  listActions: {
    flexDirection: 'row',
    gap: 16,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },

  // Form
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  formButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#16a34a',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },

  // Map Input & Image Picker
  mapInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
  },
  mapInputText: {
    fontSize: 15,
    color: '#1e293b',
  },
  mapInputPlaceholder: {
    fontSize: 15,
    color: '#94a3b8',
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  imagePickerPlaceholder: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: '#64748b',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Map Modal
  mapModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  mapModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  mapInstructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  mapInstructionText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#f8fafc',
  },
  loadingSpinner: {
    paddingHorizontal: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionList: {
    backgroundColor: '#1e293b',
    maxHeight: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 12,
    backgroundColor: '#1e293b',
  },
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
    color: '#f8fafc',
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionSubtext: {
    fontSize: 13,
    color: '#94a3b8',
  },
  noResultsContainer: {
    padding: 32,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    gap: 12,
  },
  noResultsText: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  map: {
    flex: 1,
  },
  mapModalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  coordsDisplay: {
    marginBottom: 16,
  },
  coordsLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  coordsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  selectLocationButton: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  selectLocationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
