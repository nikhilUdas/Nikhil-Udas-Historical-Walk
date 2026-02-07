import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth } from "../api";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    // Clear previous errors
    setErrorMessage("");

    // Validation
    if (!name.trim()) {
      setErrorMessage("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // API call to register user
      await auth.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      router.push({
        pathname: "/otp",
        params: { email: email.trim().toLowerCase() }
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      setErrorMessage(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with Background Image */}
        <ImageBackground
          source={require("../assets/images/background.jpg")}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.joinText}>Join Us</Text>
            <Text style={styles.createText}>CREATE YOUR ACCOUNT</Text>
          </View>
        </ImageBackground>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Journey Text */}
          <View style={styles.journeyContainer}>
            <Text style={styles.journeyText}>
              Begin your journey into{"\n"}
              <Text style={styles.himalayasText}>the Himalayas</Text>
            </Text>
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrorMessage("");
              }}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
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
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
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

          {/* Error Message */}
          {errorMessage !== "" && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#9C1C1C" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account →</Text>
            )}
          </TouchableOpacity>

          {/* Log In Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By creating new sign up you agrenae to our{" "}
            <Text style={styles.termsLink}>Terms of Human Provocation</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
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

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },

  backText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },

  headerImage: {
    height: 260,
    width: "100%",
  },

  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 50, 70, 0.4)",
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingBottom: 20,
  },

  joinText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },

  createText: {
    fontSize: 12,
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

  signupButton: {
    backgroundColor: "#9C1C1C",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  signupButtonDisabled: {
    opacity: 0.7,
  },

  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  loginText: {
    fontSize: 14,
    color: "#666",
  },

  loginLink: {
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
