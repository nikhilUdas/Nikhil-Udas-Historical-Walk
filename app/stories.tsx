import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "../utils/image";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebView } from "react-native-webview";
import { payment as paymentApi, stories as storiesApi } from "../api";

// Removed dummy categories and stories
function StoriesScreen() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  // Payment State
  const [paying, setPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showKhalti, setShowKhalti] = useState(false);
  const [showEsewa, setShowEsewa] = useState(false);
  const [khaltiUrl, setKhaltiUrl] = useState<string | null>(null);
  const [esewaParams, setEsewaParams] = useState<any>(null);
  const [pidx, setPidx] = useState<string | null>(null);

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

  useEffect(() => {
    fetchStories();
  }, []);

  const previewText = (text: string) => {
    if (!text) return "";
    const half = Math.max(40, Math.floor(text.length / 2));
    return text.length > half ? `${text.slice(0, half)}...` : text;
  };

  const openStory = async (story: any) => {
    if (story.is_unlocked) {
      try {
        setLoading(true);
        const data = await storiesApi.getFullStory(story.story_id);
        setSelectedStory(data.story);
        setShowStoryModal(true);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Could not fetch full story");
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedStory(story);
      setShowPaymentModal(true);
    }
  };

  // --- Payment Handlers ---
  const handleKhaltiPay = async () => {
    if (!selectedStory) return;
    setPaying(true);
    try {
      const res = await paymentApi.initiateStoryKhalti({
        story_id: selectedStory.story_id,
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
      Alert.alert("Error", "Could not initiate Khalti payment.");
    } finally {
      setPaying(false);
    }
  };

  const handleEsewaPay = async () => {
    if (!selectedStory) return;
    setPaying(true);
    try {
      const res = await paymentApi.initiateStoryEsewa({
        story_id: selectedStory.story_id,
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
      Alert.alert("Error", "Could not initiate eSewa payment.");
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
          await paymentApi.verifyStoryKhalti({ pidx });
          await fetchStories(); // Refresh stories
          // Auto-open the full story modal
          if (selectedStory) {
            const data = await storiesApi.getFullStory(selectedStory.story_id);
            setSelectedStory(data.story);
            setShowStoryModal(true);
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
      const dataParam = urlParams?.split("&").find((p: string) => p.startsWith("data="))?.split("=")[1];

      if (dataParam) {
        setShowEsewa(false);
        setPaying(true);
        try {
          await paymentApi.verifyStoryEsewa({ encodedData: decodeURIComponent(dataParam) });
          await fetchStories();
          // Auto-open the full story modal
          if (selectedStory) {
            const data = await storiesApi.getFullStory(selectedStory.story_id);
            setSelectedStory(data.story);
            setShowStoryModal(true);
          }
        } catch (err: any) {
          Alert.alert("eSewa Payment error", "Could not verify eSewa payment.");
        } finally {
          setPaying(false);
        }
      }
    }
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
                  <Image source={{ uri: getImageUrl(story.media_url) }} style={styles.thumbImage} />
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
                  <TouchableOpacity
                    style={{
                      marginTop: 6,
                      backgroundColor: story.is_unlocked ? "#2563eb" : "#c71f37",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      alignSelf: "flex-start",
                    }}
                    activeOpacity={0.9}
                    onPress={() => openStory(story)}
                  >
                    <Ionicons
                      name={story.is_unlocked ? "book" : "lock-closed"}
                      size={12}
                      color="#fff"
                    />
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                      {story.is_unlocked ? "Read Now" : "Read More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Payment Selection Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Unlock Story</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <Text style={styles.paymentDescription}>
              Unlock the full story of "{selectedStory?.title}" for Rs. 50. Pay once and keep it forever!
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.payButton, styles.khaltiButtonOutline, paying && styles.disabledButton]}
                onPress={handleKhaltiPay}
                disabled={paying}
              >
                <Image
                  source={require("../assets/images/khalti-logo.png")}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
                <Text style={styles.payTextKhalti}>{paying ? "Processing..." : `Pay with Khalti (Rs. 50)`}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.payButton, styles.esewaButtonOutline, paying && styles.disabledButton]}
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

      {/* Read Story Modal */}
      <Modal visible={showStoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.storyModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedStory?.title}</Text>
              <TouchableOpacity onPress={() => setShowStoryModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
              {selectedStory?.media_url && (
                <Image
                  source={{ uri: getImageUrl(selectedStory.media_url) }}
                  style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 16 }}
                />
              )}
              <Text style={{ fontSize: 16, lineHeight: 24, color: "#374151" }}>
                {selectedStory?.content || selectedStory?.preview || "Content not available."}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Khalti WebView Modal */}
      <Modal visible={showKhalti} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Khalti Payment</Text>
            <TouchableOpacity onPress={() => {
              setShowKhalti(false);
              setPaying(false);
            }}>
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
            <TouchableOpacity onPress={() => {
              setShowEsewa(false);
              setPaying(false);
            }}>
              <Ionicons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>
          {esewaParams && (
            <WebView
              source={{
                uri: esewaParams.gateway_url,
                method: "POST",
                body: `amount=${esewaParams.amount}&tax_amount=${esewaParams.tax_amount || 0}&total_amount=${esewaParams.total_amount}&transaction_uuid=${esewaParams.transaction_uuid}&product_code=${esewaParams.product_code}&product_service_charge=${esewaParams.product_service_charge || 0}&product_delivery_charge=${esewaParams.product_delivery_charge || 0}&success_url=${encodeURIComponent(esewaParams.success_url)}&failure_url=${encodeURIComponent(esewaParams.failure_url)}&signed_field_names=${esewaParams.signed_field_names}&signature=${encodeURIComponent(esewaParams.signature)}`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
              }}
              onNavigationStateChange={onEsewaStateChange}
              style={{ flex: 1 }}
            />
          )}
        </SafeAreaView>
      </Modal>
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
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
  storyModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  paymentLogo: {
    width: 24,
    height: 24,
  },
  payTextKhalti: { color: "#b0191e", fontSize: 15, fontWeight: "700" },
  payTextEsewa: { color: "#0f9d58", fontSize: 15, fontWeight: "700" },
});

export default StoriesScreen;
