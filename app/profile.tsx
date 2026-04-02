import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { user as userApi } from "../api";
import { useLanguage } from "../hooks/i18n";
import { getImageUrl } from "../utils/image";

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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const storedType = await AsyncStorage.getItem('userType');
      const data = await userApi.getProfile();
      const fetchedUser = data.user;
      setUser(fetchedUser);
      setEmail(fetchedUser?.email || "");
      setName(fetchedUser?.name || "");
      setImageUri(fetchedUser?.profileImage || null);
      setRole(fetchedUser?.role === 'admin' ? 'Admin' : 'Heritage Explorer');
      setUserType(fetchedUser?.role || storedType);
    } catch (e: any) {
      setError(e.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

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
    try {
      setSaving(true);
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (email) formData.append('email', email);

      if (imageUri && imageUri.startsWith('file://')) {
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const ext = filename.split('.').pop()?.toLowerCase();
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        formData.append('image', { uri: imageUri, name: filename, type: mime } as any);
      }

      await userApi.updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      setShowEditModal(false);
      fetchProfile();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const accountInfo = [
    { key: "email", label: t("email"), value: email, icon: "mail-outline" },
    { key: "tickets", label: "My Tickets", value: "", icon: "ticket-outline", show: userType !== 'admin' },
    { key: "favorites", label: "Favorite Sites", value: "", icon: "heart-outline", show: userType !== 'admin' },
    { key: "reviews", label: "My Reviews", value: "", icon: "star-outline", show: userType !== 'admin' },
  ];

  const preferences = [
    { key: "language", label: t("Language"), value: language === "en" ? "English" : "नेपाली", icon: "globe-outline" },
    { key: "payments", label: t("Payment History"), value: "", icon: "card-outline" },
    { key: "security", label: t("Security & Privacy"), value: "", icon: "shield-checkmark-outline", show: userType !== 'admin' },
    { key: "help", label: t("Help & Support"), value: "", icon: "help-circle-outline", show: userType !== 'admin' },
  ];

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Blue Background */}
        <View style={styles.headerBackground}>
          <LinearGradient
            colors={['#1e3a8a', '#1e40af']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Floating Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity 
            style={styles.editProfileButton} 
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="create-outline" size={20} color="#1e3a8a" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
              {imageUri ? (
                <Image source={{ uri: getImageUrl(imageUri) }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.cameraIconBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{name || "User Name"}</Text>

          {/* Account Information Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>{t('accountInfo')}</Text>
            <View style={styles.infoList}>
              {accountInfo.map((item) => (
                (item.show !== false) && (
                  <TouchableOpacity 
                    key={item.key} 
                    style={styles.infoItem}
                    onPress={() => {
                      if (item.key === "tickets") router.push('/mytickets');
                      else if (item.key === "favorites") router.push('/favorites');
                      else if (item.key === "reviews") router.push('/review');
                      // No email or location click trigger
                    }}
                  >
                    <View style={styles.infoIconWrapper}>
                      <Ionicons name={item.icon as any} size={18} color="#64748b" />
                    </View>
                    <View style={styles.infoTextWrapper}>
                      <Text style={styles.infoLabel}>{item.label}</Text>
                      {!!item.value && <Text style={styles.infoValue}>{item.value}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                )
              ))}
            </View>
          </View>
        </View>

        {/* Preferences / Settings Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>{t('Preferences')}</Text>
          <View style={styles.settingsCard}>
            {preferences.map((item, idx) => (
              (item.show !== false) && (
                <TouchableOpacity 
                  key={item.key} 
                  style={[styles.settingsRow, idx === preferences.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => {
                    if (item.key === "language") setLanguage(language === "en" ? "np" : "en");
                    else if (item.key === "payments") router.push('/payment-history');
                  }}
                >
                  <View style={styles.settingsLeft}>
                    <View style={styles.settingsIconBg}>
                      <Ionicons name={item.icon as any} size={18} color="#334155" />
                    </View>
                    <View>
                      <Text style={styles.settingsText}>{item.label}</Text>
                      {!!item.value && <Text style={styles.settingsValue}>{item.value}</Text>}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </TouchableOpacity>
              )
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => router.replace("/login")}
        >
          <View style={styles.settingsLeft}>
            <View style={[styles.settingsIconBg, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="log-out" size={18} color="#ef4444" />
            </View>
            <Text style={[styles.settingsText, { color: '#ef4444' }]}>Log Out</Text>
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
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Enter your name" />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your email" keyboardType="email-address" />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, saving && { opacity: 0.7 }]} 
              onPress={handleUpdateProfile}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save Changes"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingBottom: 40 },
  headerBackground: { height: 120, width: '100%' },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 24,
    marginTop: -40,
    paddingHorizontal: 16,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  editProfileButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    zIndex: 10,
  },
  avatarContainer: {
    marginTop: -40,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarImage: { width: 76, height: 76, borderRadius: 38 },
  avatarPlaceholder: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#1e3a8a', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '700' },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1e3a8a',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 22, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
  
  infoSection: { marginTop: 24, paddingHorizontal: 16 },
  infoSectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoList: { gap: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  infoIconWrapper: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  infoTextWrapper: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  infoValue: { fontSize: 14, color: '#334155', fontWeight: '500', marginTop: 1 },

  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingsIconBg: { backgroundColor: '#f1f5f9', width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingsText: { fontSize: 14, fontWeight: '600', color: '#334155' },
  settingsValue: { fontSize: 12, color: '#94a3b8', marginTop: 1 },

  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 40,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 14, color: '#1e293b' },
  saveButton: { backgroundColor: '#1e3a8a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

