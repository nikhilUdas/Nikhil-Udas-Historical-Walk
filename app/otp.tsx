import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../api";

export default function OTPVerification() {
  const params = useLocalSearchParams();
  const emailParam = params.email;
  const email = typeof emailParam === "string" ? emailParam : "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!email) {
      Alert.alert(
        "Missing email",
        "No email provided for verification. Please restart the verification flow.",
        [{ text: "OK", onPress: () => router.replace("/signup") }]
      );
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      // API call to verify OTP
      const data = await auth.verifyOtp({
        email: email,
        otp_code: otpCode,
      });

      Alert.alert("Success", "Your account has been verified!");
      router.replace("/login");

    } catch (error: any) {
      Alert.alert("Error", error.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    if (!email) {
      Alert.alert("Missing email", "Cannot resend OTP without an email.");
      return;
    }
    try {
      // API call to resend OTP
      const data = await auth.resendOtp({ email: email });

      if (data.success) {
        Alert.alert("OTP Resent", "A new verification code has been sent to your email");
      } else {
        Alert.alert("Error", data.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      Alert.alert("Error", error.message || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/forotp.png")}
            style={styles.otpImage}
            resizeMode="contain"
          />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={48} color="#9C1C1C" />
          </View>
        </View>

        {/* Title and Description */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to
          </Text>
          <Text style={styles.email}>{email || "your email"}</Text>
        </View>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                digit !== "" && styles.otpBoxFilled,
              ]}
            >
              <TextInput
                ref={(ref: TextInput | null) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
              />
            </View>
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>

        {/* Helper Text */}
        <Text style={styles.helperText}>
          Please check your spam folder if you don't see the email in your inbox
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    marginBottom: 20,
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  otpImage: {
    width: 280,
    height: 200,
  },

  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    alignItems: "center",
  },

  contentContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },

  email: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9C1C1C",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  otpBox: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  otpBoxFilled: {
    borderColor: "#9C1C1C",
    backgroundColor: "#FFF7F7",
  },

  otpInput: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    width: "100%",
    height: "100%",
  },

  verifyButton: {
    backgroundColor: "#9C1C1C",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  verifyButtonDisabled: {
    opacity: 0.7,
  },

  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  resendText: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },

  resendLink: {
    fontSize: 14,
    color: "#9C1C1C",
    fontWeight: "600",
  },

  helperText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
