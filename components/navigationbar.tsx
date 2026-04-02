import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdminDashboard from "../app/admindashboard";
import HeritageSiteScreen from "../app/heritagesite";
import HomeScreen from "../app/home";
import MapScreen from "../app/map";
import MuseumScreen from "../app/museum";
import ProfileScreen from "../app/profile";
import ReviewScreen from "../app/review";
import { useLanguage } from "../hooks/i18n";

export default function NavigationBar() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"home" | "heritagesite" | "map" | "museum" | "profile" | "dashboard" | "reviews">("home");
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const storedType = await AsyncStorage.getItem('userType');
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const role = parsedUser?.role || storedType;
      setUserType(role ? role.toLowerCase() : null);
    };
    fetchUserType();
  }, []);

  useEffect(() => {
    if (userType === 'admin') {
      setActiveTab('dashboard');
    } else if (userType) {
      setActiveTab('home');
    }
  }, [userType]);

  const tabs = useMemo(() => {
    if (userType === 'admin') {
      return [
        {
          key: "dashboard" as const,
          label: "Dashboard",
          activeIcon: "grid" as const,
          inactiveIcon: "grid-outline" as const,
          content: <AdminDashboard />,
        },
        {
          key: "heritagesite" as const,
          label: t("heritagesite"),
          activeIcon: "book" as const,
          inactiveIcon: "book-outline" as const,
          content: <HeritageSiteScreen />,
        },
        {
          key: "museum" as const,
          label: t("museum"),
          activeIcon: "business" as const,
          inactiveIcon: "business-outline" as const,
          content: <MuseumScreen />,
        },
        {
          key: "reviews" as const,
          label: "Reviews",
          activeIcon: "star" as const,
          inactiveIcon: "star-outline" as const,
          content: <ReviewScreen />,
        },
      ];
    }
    // Default: normal user
    return [
      {
        key: "home" as const,
        label: t("home"),
        activeIcon: "home" as const,
        inactiveIcon: "home-outline" as const,
        content: <HomeScreen />,
      },
      { key: "heritagesite" as const, label: t("heritagesite"), activeIcon: "book" as const, inactiveIcon: "book-outline" as const, content: <HeritageSiteScreen /> },
      { key: "map" as const, label: t("map"), activeIcon: "map" as const, inactiveIcon: "map-outline" as const, content: <MapScreen /> },
      { key: "museum" as const, label: t("museum"), activeIcon: "business" as const, inactiveIcon: "business-outline" as const, content: <MuseumScreen /> },
      { key: "profile" as const, label: t("profile"), activeIcon: "person" as const, inactiveIcon: "person-outline" as const, content: <ProfileScreen /> },
    ];
  }, [userType, t]);

  const active = tabs.find((t) => t.key === activeTab) || tabs[0];

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>{active.content}</View>

      <View style={styles.bottomNav}>
        {tabs.map((tab, idx) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.inactiveIcon}
                size={22}
                color={isActive ? "#9C1C1C" : "#9aa3b5"}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  contentArea: {
    flex: 1,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 12,
    paddingBottom: 20,
  },

  navItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#9C1C1C",
  },

  navLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  navLabelActive: {
    color: "#9C1C1C",
    fontWeight: "600",
  },

  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerSection: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "rgba(156, 28, 28, 0.08)",
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },

  welcomeSubtitle: {
    fontSize: 15,
    color: "#666",
  },

  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },

  profileHeader: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "rgba(156, 28, 28, 0.08)",
  },

  profileAvatar: {
    marginBottom: 16,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 14,
    color: "#666",
  },

  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  settingsLabel: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
  },

  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#9C1C1C",
    marginHorizontal: 24,
    marginVertical: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
