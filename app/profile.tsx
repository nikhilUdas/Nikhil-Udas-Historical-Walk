import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
    View,
} from "react-native";
import { user as userApi } from "../api";
import { useLanguage } from "../hooks/i18n";
import { getImageUrl } from "../utils/image";

export default function ProfileScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftName, setDraftName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const submitProfileUpdate = async (
    nameValue: string,
    emailValue: string,
    imageValue: string | null,
    successMessage = "Profile updated successfully",
  ) => {
    const trimmedName = nameValue.trim();
    const trimmedEmail = emailValue.trim();

    if (!trimmedName || !trimmedEmail) {
      Alert.alert("Error", "Name and email are required");
      return false;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("email", trimmedEmail);

      if (imageValue && imageValue.startsWith("file://")) {
        const filename = imageValue.split("/").pop() || "profile.jpg";
        const ext = filename.split(".").pop()?.toLowerCase();
        const mime = ext === "png" ? "image/png" : "image/jpeg";
        formData.append("image", {
          uri: imageValue,
          name: filename,
          type: mime,
        } as any);
      }

      await userApi.updateProfile(formData);

      setName(trimmedName);
      setEmail(trimmedEmail);
      setDraftName(trimmedName);
      setDraftEmail(trimmedEmail);

      Alert.alert("Success", successMessage);
      return true;
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Something went wrong");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const storedType = await AsyncStorage.getItem("userType");
      const data = await userApi.getProfile();
      const fetchedUser = data.user;
      setUser(fetchedUser);
      setEmail(fetchedUser?.email || "");
      setName(fetchedUser?.name || "");
      setDraftEmail(fetchedUser?.email || "");
      setDraftName(fetchedUser?.name || "");
      setImageUri(fetchedUser?.profileImage || fetchedUser?.image || null);
      setRole(fetchedUser?.role === "admin" ? "Admin" : "Heritage Explorer");
      setUserType(fetchedUser?.role || storedType);
    } catch (e: any) {
      setError(e.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to upload an image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedImageUri = result.assets[0].uri;
      const previousImageUri = imageUri;
      setImageUri(selectedImageUri);

      const wasUpdated = await submitProfileUpdate(
        name,
        email,
        selectedImageUri,
        "Profile photo updated successfully",
      );

      if (wasUpdated) {
        fetchProfile();
      } else {
        setImageUri(previousImageUri);
      }
    }
  };

  const handleUpdateProfile = async () => {
    const wasUpdated = await submitProfileUpdate(
      draftName,
      draftEmail,
      imageUri,
    );

    if (wasUpdated) {
      setShowEditModal(false);
      fetchProfile();
    }
  };

  const handleOpenEditModal = () => {
    setDraftName(name);
    setDraftEmail(email);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setDraftName(name);
    setDraftEmail(email);
    setShowEditModal(false);
  };

  const handleOpenSupportEmail = async () => {
    const subject = encodeURIComponent("Historical Walk Support Request");
    const body = encodeURIComponent(
      "Hello Historical Walk team,\n\nI need help with:\n\n",
    );
    const mailtoUrl = `mailto:historical.walkofficial@gmail.com?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (!canOpen) {
        Alert.alert(
          "Email App Not Found",
          "Please email us directly at historical.walkofficial@gmail.com",
        );
        return;
      }

      await Linking.openURL(mailtoUrl);
    } catch {
      Alert.alert(
        "Unable to Open Email",
        "Please email us directly at historical.walkofficial@gmail.com",
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["jwtToken", "userType", "user"]);
            router.replace("/login");
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const accountInfo = [
    { key: "email", label: t("email"), value: email, icon: "mail-outline" },
    {
      key: "tickets",
      label: "My Tickets",
      value: "",
      icon: "ticket-outline",
      show: userType !== "admin",
    },
    {
      key: "favorites",
      label: "Favorite Sites",
      value: "",
      icon: "heart-outline",
      show: userType !== "admin",
    },
    {
      key: "reviews",
      label: "My Reviews",
      value: "",
      icon: "star-outline",
      show: userType !== "admin",
    },
  ];

  const preferences = [
    {
      key: "language",
      label: t("Language"),
      value: language === "en" ? "English" : "नेपाली",
      icon: "globe-outline",
    },
    {
      key: "payments",
      label: t("Payment History"),
      value: "",
      icon: "card-outline",
    },
    {
      key: "security",
      label: t("Security & Privacy"),
      value: "",
      icon: "shield-checkmark-outline",
      show: userType !== "admin",
    },
    {
      key: "help",
      label: t("Help & Support"),
      value: "",
      icon: "help-circle-outline",
      show: userType !== "admin",
    },
  ];

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Red Background Gradient */}
        <View style={styles.headerBackground}>
          <LinearGradient
            colors={["#b91c1c", "#7f1d1d"]} // Deep Red Gradient
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Floating Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleOpenEditModal}
          >
            <Ionicons name="create-outline" size={20} color="#1e3a8a" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.avatarWrapper}
            >
              {imageUri ? (
                <Image
                  source={{ uri: getImageUrl(imageUri) }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.cameraIconBadge}>
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{name || "User Name"}</Text>

          {/* Account Information Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>{t("accountInfo")}</Text>
            <View style={styles.infoList}>
              {accountInfo.map(
                (item) =>
                  item.show !== false && (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.infoItem}
                      onPress={() => {
                        if (item.key === "tickets") router.push("/mytickets");
                        else if (item.key === "favorites")
                          router.push("/favorites");
                        else if (item.key === "reviews") router.push("/review");
                        // No email or location click trigger
                      }}
                    >
                      <View style={styles.infoIconWrapper}>
                        <Ionicons
                          name={item.icon as any}
                          size={18}
                          color="#64748b"
                        />
                      </View>
                      <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoLabel}>{item.label}</Text>
                        {!!item.value && (
                          <Text style={styles.infoValue}>{item.value}</Text>
                        )}
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#cbd5e1"
                      />
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </View>
        </View>

        {/* Preferences / Settings Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>{t("Preferences")}</Text>
          <View style={styles.settingsCard}>
            {preferences.map(
              (item, idx) =>
                item.show !== false && (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.settingsRow,
                      idx === preferences.length - 1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                    onPress={() => {
                      if (item.key === "language")
                        setLanguage(language === "en" ? "np" : "en");
                      else if (item.key === "payments")
                        router.push("/payment-history");
                      else if (item.key === "security") setShowLegalModal(true);
                      else if (item.key === "help") handleOpenSupportEmail();
                    }}
                  >
                    <View style={styles.settingsLeft}>
                      <View style={styles.settingsIconBg}>
                        <Ionicons
                          name={item.icon as any}
                          size={18}
                          color="#334155"
                        />
                      </View>
                      <View>
                        <Text style={styles.settingsText}>{item.label}</Text>
                        {!!item.value && (
                          <Text style={styles.settingsValue}>{item.value}</Text>
                        )}
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                ),
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.settingsLeft}>
            <View
              style={[styles.settingsIconBg, { backgroundColor: "#fee2e2" }]}
            >
              <Ionicons name="log-out" size={18} color="#ef4444" />
            </View>
            <Text style={[styles.settingsText, { color: "#ef4444" }]}>
              Log Out
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#fca5a5" />
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleCloseEditModal}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                style={styles.input}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={draftEmail}
                onChangeText={setDraftEmail}
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={handleUpdateProfile}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showLegalModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security & Privacy</Text>
              <TouchableOpacity onPress={() => setShowLegalModal(false)}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.legalScroll}
              contentContainerStyle={styles.legalContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.legalIntro}>
                Historical Walk follows core privacy and app compliance
                practices so users can explore heritage content safely.
              </Text>

              <View style={styles.legalSection}>
                <Text style={styles.legalSectionTitle}>1. Privacy Policy</Text>
                <Text style={styles.legalText}>
                  We collect only the data needed to provide app features such
                  as account management, ticketing, reviews, and saved
                  preferences.
                </Text>
              </View>

              <View style={styles.legalSection}>
                <Text style={styles.legalSectionTitle}>2. Data Protection</Text>
                <Text style={styles.legalText}>
                  Personal information is processed securely. Access to user
                  data is limited to authorized app operations and support
                  purposes.
                </Text>
              </View>

              <View style={styles.legalSection}>
                <Text style={styles.legalSectionTitle}>3. User Rights</Text>
                <Text style={styles.legalText}>
                  Users can request profile updates, ask for support, and report
                  privacy concerns through the Help & Support channel.
                </Text>
              </View>

              <View style={styles.legalSection}>
                <Text style={styles.legalSectionTitle}>4. Acceptable Use</Text>
                <Text style={styles.legalText}>
                  Users must not misuse the platform, post harmful content, or
                  violate local and international digital conduct laws.
                </Text>
              </View>

              <View style={styles.legalSection}>
                <Text style={styles.legalSectionTitle}>
                  5. Contact for Legal Queries
                </Text>
                <Text style={styles.legalText}>
                  For policy clarifications, contact:
                  historical.walkofficial@gmail.com
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F2F7" }, // iOS System Gray 6
  scrollContent: { paddingBottom: 40 },
  headerBackground: { height: 160, width: "100%" },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 20, // iOS Standard
    marginTop: -60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  editProfileButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    zIndex: 10,
  },
  avatarContainer: {
    marginTop: -45,
    marginBottom: 12,
    alignItems: "center",
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatarImage: { width: 82, height: 82, borderRadius: 41 },
  avatarPlaceholder: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#b91c1c",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  cameraIconBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#b91c1c",
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24, // iOS Large Title style
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    letterSpacing: -0.5,
  },

  infoSection: { marginTop: 32, paddingHorizontal: 16 },
  infoSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3C3C4399", // iOS Secondary Label
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 16,
  },
  infoList: {
    gap: 0,
    backgroundColor: "#fff",
    borderRadius: 12, // iOS Grouped list style
    overflow: "hidden",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8", // iOS Separator
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextWrapper: { flex: 1, marginLeft: 12 },
  infoLabel: { fontSize: 16, color: "#000", fontWeight: "400" }, // iOS Standard List Text
  infoValue: { fontSize: 14, color: "#3C3C4399", marginTop: 1 },

  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  settingsLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingsIconBg: {
    backgroundColor: "#F2F2F7",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsText: { fontSize: 16, fontWeight: "400", color: "#000" },
  settingsValue: { fontSize: 14, color: "#3C3C4399", marginTop: 1 },

  logoutButton: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#b91c1c",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#b91c1c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  legalScroll: {
    maxHeight: 420,
  },
  legalContent: {
    paddingBottom: 8,
  },
  legalIntro: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  legalSection: {
    marginBottom: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  legalSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  legalText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 19,
  },
});
