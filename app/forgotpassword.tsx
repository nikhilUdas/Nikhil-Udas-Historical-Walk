import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../api";
import { useLanguage } from "../hooks/i18n";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);



  // STEP 1: SEND OTP
  const handleSendOtp = async () => {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("enterValidEmail"));
      return;
    }
    setLoading(true);
    try {
      await auth.forgotPassword(email.trim().toLowerCase());
      setInfo(t("otpSentToEmail"));
      setStep(2);
    } catch (error: any) {
      setError(error.message || t("failedToSendOtp"));
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const handleResetPassword = async () => {
    setError("");
    setInfo("");
    const trimmedOtp = otp.trim();
    const trimmedPassword = password.trim();
    if (!trimmedOtp || !trimmedPassword) {
      setError(t("allFieldsRequired"));
      return;
    }
    if (trimmedPassword.length < 8) {
      setError(t("passwordMinLength"));
      return;
    }
    setLoading(true);
    try {
      await auth.resetPassword({
        email: email.trim().toLowerCase(),
        otp_code: trimmedOtp,
        new_password: trimmedPassword,
      });
      router.replace("/login");
    } catch (error: any) {
      setError(error.message || t("failedToResetPassword"));
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
          <Ionicons name="chevron-back" size={22} color="#3d475f" />
        </TouchableOpacity>
        <View style={styles.content}>
          <Image source={require("../assets/images/forgot-password.png")} style={styles.hero} resizeMode="contain" />
          <View style={styles.headerBlock}>
            <Text style={styles.title}>{t("forgotPassword")}</Text>
            <Text style={styles.subtitle}>{t("enterEmailToReceiveCode")}</Text>
          </View>
          {step === 2 && (
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>Step 2 of 2 · Verify OTP</Text>
            </View>
          )}
          {info !== "" && <Text style={styles.info}>{info}</Text>}
          {error !== "" && <Text style={styles.error}>{error}</Text>}
          {step === 1 && (
            <View style={styles.formBlock}>
              <Text style={styles.label}>{t("email")}</Text>
              <View style={styles.inputShell}>
                <Ionicons name="mail-outline" size={18} color="#7d8697" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#9aa3b5"
                />
              </View>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t("sendOtp")}</Text>}
              </TouchableOpacity>
            </View>
          )}
          {step === 2 && (
            <View style={styles.formBlock}>
              <Text style={styles.label}>{t("email")}</Text>
              <View style={[styles.inputShell, styles.disabledShell]}>
                <Ionicons name="mail-outline" size={18} color="#7d8697" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  editable={false}
                />
              </View>
              <Text style={styles.label}>OTP Code</Text>
              <TextInput
                style={styles.inputSolo}
                placeholder="Enter 6-digit OTP"
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                placeholderTextColor="#9aa3b5"
              />
              <Text style={styles.label}>{t("password")}</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t("password")}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#9aa3b5"
                />
                <TouchableOpacity style={styles.eyeToggle} onPress={() => setShowPassword((prev) => !prev)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="#3d475f" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t("resetPassword")}</Text>}
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.termsText}>
            {t("terms")} <Text style={styles.linkText}>{t("termsOfService")}</Text> {t("and") || "and"} <Text style={styles.linkText}>{t("privacyPolicy")}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e9eef5",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 480,
    alignItems: "stretch",
    paddingTop: 24,
  },
  backButton: {
    position: "absolute",
    top: 27,
    left: 16,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 20,
    color: "#3d475f",
    marginTop: -1,
  },
  hero: {
    width: "100%",
    height: 350,
    marginBottom: 10,
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#202a44",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#5a6275",
    lineHeight: 20,
    textAlign: "center",
  },
  stepPill: {
    alignSelf: "center",
    backgroundColor: "#f1f4f9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  stepPillText: {
    fontSize: 12,
    color: "#3d475f",
    fontWeight: "600",
  },
  info: {
    color: "#1f7a4c",
    backgroundColor: "#e6f4ed",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  error: {
    color: "#b3261e",
    backgroundColor: "#fdeceb",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  formBlock: {
    marginTop: 8,
    width: "100%",
  },
  label: {
    fontSize: 13,
    color: "#3d475f",
    marginBottom: 6,
    fontWeight: "600",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d9deea",
    borderRadius: 12,
    backgroundColor: "#f7f9fd",
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 14,
    width: "100%",
  },
  disabledShell: {
    backgroundColor: "#eef2f7",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1f2a44",
  },
  disabledInput: {
    color: "#7d8697",
  },
  inputSolo: {
    borderWidth: 1,
    borderColor: "#d9deea",
    borderRadius: 12,
    backgroundColor: "#f7f9fd",
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: "#1f2a44",
    marginBottom: 14,
    width: "100%",
  },
  passwordRow: {
    position: "relative",
    marginBottom: 14,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#d9deea",
    borderRadius: 12,
    backgroundColor: "#f7f9fd",
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: "#1f2a44",
    width: "100%",
    paddingRight: 46,
  },
  eyeToggle: {
    position: "absolute",
    right: 12,
    top: 10,
    padding: 6,
  },
  eyeIcon: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#737f95",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#111",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  changeEmail: {
    color: "#b0191e",
    textAlign: "center",
    marginTop: 14,
    fontWeight: "600",
    fontSize: 13,
  },
  footerLinks: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#5a6275",
    fontSize: 13,
  },
  linkText: {
    color: "#b0191e",
    fontWeight: "700",
    fontSize: 13,
  },
  termsText: {
    marginTop: 12,
    textAlign: "center",
    color: "#7d8697",
    fontSize: 12,
    lineHeight: 17,
  },
});
