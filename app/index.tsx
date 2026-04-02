import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../hooks/i18n";

export default function IndexScreen() {
  const { t } = useLanguage();
  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFF0F0", "#FFE5E5"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Text Section */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t("Historical Walk")}</Text>
            <Text style={styles.subtitle}>
              "{t("preservingNepalHeritage")} {t("digitally")}"
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/login")}
            activeOpacity={0.9}
            testID="getStartedButton"
          >
            <Text style={styles.buttonText}>{t("Get Started")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 280,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#8B1818",
    marginBottom: 16,
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#5D4037",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "500",
    fontStyle: "italic",
  },
  bottomContainer: {
    paddingBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#9C1C1C",
    paddingVertical: 18,
    width: '100%',
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#9C1C1C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
