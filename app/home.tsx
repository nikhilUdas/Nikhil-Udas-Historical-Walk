import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { HeritageSite, Museum, museums as museumsApi, notifications, sites } from "../api";
import { useLanguage } from "../hooks/i18n";
import { getImageUrl } from "../utils/image";


export default function HomeScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const [heritageSites, setHeritageSites] = useState<HeritageSite[]>([]);
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Traveler");
  const [unreadCount, setUnreadCount] = useState(0);
  const prevUnreadCount = React.useRef(0);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const bannerAnim = useRef(new Animated.Value(-100)).current;

  // ... (keep useEffects and data loading logic same)

  useEffect(() => {
    loadUserData();
    fetchData();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserName(user.name || user.username || "Traveler");
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Heritage Sites
      const heritageData = await sites.getAll();
      setHeritageSites((heritageData.sites || []).slice(0, 4));

      // Fetch Museums
      const museumsData = await museumsApi.getAll();
      setMuseums((museumsData.museums || museumsData.sites || []).slice(0, 4));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notifications.getUnreadCount();
      const newCount = data.unreadCount || 0;

      // Play sound if new notifications arrived
      if (newCount > prevUnreadCount.current && prevUnreadCount.current > 0) {
        playNotificationSound();
      }

      prevUnreadCount.current = newCount;
      setUnreadCount(newCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const playNotificationSound = async () => {
    try {
      // Vibrate device
      Vibration.vibrate([0, 200, 100, 200]);

      // Show custom banner
      setShowNotificationBanner(true);

      // Animate banner sliding down
      Animated.sequence([
        Animated.timing(bannerAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(bannerAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowNotificationBanner(false));
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const navigateToHeritageSites = () => {
    router.push('/heritagesite');
  };

  const navigateToMuseums = () => {
    router.push('/museum');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Notification Banner */}
      {showNotificationBanner && (
        <Animated.View
          style={[
            styles.notificationBanner,
            { transform: [{ translateY: bannerAnim }] }
          ]}
        >
          <TouchableOpacity
            style={styles.bannerContent}
            onPress={() => router.push('/notification')}
            activeOpacity={0.9}
          >
            <View style={styles.bannerIconContainer}>
              <Ionicons name="notifications" size={24} color="#fff" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>🔔 {t('notifications')}</Text>
              <Text style={styles.bannerMessage}>
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Premium Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>🙏 {t('greeting')}</Text>
            <View style={styles.userNameRow}>
              <Text style={styles.welcomeText}>{t('welcomeBack')}</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notification')}>
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{t('discoverTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('discoverSubtitle')}</Text>
          <Text style={styles.heroDescription}>
            {t('discoverDesc')}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#b0191e" />
          </View>
        ) : (
          <>
            {/* Heritage Sites Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{t('heritageSites')}</Text>
                  <Text style={styles.sectionSubtitle}>{t('heritageSubtitle')}</Text>
                </View>
                <TouchableOpacity onPress={navigateToHeritageSites} style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#b0191e" />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsContainer}
              >
                {heritageSites?.map((site, index) => site && (
                  <TouchableOpacity
                    key={site.site_id ? `heritage-${site.site_id}` : `heritage-idx-${index}`}
                    style={styles.premiumCard}
                    activeOpacity={0.9}
                    onPress={navigateToHeritageSites}
                  >
                    {site.image_url || site.photo_url ? (
                      <Image
                        source={{ uri: getImageUrl(site.image_url || site.photo_url) }}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.cardImage, styles.placeholderImage]}>
                        <Ionicons name="image-outline" size={40} color="#9ca3af" />
                      </View>
                    )}
                    <View style={styles.cardGradient} />
                    <View style={styles.cardContent}>
                      <View style={styles.cardBadge}>
                        <Ionicons name="location" size={12} color="#fff" />
                        <Text style={styles.cardBadgeText}>{t('heritageBadge')}</Text>
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={2}>{site.name}</Text>
                      <View style={styles.cardLocation}>
                        <Ionicons name="location-outline" size={14} color="#e5e7eb" />
                        <Text style={styles.cardLocationText} numberOfLines={1}>{site.location}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Museums Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{t('museums')}</Text>
                  <Text style={styles.sectionSubtitle}>{t('museumsSubtitle')}</Text>
                </View>
                <TouchableOpacity onPress={navigateToMuseums} style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#b0191e" />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsContainer}
              >
                {museums?.map((museum, index) => museum && (
                  <TouchableOpacity
                    key={museum.site_id ? `museum-${museum.site_id}` : `museum-idx-${index}`}
                    style={styles.premiumCard}
                    activeOpacity={0.9}
                    onPress={navigateToMuseums}
                  >
                    {museum.image_url || museum.photo_url ? (
                      <Image
                        source={{ uri: getImageUrl(museum.image_url || museum.photo_url) }}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.cardImage, styles.placeholderImage]}>
                        <Ionicons name="image-outline" size={40} color="#9ca3af" />
                      </View>
                    )}
                    <View style={styles.cardGradient} />
                    <View style={styles.cardContent}>
                      <View style={[styles.cardBadge, styles.museumBadge]}>
                        <Ionicons name="business" size={12} color="#fff" />
                        <Text style={styles.cardBadgeText}>{t('museumBadge')}</Text>
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={2}>{museum.name}</Text>
                      <View style={styles.cardLocation}>
                        <Ionicons name="location-outline" size={14} color="#e5e7eb" />
                        <Text style={styles.cardLocationText} numberOfLines={1}>{museum.location}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    paddingTop: 40,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    gap: 4,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 4,
  },
  greeting: {
    fontSize: 18,
    color: "#b0191e",
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  welcomeText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  // Custom notification banner styles
  notificationBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerMessage: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.95,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#f9fafb",
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#b0191e",
    lineHeight: 38,
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginTop: 8,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff1f2",
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#b0191e",
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  premiumCard: {
    width: 280,
    height: 360,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  placeholderImage: {
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
    // For React Native, we use multiple overlays to simulate gradient
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 80,
    backgroundColor: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
  },
  cardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#b0191e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  museumBadge: {
    backgroundColor: "#2563eb",
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 26,
  },
  cardLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardLocationText: {
    fontSize: 13,
    color: "#e5e7eb",
    fontWeight: "500",
  },
});
