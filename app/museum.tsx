import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { HeritageSite, museums, reviews } from "../api";
import { getImageUrl } from "../utils/image";

import { useLanguage } from "../hooks/i18n";

const categories = ["All", "Art & Culture", "History", "Heritage"] as const;

const fallbackMuseums = [
  {
    site_id: 1,
    name: "Patan Museum",
    location: "Durbar Square, Patan",
    description: "Restored Malla palace showcasing Newar art and sacred objects",
    tag: "Art & Culture",
    photo_url: "",
    gps_coordinates: "",
  },
];

export default function MuseumScreen() {
  const { t } = useLanguage();
  const [userType, setUserType] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<(typeof categories)[number]>("All");
  const [sites, setSites] = React.useState<HeritageSite[]>(fallbackMuseums as HeritageSite[]);
  const [mainSearchQuery, setMainSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [bookingVisible, setBookingVisible] = React.useState(false);
  const [reviewVisible, setReviewVisible] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState<HeritageSite | null>(null);
  const [reviewSite, setReviewSite] = React.useState<HeritageSite | null>(null);
  const [bookingForm, setBookingForm] = React.useState({ name: "", email: "", visit_date: "", quantity: "1" });
  const [reviewForm, setReviewForm] = React.useState({ thoughts: "", rating: 5 });
  const [bookingMessage, setBookingMessage] = React.useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = React.useState<string | null>(null);
  const [showMuseumForm, setShowMuseumForm] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [museumForm, setMuseumForm] = React.useState({
    name: '',
    description: '',
    opening_hours: '',
    gps_coordinates: '',
    image: ''
  });
  const [submittingMuseum, setSubmittingMuseum] = React.useState(false);
  const [showMapModal, setShowMapModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedCoords, setSelectedCoords] = React.useState({
    latitude: 27.7172,
    longitude: 85.3240
  });
  const [editingMuseumId, setEditingMuseumId] = React.useState<number | null>(null);
  const mapRef = React.useRef<MapView>(null);
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem('userType');
      setUserType(type);
    };
    fetchUserType();
  }, []);

  const refreshMuseums = async () => {
    try {
      const data = await museums.getAll();
      const museumList = data.museums || data.sites || [];
      setSites(museumList as any);
      console.log('Museums refreshed successfully');
    } catch (err) {
      console.error("Failed to refresh museums:", err);
    }
  };

  React.useEffect(() => {
    let mounted = true;
    const loadSites = async () => {
      setLoading(true);
      try {
        const data = await museums.getAll();
        if (!mounted) return;

        const museumList = data.museums || data.sites || [];
        setSites(museumList as any);
      } catch (err) {
        console.warn("Failed to load museums from API, using fallback", err);
        if (mounted) setSites(fallbackMuseums as HeritageSite[]);
      } finally {
        mounted && setLoading(false);
      }
    };
    loadSites();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredMuseums = sites.filter((item) => {
    const matchesSearch = mainSearchQuery.trim() === '' ||
      (item.name && item.name.toLowerCase().includes(mainSearchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(mainSearchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(mainSearchQuery.toLowerCase()));
    return matchesSearch;
  });

  const pickMuseumImage = async () => {
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
      setMuseumForm({ ...museumForm, image: result.assets[0].uri });
    }
  };

  const submitMuseum = async () => {
    if (!museumForm.name || !museumForm.description || !museumForm.opening_hours) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Description, Opening Hours)');
      return;
    }

    setSubmittingMuseum(true);
    try {
      const isEditing = editingMuseumId !== null;

      const formData = new FormData();
      formData.append('name', museumForm.name);
      formData.append('description', museumForm.description);
      formData.append('opening_hours', museumForm.opening_hours);
      formData.append('gps_coordinates', museumForm.gps_coordinates);
      // If we have an image URI that is a file path, we append it
      if (museumForm.image && museumForm.image.startsWith('file://')) {
        const localUri = museumForm.image;
        const filename = localUri.split('/').pop() || 'museum.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Field name 'image' as expected by backend upload.single('image')
        formData.append('image', { uri: localUri, name: filename, type } as any);
      } else if (selectedImage && selectedImage.startsWith('file://')) {
        const localUri = selectedImage;
        const filename = localUri.split('/').pop() || 'museum.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('image', { uri: localUri, name: filename, type } as any);
      }

      console.log('Submitting museum FormData:', { isEditing, editingMuseumId });

      let data;

      if (isEditing && editingMuseumId) {
        data = await museums.update(editingMuseumId, formData);
      } else {
        data = await museums.add(formData);
      }

      Alert.alert('Success', isEditing ? 'Museum updated successfully' : 'Museum added successfully');
      setMuseumForm({ name: '', description: '', opening_hours: '', gps_coordinates: '', image: '' });
      setSelectedImage(null);
      setEditingMuseumId(null);
      setShowMuseumForm(false);
      // Auto-refresh the museums list
      await refreshMuseums();
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmittingMuseum(false);
    }
  };

  const openAddMuseumForm = () => {
    setEditingMuseumId(null);
    setShowMuseumForm(true);
    setSelectedImage(null);
    setSelectedCoords({ latitude: 27.7172, longitude: 85.3240 });
    setMuseumForm({ name: '', description: '', opening_hours: '', gps_coordinates: '', image: '' });
  };

  const openEditMuseumForm = (museum: HeritageSite) => {
    // Try to get the correct ID - check for museum_id first, then site_id, then id
    const museumId = (museum as any).museum_id || museum.site_id || (museum as any).id;
    console.log('Opening edit form for museum:', { museumId, museum });

    setEditingMuseumId(museumId);
    setShowMuseumForm(true);
    setSelectedImage(getImageUrl(museum.image_url || museum.photo_url) || null);
    setMuseumForm({
      name: museum.name || '',
      description: museum.description || '',
      opening_hours: (museum as any).opening_hours || '',
      gps_coordinates: museum.gps_coordinates || '',
      image: getImageUrl(museum.image_url || museum.photo_url) || ''
    });
    // Parse coordinates for map
    if (museum.gps_coordinates) {
      const match = museum.gps_coordinates.match(/(\d+\.\d+)°[NS],\s*(\d+\.\d+)°[EW]/);
      if (match) {
        setSelectedCoords({
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        });
      }
    }
  };

  const deleteMuseum = async (museum: HeritageSite) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this museum? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Try different ID fields that might be in the museum object
              const museumId = (museum as any).museum_id || museum.site_id || (museum as any).id;
              console.log('Attempting to delete museum:', { museumId, museum });

              await museums.delete(museumId);
              Alert.alert('Success', 'Museum deleted successfully');
              // Auto-refresh the museums list
              await refreshMuseums();
            } catch (error: any) {
              console.error('Delete error:', error);
              Alert.alert('Error', error.message || 'Failed to delete museum');
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
    setMuseumForm({ ...museumForm, gps_coordinates: coordString });
    setShowMapModal(false);
  };

  const openMapNavigation = (gpsCoordinates: string, name: string) => {
    try {
      // Parse coordinates in format "27.7172°N, 85.3240°E"
      const match = gpsCoordinates.match(/(\d+\.\d+)°[NS],\s*(\d+\.\d+)°[EW]/);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        router.push({
          pathname: '/map',
          params: { latitude: lat.toString(), longitude: lng.toString(), name }
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
    setSearchQuery(text);

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
    setSearchQuery(item.display_name || '');
    setSearchResults([]);
    mapRef.current?.animateToRegion({
      latitude: newCoords.latitude,
      longitude: newCoords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);
  };

  const openBooking = (site: HeritageSite) => {
    setSelectedSite(site);
    setBookingVisible(true);
  };

  const openReview = (site: HeritageSite) => {
    setReviewSite(site);
    setReviewForm({ thoughts: "", rating: 5 });
    setReviewMessage(null);
    setReviewVisible(true);
  };

  const submitBooking = async () => {
    if (!selectedSite) return;
    const qty = Number(bookingForm.quantity) || 1;
    // Navigate to payment first; booking will be finalized from the payment screen.
    router.push({
      pathname: "/payment",
      params: {
        siteId: String(selectedSite.site_id),
        siteName: selectedSite.name,
        visit_date: bookingForm.visit_date,
        quantity: String(qty),
        amount: String(qty * 500),
        name: bookingForm.name,
        email: bookingForm.email,
      },
    });
  };

  const shareReceipt = async () => {
    if (!selectedSite) return;
    await Share.share({
      message: `Ticket for ${selectedSite.name}\nDate: ${bookingForm.visit_date}\nQty: ${bookingForm.quantity}`,
    });
  };

  const submitSiteReview = async (site: HeritageSite) => {
    setReviewMessage(null);

    // Validation
    if (!reviewForm.thoughts || reviewForm.thoughts.trim().length === 0) {
      setReviewMessage("Please share your thoughts");
      return;
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewMessage("Rating must be between 1 and 5");
      return;
    }

    try {
      const museumId = (site as any).museum_id || site.site_id;

      const response = await reviews.create({
        museum_id: museumId,
        rating: reviewForm.rating,
        thoughts: reviewForm.thoughts.trim(),
      });

      setReviewMessage(response.message || "Review submitted successfully");
      setReviewForm({ thoughts: "", rating: 5 });

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setReviewVisible(false);
        setReviewMessage(null);
      }, 2000);

    } catch (err: any) {
      console.error('Review error:', err);
      setReviewMessage(err?.message || "Review failed");
    }
  };

  const renderStars = () => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= reviewForm.rating;
        return (
          <TouchableOpacity key={value} onPress={() => setReviewForm((p) => ({ ...p, rating: value }))}>
            <Ionicons name={filled ? "star" : "star-outline"} size={24} color="#f6c343" />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Museums</Text>
              <Text style={styles.description}>Explore Nepal's rich cultural treasures</Text>
            </View>
            {userType === 'admin' && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={openAddMuseumForm}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Museum</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#9aa3b5" />
          <TextInput
            style={[styles.searchInput, styles.mainSearchInput]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor="#9aa3b5"
            value={mainSearchQuery}
            onChangeText={setMainSearchQuery}
          />
          {mainSearchQuery !== '' && (
            <TouchableOpacity onPress={() => setMainSearchQuery('')}>
              <Ionicons name="close" size={18} color="#9aa3b5" />
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color="#b0191e" />
          </View>
        )}

        {filteredMuseums.length === 0 && !loading && (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>{t('noItemsFound')}</Text>
          </View>
        )}

        {filteredMuseums.map((item, index) => (
          <View key={item.site_id ? `museum-${item.site_id}` : `museum-idx-${index}`} style={styles.card}>
            <View style={[styles.cardImage, styles.cardImageRadius]}>
              {item.image_url || item.photo_url ? (
                <Image
                  source={{ uri: getImageUrl(item.image_url || item.photo_url) }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]} />
              )}
              <View style={styles.cardTopRow}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagPillText}>{item.tag}</Text>
                </View>
              </View>
              <View style={styles.cardTitleBlock}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={12} color="#e5e7eb" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.infoPanel}>
                <View style={styles.inlineRow}>
                  <Ionicons name="location" size={14} color="#0f172a" />
                  <Text style={styles.infoTextStrong}>{item.location}</Text>
                </View>
                <Text style={styles.blurb}>{item.description}</Text>
                {item.gps_coordinates && userType !== 'admin' ? (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={styles.navButton}
                      onPress={() => openMapNavigation(item.gps_coordinates!, item.name)}
                    >
                      <Ionicons name="navigate" size={16} color="#2563EB" />
                      <Text style={styles.navButtonText}>{t('map')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.navButton, styles.googleMapButton]}
                      onPress={() => openGoogleMaps(item.gps_coordinates!)}
                    >
                      <Ionicons name="logo-google" size={16} color="#059669" />
                      <Text style={styles.googleMapButtonText}>{t('googleMaps')}</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              <View style={styles.footerRow}>
                {userType === 'admin' ? (
                  <>
                    <TouchableOpacity style={[styles.bookButton, styles.editButton]} activeOpacity={0.9} onPress={() => openEditMuseumForm(item)}>
                      <Ionicons name="pencil" size={16} color="#fff" />
                      <Text style={styles.bookButtonText}>{t('edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bookButton, styles.deleteButton]} activeOpacity={0.9} onPress={() => deleteMuseum(item)}>
                      <Ionicons name="trash" size={16} color="#fff" />
                      <Text style={styles.bookButtonText}>{t('delete')}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.bookButton} activeOpacity={0.9} onPress={() => openBooking(item)}>
                      <Text style={styles.bookButtonText}>{t('bookTicket')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reviewCta} activeOpacity={0.9} onPress={() => openReview(item)}>
                      <Text style={styles.reviewCtaText}>{t('leaveReview')}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={bookingVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Book ticket for {selectedSite?.name}</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={bookingForm.name}
              onChangeText={(t) => setBookingForm((p) => ({ ...p, name: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={bookingForm.email}
              onChangeText={(t) => setBookingForm((p) => ({ ...p, email: t }))}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Visit date (YYYY-MM-DD)"
              value={bookingForm.visit_date}
              onChangeText={(t) => setBookingForm((p) => ({ ...p, visit_date: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={bookingForm.quantity}
              onChangeText={(t) => setBookingForm((p) => ({ ...p, quantity: t }))}
              keyboardType="numeric"
            />

            <View style={styles.totalRow}>
              <Text style={styles.labelText}>Total</Text>
              <Text style={styles.totalText}>Rs. {(Number(bookingForm.quantity) || 1) * 500}</Text>
            </View>

            {bookingMessage && <Text style={styles.message}>{bookingMessage}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.bookButton} onPress={submitBooking}>
                <Text style={styles.bookButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={shareReceipt}>
                <Text style={styles.secondaryButtonText}>Share Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setBookingVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={reviewVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Review {reviewSite?.name}</Text>
            <Text style={styles.mutedLabel}>Your rating</Text>
            {renderStars()}
            <TextInput
              style={[styles.input, styles.reviewInputModal]}
              multiline
              placeholder="Share your thoughts"
              value={reviewForm.thoughts}
              onChangeText={(t) => setReviewForm((p) => ({ ...p, thoughts: t }))}
            />

            {reviewMessage && <Text style={styles.message}>{reviewMessage}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.bookButton} onPress={() => reviewSite && submitSiteReview(reviewSite)}>
                <Text style={styles.bookButtonText}>Submit Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setReviewVisible(false);
                  setReviewMessage(null);
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Museum Form Modal */}
      <Modal
        visible={showMuseumForm}
        animationType="slide"
        onRequestClose={() => setShowMuseumForm(false)}
      >
        <SafeAreaView style={styles.formSafeArea}>
          <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{editingMuseumId ? t('edit') : t('museums')}</Text>
              <TouchableOpacity onPress={() => setShowMuseumForm(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('name')} *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., National Museum of Nepal"
                value={museumForm.name}
                onChangeText={(text) => setMuseumForm({ ...museumForm, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('description')} *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Describe the museum and its collections..."
                value={museumForm.description}
                onChangeText={(text) => setMuseumForm({ ...museumForm, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('openingHours')} *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 10:30 AM - 4:00 PM (Closed on Tuesdays)"
                value={museumForm.opening_hours}
                onChangeText={(text) => setMuseumForm({ ...museumForm, opening_hours: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('gpsCoordinates')}</Text>
              <TouchableOpacity
                style={styles.mapInput}
                onPress={() => setShowMapModal(true)}
              >
                <Ionicons name="location" size={20} color="#6B7280" />
                <Text style={museumForm.gps_coordinates ? styles.mapInputText : styles.mapInputPlaceholder}>
                  {museumForm.gps_coordinates || 'Tap to select location on map'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('museumImage')}</Text>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickMuseumImage}
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
                onPress={() => setShowMuseumForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.submitButton]}
                onPress={submitMuseum}
                disabled={submittingMuseum}
              >
                <Text style={styles.submitButtonText}>
                  {submittingMuseum ? (editingMuseumId ? 'Updating...' : 'Submitting...') : (editingMuseumId ? 'Update Museum' : 'Add Museum')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Map Modal for Museum Location Selection */}
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
                placeholder="Search in Nepal (cities, landmarks...)"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={handleSearchInput}
                onSubmitEditing={() => { }}
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
  safeArea: { flex: 1, backgroundColor: "#f5f6fa" },
  container: { padding: 16, paddingBottom: 28, gap: 16, paddingTop: 36 },
  headerSection: { gap: 4 },
  title: { fontSize: 22, fontWeight: "700", color: "#1f2937" },
  subtitle: { fontSize: 20, fontStyle: "italic", color: "#b0191e" },
  description: { fontSize: 13, color: "#4b5563" },
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
  },
  searchButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#b0191e",
    alignItems: "center",
    justifyContent: "center",
  },
  chipRow: { gap: 10, paddingVertical: 6 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#eef1f5",
  },
  chipActive: { backgroundColor: "#b0191e" },
  chipText: { color: "#4b5563", fontSize: 13 },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  sliderTrack: {
    height: 10,
    backgroundColor: "#d7dbe2",
    borderRadius: 6,
    overflow: "hidden",
  },
  sliderProgress: { height: "100%", width: "65%", backgroundColor: "#111827" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaText: { fontSize: 12, color: "#4b5563" },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterText: { color: "#b0191e", fontSize: 13, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cardImage: { height: 170, width: "100%" },
  cardImageRadius: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardImagePlaceholder: { backgroundColor: "#0f172a" },
  cardTopRow: { flexDirection: "row", padding: 12 },
  tagPill: {
    backgroundColor: "#e71d36",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  tagPillText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  cardTitleBlock: { position: "absolute", left: 12, bottom: 12, right: 12 },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  locationText: { color: "#e5e7eb", fontSize: 12 },
  cardBody: { padding: 14, gap: 10 },
  blurb: { fontSize: 13, color: "#374151", lineHeight: 18 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingText: { fontSize: 13, fontWeight: "700", color: "#1f2937" },
  reviewText: { fontSize: 12, color: "#6b7280" },
  infoText: { fontSize: 12, color: "#6b7280" },
  infoTextStrong: { fontSize: 13, color: "#0f172a", fontWeight: "700" },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  mutedLabel: { fontSize: 11, color: "#6b7280" },
  priceText: { fontSize: 14, fontWeight: "700", color: "#b0191e", marginTop: 2 },
  coordinatesLink: { color: "#2563EB", textDecorationLine: "underline" },
  bookButton: {
    backgroundColor: "#b0191e",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 120,
    alignItems: "center",
  },
  bookButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  reviewLabel: { fontSize: 12, color: "#0f172a", fontWeight: "700" },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    color: "#111827",
    minHeight: 60,
  },
  ratingInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 50,
    fontSize: 12,
    color: "#111827",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0f172a",
  },
  modalActions: { gap: 8 },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#0f172a", fontSize: 12, fontWeight: "700" },
  closeButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: { color: "#6b7280", fontSize: 12, fontWeight: "700" },
  message: { color: "#0f172a", fontSize: 12 },
  reviewCta: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 120,
    alignItems: "center",
  },
  reviewCtaText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  editButton: {
    backgroundColor: "#2563EB",
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  infoPanel: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  starRow: { flexDirection: "row", gap: 6 },
  reviewInputModal: { minHeight: 90 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  labelText: { color: "#475569", fontSize: 13, fontWeight: "600" },
  totalText: { color: "#b0191e", fontSize: 15, fontWeight: "800" },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#F9FAFB',
  },
  mainSearchInput: {
    color: '#000000',
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
});
