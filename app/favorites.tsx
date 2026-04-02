import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { favorites as favoritesApi } from "../api";
import { getImageUrl } from "../utils/image";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavorites = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await favoritesApi.getAll();
      if (data && data.favorites && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      } else {
        setFavorites([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (siteId: number) => {
    if (!siteId) return;
    try {
      await favoritesApi.toggle(siteId);
      // Refresh list after toggling
      fetchFavorites();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update favorite");
    }
  };

  const navigateToSite = (site: any) => {
    if (!site) return;
    router.push("/heritagesite");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite Sites</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1e3a8a" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchFavorites}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !favorites || favorites.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="heart-dislike-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              You haven't added any favorites yet.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push("/heritagesite")}
            >
              <Text style={styles.exploreButtonText}>
                Explore Heritage Sites
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          favorites.map((site, idx) => {
            if (!site) return null;
            const siteId = site.site_id || site.id;
            const imageUrl = site.image_url || site.photo_url || site.photoUrl;

            return (
              <TouchableOpacity
                key={`${siteId || idx}`}
                style={styles.card}
                onPress={() => navigateToSite(site)}
              >
                <Image
                  source={{ uri: getImageUrl(imageUrl) }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {site.name || "Unknown Site"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleToggleFavorite(siteId)}
                      style={styles.favoriteButton}
                    >
                      <Ionicons name="heart" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardLocation} numberOfLines={1}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#64748b"
                    />{" "}
                    {site.location || "Nepal"}
                  </Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {site.description || "No description available."}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#1e3a8a",
    borderRadius: 12,
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
});
