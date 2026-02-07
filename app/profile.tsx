import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { user as userApi } from "../api";
import { useLanguage } from "../hooks/i18n";

const stats = [
  { key: "bookings", label: "Bookings", value: 12, icon: "ticket-outline", color: "#fee2e2" },
  { key: "reviews", label: "Reviews", value: 8, icon: "star-outline", color: "#e0f2fe" },
  { key: "visited", label: "Visited", value: 24, icon: "location-outline", color: "#f3e8ff" },
];


export default function ProfileScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const storedType = await AsyncStorage.getItem('userType');

        // Use centralized API
        const data = await userApi.getProfile();

        const fetchedUser = data.user;
        setError(null);
        setUser(fetchedUser);
        setEmail(fetchedUser?.email || "");
        setName(fetchedUser?.name || "");
        // Use profileImage from backend, falling back to legacy image or null
        setImageUri(fetchedUser?.profileImage || fetchedUser?.image || null);
        const roleLabel = fetchedUser?.role === 'admin' ? 'Admin' : 'Heritage Explorer';
        setRole(roleLabel);
        setUserType(fetchedUser?.role || storedType);
        await AsyncStorage.setItem('user', JSON.stringify(fetchedUser));
      } catch (e: any) {
        setError(e.message || 'Unable to load profile');
      }
      finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow photo library access to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name && !email && !imageUri) {
      Alert.alert('Nothing to update', 'Update name, email, or select an image to proceed.');
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      if (name) formData.append('name', name);
      if (email) formData.append('email', email);

      // Strict check: Only upload if it's a new local file selection
      if (imageUri && imageUri.startsWith('file://')) {
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const ext = filename.split('.').pop()?.toLowerCase();
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
        formData.append('image', { uri: imageUri, name: filename, type: mime } as any);
      }

      const data = await userApi.updateProfile(formData);

      const updated = data.user;
      setUser(updated);
      setEmail(updated?.email || "");
      setName(updated?.name || "");
      // Use the returned profile image
      setImageUri(updated?.profileImage || updated?.image || null);
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      Alert.alert('Success', 'Profile updated successfully');
      setShowEditModal(false);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const accountInfo = [
    { key: "email", label: t("email"), value: email, icon: "mail-outline", color: "#e0f2fe" },
    { key: "profile", label: t("Edit Profile"), value: "", icon: "person-outline", color: "#f3e8ff" },
    ...(userType !== 'admin' ? [{ key: "reviews", label: "My Reviews", value: "", icon: "star-outline", color: "#fef3c7" }] : []),
  ];

  const preferences = [
    { key: "language", label: t("Language"), value: language === "en" ? "English" : "नेपाली", icon: "globe-outline", color: "#e0f2fe" },
    { key: "payments", label: t("Payment History"), value: "", icon: "card-outline", color: "#e7f5ff" },
    ...(userType !== 'admin' ? [{ key: "security", label: t("Security & Privacy"), value: "", icon: "shield-checkmark-outline", color: "#ffe4e6" }] : []),
    { key: "notifications", label: t("Notifications"), value: "", icon: "notifications-outline", color: "#fef3c7" },
    ...(userType !== 'admin' ? [{ key: "help", label: t("Help & Support"), value: "", icon: "help-circle-outline", color: "#f1f5f9" }] : []),
  ];

  const handleLogout = () => router.replace("/login");

  const handleOpenEditModal = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setShowEditModal(true);
  };

  // Get initials for avatar
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading && (
          <View style={styles.loadingBanner}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        )}
        {!!error && !loading && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.headerCard}>
          <View style={styles.avatarWrap}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={14} color="#b91c1c" />
            </View>
          </View>
          <Text style={styles.name}>{name || "Guest"}</Text>
          <Text style={styles.role}>{role || "Heritage Explorer"}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{t('accountOverview')}</Text>
          <View style={styles.statsRow}>
            {stats.map((item) => (
              <View key={item.key} style={styles.statCard}>
                <View style={[styles.statIconWrap, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={18} color="#111827" />
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{t(item.key)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{t('accountInfo')}</Text>
          <View style={styles.cardList}>
            {accountInfo.map((item, idx) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.listRow, idx === accountInfo.length - 1 && styles.noBorder]}
                onPress={() => {
                  if (item.key === "profile") handleOpenEditModal();
                  else if (item.key === "reviews") router.push('/review');
                }}
              >
                <View style={[styles.iconPill, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={16} color="#0f172a" />
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.listLabel}>{item.label}</Text>
                  {!!item.value && <Text style={styles.listValue}>{item.value}</Text>}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{t("Preferences")}</Text>
          <View style={styles.cardList}>
            {preferences.map((item, idx) => {
              if (item.key === "language") {
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.listRow, idx === preferences.length - 1 && styles.noBorder]}
                    onPress={() => setLanguage(language === "en" ? "np" : "en")}
                  >
                    <View style={[styles.iconPill, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon as any} size={16} color="#0f172a" />
                    </View>
                    <View style={styles.listContent}>
                      <Text style={styles.listLabel}>{item.label}</Text>
                      {!!item.value && <Text style={styles.listValue}>{item.value}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity key={item.key} style={[styles.listRow, idx === preferences.length - 1 && styles.noBorder]}>
                  <View style={[styles.iconPill, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={16} color="#0f172a" />
                  </View>
                  <View style={styles.listContent}>
                    <Text style={styles.listLabel}>{item.label}</Text>
                    {!!item.value && <Text style={styles.listValue}>{item.value}</Text>}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#b91c1c" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Ionicons name="close" size={22} color="#111827" />
                </TouchableOpacity>
              </View>

              <View style={styles.cardListForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Profile Image</Text>
                  <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
                    {imageUri ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        <View style={styles.changeImageOverlay}>
                          <Ionicons name="camera" size={20} color="#fff" />
                          <Text style={styles.changeImageText}>Change</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.imagePickerPlaceholder}>
                        <Ionicons name="image" size={24} color="#9CA3AF" />
                        <Text style={styles.imagePickerText}>Upload image (max 5MB)</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowEditModal(false)}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleUpdateProfile}
                    disabled={saving}
                  >
                    <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 16, gap: 16, paddingBottom: 36, paddingTop: 36 },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 18,
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#b91c1c",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  role: { fontSize: 12, color: "#6b7280" },
  sectionBlock: { gap: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  cardList: {
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 10,
  },
  noBorder: { borderBottomWidth: 0 },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: { flex: 1 },
  listLabel: { fontSize: 13, fontWeight: "700", color: "#0f172a" },
  listValue: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  loadingBanner: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
  },
  loadingText: { color: '#1d4ed8', fontSize: 13, fontWeight: '600' },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
  },
  errorText: { color: '#b91c1c', fontSize: 13, fontWeight: '600' },
  cardListForm: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    minHeight: 120,
    overflow: 'hidden',
  },
  imagePickerPlaceholder: {
    flex: 1,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imagePickerText: { color: '#6b7280', fontSize: 12 },
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  changeImageText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  saveButton: {
    backgroundColor: '#b91c1c',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: { color: '#111827', fontWeight: '700', fontSize: 14 },
  logoutButton: {
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  logoutText: { color: "#b91c1c", fontSize: 14, fontWeight: "700" },
});
