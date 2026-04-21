import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // Added import
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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
import MapView, { Marker } from "react-native-maps";
import { WebView } from "react-native-webview";
import { favorites, payment as paymentApi, reviews, sites } from "../api";
import { getImageUrl } from "../utils/image";

import { useLanguage } from "../hooks/i18n";

function HeritageSiteScreen() {
  const router = useRouter(); // Added router
  const { t } = useLanguage();
  const [heritage, setHeritage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState<string | null>(null);
  const [showHeritageSiteForm, setShowHeritageSiteForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [heritageSiteForm, setHeritageSiteForm] = useState({
    name: "",
    description: "",
    gps_coordinates: "",
  });
  const [submittingHeritageSite, setSubmittingHeritageSite] = useState(false);
  const [editingHeritageSiteId, setEditingHeritageSiteId] = useState<
    number | null
  >(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: 27.7172,
    longitude: 85.324,
  });
  const mapRef = React.useRef<MapView>(null);
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isAdmin = userType === "admin";

  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [showSiteModal, setShowSiteModal] = useState(false);

  // Payment State
  const [paying, setPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showKhalti, setShowKhalti] = useState(false);
  const [showEsewa, setShowEsewa] = useState(false);
  const [khaltiUrl, setKhaltiUrl] = useState<string | null>(null);
  const [esewaParams, setEsewaParams] = useState<any>(null);
  const [pidx, setPidx] = useState<string | null>(null);
  const [favoriteSiteIds, setFavoriteSiteIds] = useState<Set<number>>(
    new Set(),
  );
  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsListModal, setShowReviewsListModal] = useState(false);
  const [siteReviewSummary, setSiteReviewSummary] = useState<{
    averageRating: string;
    totalReviews: number;
    reviews: any[];
  } | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewThoughts, setReviewThoughts] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [originalHeritageForm, setOriginalHeritageForm] = useState<any>(null);
  const [originalHeritageImages, setOriginalHeritageImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem("userType");
      setUserType(type);
    };
    fetchUserType();
  }, []);

  const refreshHeritageSites = async () => {
    try {
      const data = await sites.getAll(!!isAdmin);
      setHeritage(data.sites || []);
      console.log("Heritage sites refreshed successfully");
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
        console.log(data);
        setHeritage(data.sites || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch heritage sites");
      } finally {
        setLoading(false);
      }
    };
    fetchHeritageSites();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userType === "user") {
        try {
          const data = await favorites.getAll();
          const ids = new Set(data.favorites.map((s: any) => s.site_id));
          setFavoriteSiteIds(ids);
        } catch (err) {
          console.error("Failed to fetch favorites:", err);
        }
      }
    };
    fetchFavorites();
  }, [userType]);

  const toggleFavoriteSite = async (siteId: number) => {
    if (userType !== "user") {
      Alert.alert(
        t("loginRequired") || "Login Required",
        "Please login as a user to favorite sites.",
      );
      return;
    }

    // Optimistic UI update
    setFavoriteSiteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(siteId)) {
        newSet.delete(siteId);
      } else {
        newSet.add(siteId);
      }
      return newSet;
    });

    try {
      await favorites.toggle(siteId);
    } catch (err: any) {
      console.error("Failed to toggle favorite:", err);
      // Rollback on error
      setFavoriteSiteIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(siteId)) {
          newSet.delete(siteId);
        } else {
          newSet.add(siteId);
        }
        return newSet;
      });
      Alert.alert("Error", err.message || "Failed to toggle favorite");
    }
  };
  console.log("HERITAGE", heritage);

  const filteredHeritage = heritage.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      (item.name &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
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
        router.push({
          pathname: "/map",
          params: {
            latitude: lat.toString(),
            longitude: lng.toString(),
            name: siteName,
          },
        });
      } else {
        Alert.alert("Error", "Invalid coordinates format");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Could not open map navigation");
    }
  };

  const openSite = async (site: any) => {
    if (site.is_unlocked || isAdmin) {
      try {
        setLoading(true);
        const siteId = site.site_id || site.id;
        const data = await sites.getFullSite(siteId);
        setSelectedSite(data.site);
        setShowSiteModal(true);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Could not fetch full site");
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedSite(site);
      setShowPaymentModal(true);
    }
  };

  // --- Payment Handlers ---
  const handleKhaltiPay = async () => {
    if (!selectedSite) return;
    setPaying(true);
    try {
      const siteId = selectedSite.site_id || selectedSite.id;
      const res = await paymentApi.initiateSiteKhalti({
        site_id: siteId,
        price: 50,
      });

      if (res.payment_url) {
        setKhaltiUrl(res.payment_url);
        setPidx(res.pidx);
        setShowPaymentModal(false);
        setShowKhalti(true);
      } else {
        throw new Error("Failed to get Khalti payment URL");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Could not initiate Khalti payment.");
    } finally {
      setPaying(false);
    }
  };

  const handleEsewaPay = async () => {
    if (!selectedSite) return;
    setPaying(true);
    try {
      const siteId = selectedSite.site_id || selectedSite.id;
      const res = await paymentApi.initiateSiteEsewa({
        site_id: siteId,
        price: 50,
      });

      if (res.signature) {
        setEsewaParams(res);
        setShowPaymentModal(false);
        setShowEsewa(true);
      } else {
        throw new Error("Failed to get eSewa payment parameters");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Could not initiate eSewa payment.");
    } finally {
      setPaying(false);
    }
  };

  const onKhaltiStateChange = async (webViewState: any) => {
    const { url } = webViewState;
    if (url.includes("success.historicalwalk.com/khalti")) {
      setShowKhalti(false);
      setPaying(true);

      try {
        if (pidx) {
          await paymentApi.verifySiteKhalti({ pidx });
          await refreshHeritageSites();
          // Auto-open the full content modal
          if (selectedSite) {
            const siteId = selectedSite.site_id || selectedSite.id;
            const data = await sites.getFullSite(siteId);
            setSelectedSite(data.site);
            setShowSiteModal(true);
          }
        }
      } catch (err: any) {
        Alert.alert("Khalti Payment error", "Could not verify Khalti payment.");
      } finally {
        setPaying(false);
      }
    }
  };

  const onEsewaStateChange = async (webViewState: any) => {
    const { url } = webViewState;
    if (url.includes("failure.historicalwalk.com/esewa")) {
      setShowEsewa(false);
      Alert.alert("Payment Failed", "eSewa transaction failed.");
      return;
    }

    if (url.includes("success.historicalwalk.com/esewa")) {
      const urlParams = url.split("?")[1];
      const dataParam = urlParams
        ?.split("&")
        .find((p: string) => p.startsWith("data="))
        ?.split("=")[1];

      if (dataParam) {
        setShowEsewa(false);
        setPaying(true);
        try {
          await paymentApi.verifySiteEsewa({
            encodedData: decodeURIComponent(dataParam),
          });
          await refreshHeritageSites();
          // Auto-open the full content modal
          if (selectedSite) {
            const siteId = selectedSite.site_id || selectedSite.id;
            const data = await sites.getFullSite(siteId);
            setSelectedSite(data.site);
            setShowSiteModal(true);
          }
        } catch (err: any) {
          Alert.alert("eSewa Payment error", "Could not verify eSewa payment.");
        } finally {
          setPaying(false);
        }
      }
    }
  };

  const pickHeritageSiteImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "You need to grant camera roll permissions to upload images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...newUris].slice(0, 5));
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedSite) return;
    const siteId = selectedSite.site_id || selectedSite.id;

    if (reviewRating === 0) {
      Alert.alert("Error", "Please choose a rating for this site.");
      return;
    }

    if (!reviewThoughts.trim()) {
      Alert.alert("Error", "Please write your thoughts about this site.");
      return;
    }

    setSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append("site_id", String(siteId));
      formData.append("rating", String(reviewRating));
      formData.append("thoughts", reviewThoughts.trim());

      await reviews.create(formData);
      Alert.alert("Success", "Thank you for your review!");
      setShowReviewModal(false);
      setReviewThoughts("");
      setReviewRating(0);
    } catch (err: any) {
      console.error("Review error:", err);
      Alert.alert("Error", err.message || "Could not submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const removeHeritageSiteImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHeritageSite = async () => {
    if (!isAdmin) {
      Alert.alert("Restricted", "Only admins can manage heritage sites.");
      return;
    }
    if (
      !heritageSiteForm.name ||
      !heritageSiteForm.description ||
      selectedImages.length === 0 ||
      !heritageSiteForm.gps_coordinates
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Description, Photo, GPS Coordinates)",
      );
      return;
    }

    setSubmittingHeritageSite(true);
    try {
      const isEditing = editingHeritageSiteId !== null;

      const formData = new FormData();
      formData.append("name", heritageSiteForm.name);
      formData.append("description", heritageSiteForm.description);
      formData.append("gps_coordinates", heritageSiteForm.gps_coordinates);

      if (isEditing) {
        const hasFormChanged = Object.keys(heritageSiteForm).some(
          (key) => heritageSiteForm[key as keyof typeof heritageSiteForm] !== originalHeritageForm?.[key]
        );
        const haveImagesChanged = 
          selectedImages.length !== originalHeritageImages.length ||
          selectedImages.some((uri, i) => uri !== originalHeritageImages[i]);

        if (!hasFormChanged && !haveImagesChanged) {
          Alert.alert("No Changes", "No changes detected. Please modify at least one field before updating.");
          setSubmittingHeritageSite(false);
          return;
        }
      }

      if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach((uri, index) => {
          const filename = uri.split("/").pop() || `site_${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpeg";

          // @ts-ignore
          formData.append("images", {
            uri,
            name: filename,
            type,
          });
        });
      }

      console.log("Submitting heritage site FormData:", {
        isEditing,
        editingHeritageSiteId,
      });

      let data;
      if (isEditing && editingHeritageSiteId) {
        data = await sites.update(editingHeritageSiteId, formData);
      } else {
        data = await sites.add(formData);
      }

      Alert.alert("Success", isEditing ? "Site updated" : "Site added");
      setHeritageSiteForm({
        name: "",
        description: "",
        gps_coordinates: "",
      });
      setSelectedImages([]);
      setEditingHeritageSiteId(null);
      setShowHeritageSiteForm(false);
      await refreshHeritageSites();
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setSubmittingHeritageSite(false);
    }
  };

  const openAddHeritageSiteForm = () => {
    if (!isAdmin) {
      Alert.alert("Restricted", "Only admins can add heritage sites.");
      return;
    }
    setEditingHeritageSiteId(null);
    setShowHeritageSiteForm(true);
    setSelectedImages([]);
    setSelectedCoords({ latitude: 27.7172, longitude: 85.324 });
    setHeritageSiteForm({
      name: "",
      description: "",
      gps_coordinates: "",
    });
  };

  const openEditHeritageSiteForm = (site: any) => {
    if (!isAdmin) {
      Alert.alert("Restricted", "Only admins can edit heritage sites.");
      return;
    }
    const siteId = site.site_id || site.id;
    console.log("Opening edit form for heritage site:", { siteId, site });

    setEditingHeritageSiteId(site.site_id);
    setShowHeritageSiteForm(true);

    // Support multiple images for editing
    const mainImage = getImageUrl(site.image_url || site.photo_url);
    const existingImages = (site.additional_images || [])
      .map((img: string) => getImageUrl(img))
      .filter(Boolean);
    const allImages = mainImage
      ? [mainImage, ...existingImages]
      : existingImages;
    setSelectedImages(allImages as string[]);

    setHeritageSiteForm({
      name: site.name || "",
      description: site.full_description || site.description || "",
      gps_coordinates: site.gps_coordinates || "",
    });
    setOriginalHeritageForm({
      name: site.name || "",
      description: site.full_description || site.description || "",
      gps_coordinates: site.gps_coordinates || "",
    });
    setOriginalHeritageImages(allImages as string[]);
    // Parse coordinates for map
    if (site.gps_coordinates) {
      const match = site.gps_coordinates.match(
        /(\d+\.\d+)°[NS],\s*(\d+\.\d+)°[EW]/,
      );
      if (match) {
        setSelectedCoords({
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        });
      }
    }
  };

  const deleteHeritageSite = async (site: any) => {
    if (!isAdmin) {
      Alert.alert("Restricted", "Only admins can delete heritage sites.");
      return;
    }
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this heritage site? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const siteId = site.site_id || site.id;
              console.log("Attempting to delete heritage site:", {
                siteId,
                site,
              });

              await sites.delete(siteId);
              Alert.alert("Success", "Heritage site deleted successfully");
              await refreshHeritageSites();
            } catch (error: any) {
              console.error("Delete error:", error);
              Alert.alert(
                "Error",
                error.message || "Failed to delete heritage site",
              );
            }
          },
        },
      ],
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

  const openReviewsList = async (site: any) => {
    const siteId = site.site_id || site.id;
    setLoadingReviews(true);
    setShowReviewsListModal(true);
    try {
      const data = await reviews.getSummary({ site_id: siteId });
      setSiteReviewSummary({
        averageRating: data.averageRating,
        totalReviews: data.totalReviews,
        reviews: data.reviews,
      });
    } catch (err: any) {
      console.error("Fetch reviews error:", err);
      Alert.alert("Error", "Could not load reviews.");
    } finally {
      setLoadingReviews(false);
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
            "User-Agent": "HistoricalWalkApp/1.0",
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        setSearchResults([]);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid content type:", contentType);
        setSearchResults([]);
        return;
      }

      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
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
    setMapSearchQuery(item.display_name || "");
    setSearchResults([]);
    mapRef.current?.animateToRegion(
      {
        latitude: newCoords.latitude,
        longitude: newCoords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000,
    );
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
            <View style={styles.headerLeftWithBack}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/navigationbar")}
              >
                <Ionicons name="chevron-back" size={28} color="#1f2937" />
              </TouchableOpacity>
              <View>
                <Text style={styles.title}>Heritage Sites</Text>
                <Text style={styles.description}>
                  Explore Nepal's rich cultural treasures
                </Text>
              </View>
            </View>
            {userType === "admin" && (
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
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={18} color="#9aa3b5" />
            </TouchableOpacity>
          )}
        </View>

        {filteredHeritage.length === 0 && !loading ? (
          <Text style={styles.emptyText}>No heritage sites found</Text>
        ) : (
          filteredHeritage.map((site, idx) => {
            const imageUri = getImageUrl(
              site.image_url || site.photo_url || site.photoUrl || site.image,
            );
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
                    <Text style={styles.placeholderText}>
                      No image available
                    </Text>
                  </View>
                )}
                <View style={styles.siteContent}>
                  <Text style={styles.siteName}>{site.name}</Text>
                  <Text style={styles.siteLocation}>{site.location}</Text>
                  <Text style={styles.siteDescription}>{site.description}</Text>
                  {site.has_full_content && !isAdmin && (
                    <TouchableOpacity
                      style={{
                        marginTop: 6,
                        backgroundColor: site.is_unlocked
                          ? "#2563eb"
                          : "#c71f37",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        alignSelf: "flex-start",
                      }}
                      activeOpacity={0.9}
                      onPress={() => openSite(site)}
                    >
                      <Ionicons
                        name={site.is_unlocked ? "book" : "lock-closed"}
                        size={12}
                        color="#fff"
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        {site.is_unlocked ? "Read Now" : "Read More (Rs. 50)"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {site.has_full_content && isAdmin && (
                    <TouchableOpacity
                      style={{
                        marginTop: 6,
                        backgroundColor: "#2563eb",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        alignSelf: "flex-start",
                      }}
                      activeOpacity={0.9}
                      onPress={() => openSite(site)}
                    >
                      <Ionicons name="book" size={12} color="#fff" />
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        Read Content
                      </Text>
                    </TouchableOpacity>
                  )}
                  {site.gps_coordinates && userType === "user" ? (
                    <View style={styles.navigationButtons}>
                      <TouchableOpacity
                        style={styles.navButton}
                        activeOpacity={0.8}
                        onPress={() =>
                          openMapNavigation(site.gps_coordinates, site.name)
                        }
                      >
                        <Ionicons name="navigate" size={18} color="#b91c1c" />
                        <Text style={styles.navButtonText}>Navigate</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {userType === "user" && (
                    <TouchableOpacity
                      style={styles.seeReviewsButton}
                      onPress={() => openReviewsList(site)}
                    >
                      <Ionicons
                        name="chatbubbles-outline"
                        size={18}
                        color="#2563eb"
                      />
                      <Text style={styles.seeReviewsButtonText}>
                        See User Reviews
                      </Text>
                    </TouchableOpacity>
                  )}
                  {userType === "admin" && (
                    <View style={styles.footerRow}>
                      <TouchableOpacity
                        style={[styles.bookButton, styles.editButton]}
                        activeOpacity={0.9}
                        onPress={() => openEditHeritageSiteForm(site)}
                      >
                        <Ionicons name="pencil" size={16} color="#fff" />
                        <Text style={styles.bookButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.bookButton, styles.deleteButton]}
                        activeOpacity={0.9}
                        onPress={() => deleteHeritageSite(site)}
                      >
                        <Ionicons name="trash" size={16} color="#fff" />
                        <Text style={styles.bookButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {userType === "user" && (
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() =>
                        toggleFavoriteSite(site.site_id || site.id)
                      }
                    >
                      <Ionicons
                        name={
                          favoriteSiteIds.has(site.site_id || site.id)
                            ? "heart"
                            : "heart-outline"
                        }
                        size={24}
                        color={
                          favoriteSiteIds.has(site.site_id || site.id)
                            ? "#DC2626"
                            : "#fff"
                        }
                      />
                    </TouchableOpacity>
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
              <Text style={styles.formTitle}>
                {editingHeritageSiteId ? t("edit") : t("heritageSites")}
              </Text>
              <TouchableOpacity onPress={() => setShowHeritageSiteForm(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("name")} *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Pashupatinath Temple"
                value={heritageSiteForm.name}
                onChangeText={(text) =>
                  setHeritageSiteForm({ ...heritageSiteForm, name: text })
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("description")} *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Describe the heritage site..."
                value={heritageSiteForm.description}
                onChangeText={(text) =>
                  setHeritageSiteForm({
                    ...heritageSiteForm,
                    description: text,
                  })
                }
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
                <Text
                  style={
                    heritageSiteForm.gps_coordinates
                      ? styles.mapInputText
                      : styles.mapInputPlaceholder
                  }
                >
                  {heritageSiteForm.gps_coordinates ||
                    "Tap to select location on map"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Site Images (Up to 5)</Text>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickHeritageSiteImage}
              >
                <View style={styles.imagePickerPlaceholder}>
                  <Ionicons name="images-outline" size={32} color="#9CA3AF" />
                  <Text style={styles.imagePickerText}>{t("tapToSelect")}</Text>
                </View>
              </TouchableOpacity>

              {selectedImages.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagePreviewList}
                >
                  {selectedImages.filter(Boolean).map((uri, index) => (
                    <View key={index} style={styles.previewImageWrapper}>
                      <Image source={{ uri }} style={styles.previewThumbnail} />
                      <TouchableOpacity
                        style={styles.removeImageIcon}
                        onPress={() => removeHeritageSiteImage(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#DC2626"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
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
                  {submittingHeritageSite
                    ? editingHeritageSiteId
                      ? "Updating..."
                      : "Submitting..."
                    : editingHeritageSiteId
                      ? "Update Site"
                      : "Add Site"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Payment Selection Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Unlock Site Content</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <Text style={styles.paymentDescription}>
              Unlock the full description of "{selectedSite?.name}" for Rs. 50.
              Pay once and keep it forever!
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.payButton,
                  styles.khaltiButtonOutline,
                  paying && styles.disabledButton,
                ]}
                onPress={handleKhaltiPay}
                disabled={paying}
              >
                <Image
                  source={require("../assets/images/khalti-logo.png")}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
                <Text style={styles.payTextKhalti}>
                  {paying ? "Processing..." : `Pay with Khalti (Rs. 50)`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.payButton,
                  styles.esewaButtonOutline,
                  paying && styles.disabledButton,
                ]}
                onPress={handleEsewaPay}
                disabled={paying}
              >
                <Image
                  source={require("../assets/images/esewa-logo.png")}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
                <Text style={styles.payTextEsewa}>Pay with eSewa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Read Site Full Content Modal */}
      <Modal visible={showSiteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.siteModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedSite?.name}</Text>
              <TouchableOpacity onPress={() => setShowSiteModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
            >
              {selectedSite && (
                <>
                  {/* Image Carousel */}
                  {selectedSite.image_url ||
                  selectedSite.photo_url ||
                  (selectedSite.additional_images &&
                    selectedSite.additional_images.length > 0) ? (
                    <View style={{ marginBottom: 16 }}>
                      <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ height: 200, borderRadius: 12 }}
                      >
                        {[
                          getImageUrl(
                            selectedSite.image_url || selectedSite.photo_url,
                          ),
                          ...(selectedSite.additional_images?.map(
                            (img: string) => getImageUrl(img),
                          ) || []),
                        ]
                          .filter(Boolean)
                          .map((uri, idx) => (
                            <Image
                              key={idx}
                              source={{ uri }}
                              style={{
                                width: 330,
                                height: 200,
                                borderRadius: 12,
                              }}
                              resizeMode="cover"
                            />
                          ))}
                      </ScrollView>
                      <View style={styles.carouselIndicator}>
                        <Text style={styles.carouselIndicatorText}>
                          Scroll for more images →
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  <Text
                    style={{ fontSize: 16, lineHeight: 24, color: "#374151" }}
                  >
                    {selectedSite.full_description || selectedSite.description}
                  </Text>

                  {userType === "user" && (
                    <TouchableOpacity
                      style={styles.leaveReviewButton}
                      onPress={() => setShowReviewModal(true)}
                    >
                      <Ionicons name="star" size={18} color="#fff" />
                      <Text style={styles.leaveReviewButtonText}>
                        Write a Review
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.seeReviewsButton}
                    onPress={() => openReviewsList(selectedSite)}
                  >
                    <Ionicons
                      name="chatbubbles-outline"
                      size={18}
                      color="#2563eb"
                    />
                    <Text style={styles.seeReviewsButtonText}>
                      See User Reviews
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reviews List Modal */}
      <Modal visible={showReviewsListModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.reviewsListModalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Reviews</Text>
                {siteReviewSummary && (
                  <View style={styles.summaryBadge}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.summaryBadgeText}>
                      {siteReviewSummary.averageRating} (
                      {siteReviewSummary.totalReviews})
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={() => setShowReviewsListModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
              {loadingReviews ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" color="#2563eb" />
                  <Text style={styles.loadingText}>Loading reviews...</Text>
                </View>
              ) : !siteReviewSummary ||
                siteReviewSummary.reviews.length === 0 ? (
                <View style={[styles.centerContainer, { marginTop: 40 }]}>
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={48}
                    color="#94a3b8"
                  />
                  <Text style={styles.noReviewsText}>
                    No reviews yet. Be the first to share your experience!
                  </Text>
                </View>
              ) : (
                siteReviewSummary.reviews.map((rev, idx) => (
                  <View key={idx} style={styles.reviewCard}>
                    <View style={styles.reviewCardHeader}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>
                          {(rev.user?.name || "U").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {rev.user?.name || "Anonymous User"}
                        </Text>
                        <View style={styles.reviewMeta}>
                          <View style={styles.starRowSmall}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Ionicons
                                key={s}
                                name={s <= rev.rating ? "star" : "star-outline"}
                                size={12}
                                color="#f59e0b"
                              />
                            ))}
                          </View>
                          <Text style={styles.reviewDate}>
                            {new Date(rev.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{rev.thoughts}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={showReviewModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.reviewModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Your Experience</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setReviewRating(star)}
                  testID={`star-${star}`}
                >
                  <Ionicons
                    name={star <= reviewRating ? "star" : "star-outline"}
                    size={32}
                    color={star <= reviewRating ? "#FFAD00" : "#94a3b8"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Tell us what you liked about this place..."
              multiline
              numberOfLines={4}
              value={reviewThoughts}
              onChangeText={setReviewThoughts}
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleReviewSubmit}
                disabled={submittingReview}
              >
                <Text style={styles.bookButtonText}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowReviewModal(false);
                  setReviewThoughts("");
                  setReviewRating(0);
                }}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Khalti WebView Modal */}
      <Modal visible={showKhalti} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Khalti Payment</Text>
            <TouchableOpacity
              onPress={() => {
                setShowKhalti(false);
                setPaying(false);
              }}
            >
              <Ionicons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>
          {khaltiUrl && (
            <WebView
              source={{ uri: khaltiUrl }}
              onNavigationStateChange={onKhaltiStateChange}
              style={{ flex: 1 }}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* eSewa WebView Modal */}
      <Modal visible={showEsewa} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>eSewa Payment</Text>
            <TouchableOpacity
              onPress={() => {
                setShowEsewa(false);
                setPaying(false);
              }}
            >
              <Ionicons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>
          {esewaParams && (
            <WebView
              source={{
                uri: esewaParams.gateway_url,
                method: "POST",
                body: `amount=${esewaParams.amount}&tax_amount=${esewaParams.tax_amount || 0}&total_amount=${esewaParams.total_amount}&transaction_uuid=${esewaParams.transaction_uuid}&product_code=${esewaParams.product_code}&product_service_charge=${esewaParams.product_service_charge || 0}&product_delivery_charge=${esewaParams.product_delivery_charge || 0}&success_url=${encodeURIComponent(esewaParams.success_url)}&failure_url=${encodeURIComponent(esewaParams.failure_url)}&signed_field_names=${esewaParams.signed_field_names}&signature=${encodeURIComponent(esewaParams.signature)}`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }}
              onNavigationStateChange={onEsewaStateChange}
              style={{ flex: 1 }}
            />
          )}
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
                onSubmitEditing={() => {}}
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
                const placeName =
                  item.name ||
                  item.address?.city ||
                  item.address?.town ||
                  "Unknown";
                const addressParts = [];

                if (item.address) {
                  if (item.address.city) addressParts.push(item.address.city);
                  if (item.address.state) addressParts.push(item.address.state);
                }
                const addressText = addressParts.join(", ");

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
                        <Text
                          style={styles.suggestionSubtext}
                          numberOfLines={1}
                        >
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
                {selectedCoords.latitude.toFixed(4)}°N,{" "}
                {selectedCoords.longitude.toFixed(4)}°E
              </Text>
            </View>
            <TouchableOpacity
              style={styles.selectLocationButton}
              onPress={handleSelectLocation}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.selectLocationButtonText}>
                Confirm Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reviews List Modal */}
      <Modal visible={showReviewsListModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.reviewsListModalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Reviews</Text>
                {siteReviewSummary && (
                  <View style={styles.summaryBadge}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.summaryBadgeText}>
                      {siteReviewSummary.averageRating} (
                      {siteReviewSummary.totalReviews})
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={() => setShowReviewsListModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
              {loadingReviews ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" color="#2563eb" />
                  <Text style={styles.loadingText}>Loading reviews...</Text>
                </View>
              ) : !siteReviewSummary || siteReviewSummary.reviews.length === 0 ? (
                <View style={[styles.centerContainer, { marginTop: 40 }]}>
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={48}
                    color="#94a3b8"
                  />
                  <Text style={styles.noReviewsText}>
                    No reviews yet. Be the first to share your experience!
                  </Text>
                </View>
              ) : (
                siteReviewSummary.reviews.map((rev: any, idx: number) => (
                  <View key={idx} style={styles.reviewCard}>
                    <View style={styles.reviewCardHeader}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>
                          {(rev.user?.name || "U").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {rev.user?.name || "Anonymous User"}
                        </Text>
                        <View style={styles.reviewMeta}>
                          <View style={styles.starRowSmall}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Ionicons
                                key={s}
                                name={s <= rev.rating ? "star" : "star-outline"}
                                size={12}
                                color="#f59e0b"
                              />
                            ))}
                          </View>
                          <Text style={styles.reviewDate}>
                            {new Date(rev.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{rev.thoughts}</Text>
                  </View>
                ))
              )}
            </ScrollView>
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
  headerLeftWithBack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    marginLeft: -4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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
    color: "#F9FAFB",
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
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 6,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  paymentModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  siteModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  paymentDescription: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
  },
  payButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1.5,
  },
  khaltiButtonOutline: {
    borderColor: "#b0191e",
  },
  esewaButtonOutline: {
    borderColor: "#0f9d58",
  },
  disabledButton: {
    opacity: 0.6,
  },
  paymentLogo: {
    width: 24,
    height: 24,
  },
  payTextKhalti: { color: "#b0191e", fontSize: 15, fontWeight: "700" },
  payTextEsewa: { color: "#0f9d58", fontSize: 15, fontWeight: "700" },
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
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff", // White Background
    borderWidth: 1.5,
    borderColor: "#b91c1c", // Red Border
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonText: {
    fontSize: 14,
    color: "#b91c1c", // Red Text
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: "row",
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
    fontWeight: "700",
  },
  editButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    justifyContent: "center",
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
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 16,
    gap: 12,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#111827",
  },
  imagePickerButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  imagePickerTextSmall: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  textArea: {
    height: 180,
    textAlignVertical: "top",
  },
  mapInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
  },
  mapInputText: {
    fontSize: 14,
    color: "#111827",
  },
  mapInputPlaceholder: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
    minHeight: 150,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  changeImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  changeImageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  imagePickerPlaceholder: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#16A34A",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  mapModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 0,
  },
  mapSearchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#F9FAFB",
  },
  loadingSpinner: {
    paddingHorizontal: 4,
  },
  loadingText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  suggestionList: {
    backgroundColor: "#1F2937",
    maxHeight: 300,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    gap: 12,
    backgroundColor: "#1F2937",
  },
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
    color: "#F9FAFB",
    fontWeight: "500",
    marginBottom: 2,
  },
  suggestionSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  mapInstructionBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#BFDBFE",
  },
  mapInstructionText: {
    flex: 1,
    fontSize: 12,
    color: "#1E40AF",
  },
  map: {
    flex: 1,
  },
  mapModalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  coordsDisplay: {
    marginBottom: 12,
  },
  coordsLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  coordsValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginTop: 4,
  },
  selectLocationButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  selectLocationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreviewList: {
    marginTop: 10,
    flexDirection: "row",
  },
  previewImageWrapper: {
    marginRight: 10,
    position: "relative",
  },
  previewThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  removeImageIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  carouselIndicator: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  carouselIndicatorText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  leaveReviewButton: {
    backgroundColor: "#b91c1c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  leaveReviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  reviewModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 20,
  },
  reviewInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#000",
    marginBottom: 20,
  },
  submitReviewButton: {
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitReviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  seeReviewsButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  seeReviewsButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewsListModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    height: "80%",
  },
  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    gap: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d97706",
  },
  noReviewsText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 15,
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  reviewCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  reviewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  starRowSmall: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  reviewText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});

export default HeritageSiteScreen;
