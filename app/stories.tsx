import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { stories as storiesApi } from "../api";

// Removed dummy categories and stories
function StoriesScreen() {
  const [payingFor, setPayingFor] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await storiesApi.getPreview();
        setStories(data.stories || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch stories");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const previewText = (text: string) => {
    if (!text) return "";
    const half = Math.max(40, Math.floor(text.length / 2));
    return text.length > half ? `${text.slice(0, half)}...` : text;
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ...existing code... */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Text style={styles.title}>Tales of Heritage</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Removed category options and dummy story cards */}

        {loading ? (
          <ActivityIndicator size="large" color="#b0191e" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
        ) : stories.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>No stories found.</Text>
        ) : (
          stories.map((story) => (
            <View key={story.story_id} style={styles.storyRow}>
              <View style={styles.thumbWrap}>
                {story.media_url ? (
                  <Image source={{ uri: story.media_url }} style={styles.thumbImage} />
                ) : (
                  <View style={styles.badgeBlock}>
                    <Text style={styles.badgeBlockText}>{story.god_or_goddess_name || 'Story'}</Text>
                  </View>
                )}
              </View>
              <View style={styles.storyContent}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={{ fontSize: 12, color: "#4b5563", lineHeight: 16 }}>{story.preview}</Text>
                {story.has_full_content && (
                  <TouchableOpacity style={{
                    marginTop: 6,
                    backgroundColor: "#c71f37",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    alignSelf: "flex-start",
                  }} activeOpacity={0.9}>
                    <Ionicons name="lock-closed" size={12} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Unlock Full Story</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f6fa" },
  container: { padding: 16, paddingBottom: 28, gap: 14, paddingTop: 36 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1f2937" },
  categoryRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 4,
    alignItems: "center",
  },
  categoryItem: { alignItems: "center" },
  categoryText: { fontSize: 14, color: "#7b808a" },
  categoryTextActive: { color: "#b0191e", fontWeight: "700" },
  categoryUnderline: {
    marginTop: 4,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#b0191e",
  },
  featuredCard: {
    height: 190,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 6,
  },
  featuredImage: { borderRadius: 14 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  featuredBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 14,
  },
  ratingText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  featuredPill: {
    backgroundColor: "#e71d36",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featuredPillText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  featuredTextBlock: { position: "absolute", left: 14, right: 14, bottom: 14, gap: 6 },
  featuredTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  featuredSubtitle: { color: "#e5e7eb", fontSize: 12, lineHeight: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1f2937" },
  sectionLink: { fontSize: 12, color: "#b0191e", fontWeight: "700" },
  highlightCard: {
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  highlightImage: { borderRadius: 12 },
  highlightBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#23b26d",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 2,
  },
  highlightBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  highlightTextBlock: { position: "absolute", left: 12, bottom: 12, right: 12, gap: 4 },
  highlightTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  highlightSubtitle: { color: "#f5f6fa", fontSize: 12, lineHeight: 16 },
  storyRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  thumbWrap: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0f1e3a",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeBlock: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#14284b",
    borderRadius: 10,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeBlockText: { color: "#fff", fontSize: 12, fontWeight: "700", textAlign: "center" },
  thumbImage: { width: 68, height: 68, resizeMode: "cover" },
  storyContent: { flex: 1, gap: 4 },
  storyTitle: { fontSize: 14, fontWeight: "700", color: "#1f2937" },
});

export default StoriesScreen;
