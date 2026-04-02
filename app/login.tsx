import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../api";
import { useLanguage } from "../hooks/i18n";

export default function LoginScreen() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Clear previous error
    setErrorMessage("");

    // Validate inputs
    if (!email.trim() && !password.trim()) {
      setErrorMessage("Please enter your email and password");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email or phone");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // API call to login
      console.log('Attempting login with email:', email);

      const data = await auth.login({
        email: email.trim().toLowerCase(),
        password: password,
      });

      console.log('Login successful');

      // Check if user is verified
      const isVerified = (
        data.user?.isVerified === true ||
        data.user?.isVerified === "true" ||
        data.user?.isVerified === 1 ||
        data.user?.isVerified === "1"
      );

      if (!isVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "Verify Now",
              onPress: () =>
                router.push({
                  pathname: "/otp",
                  params: { email: email.trim().toLowerCase() },
                }),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        setLoading(false);
        return;
      }

      // Store JWT token, user type, and full user object in AsyncStorage
      if (data.token) {
        await AsyncStorage.setItem('jwtToken', data.token);
      }
      if (data.user?.type) {
        await AsyncStorage.setItem('userType', data.user.type);
      }
      if (data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      }

      setLoading(false);

      // Navigate to navigationbar for all users (admin/normal)
      const userType = data.user?.type || 'user';
      console.log(`Login verified. User type: ${userType}. Navigating to /navigationbar`);

      requestAnimationFrame(() => {
        try {
          router.push('/navigationbar');
        } catch (e) {
          console.warn("router.push failed, falling back to replace", e);
          router.replace('/navigationbar');
        }
      });
      return;

    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || "Invalid email or password");
      setLoading(false);
      return;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with Background Image */}
      <ImageBackground
        source={require("../assets/images/background.jpg")}
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.namasteText}>{t("namaste")}</Text>
          <Text style={styles.welcomeText}>{t("welcome")}</Text>
        </View>
      </ImageBackground>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Journey Text */}
        <View style={styles.journeyContainer}>
          <Text style={styles.journeyText}>
            {t("journey")}{"\n"}
            <Text style={styles.himalayasText}>{t("himalayas")}</Text>
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("email")}</Text>
          <TextInput
            style={styles.input}
            placeholder="yourname@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMessage("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="emailInput"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("password")}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage("");
              }}
              secureTextEntry={!showPassword}
              testID="passwordInput"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => router.push("/forgotpassword")}
        >
          <Text style={styles.forgotText}>{t("forgotPassword")}</Text>
        </TouchableOpacity>

        {/* Error Message */}
        {errorMessage !== "" && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#9C1C1C" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          testID="loginButton"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>{t("login")}</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>{t("dontHaveAccount")}</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}>{t("signup")}</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          {t("terms")} {" "}
          <Text style={styles.termsLink}>{t("termsOfService")}</Text> {t("and") || "and"} {" "}
          <Text style={styles.termsLink}>{t("privacyPolicy")}</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  contentContainer: {
    flexGrow: 1,
  },

  headerImage: {
    height: 320,
    width: "100%",
  },

  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 50, 70, 0.4)",
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingBottom: 20,
  },

  namasteText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },

  welcomeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 1.5,
  },

  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  journeyContainer: {
    marginBottom: 28,
  },

  journeyText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },

  himalayasText: {
    color: "#9C1C1C",
    fontWeight: "600",
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
  },

  eyeIcon: {
    paddingHorizontal: 16,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },

  forgotText: {
    color: "#9C1C1C",
    fontSize: 14,
    fontWeight: "500",
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },

  errorText: {
    color: "#9C1C1C",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },

  loginButton: {
    backgroundColor: "#9C1C1C",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  dividerText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginVertical: 20,
    letterSpacing: 1,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },

  socialButtonText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },

  signupText: {
    fontSize: 14,
    color: "#666",
  },

  signupLink: {
    fontSize: 14,
    color: "#9C1C1C",
    fontWeight: "600",
  },

  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
    paddingBottom: 24,
  },

  termsLink: {
    color: "#9C1C1C",
    fontWeight: "500",
  },
});
