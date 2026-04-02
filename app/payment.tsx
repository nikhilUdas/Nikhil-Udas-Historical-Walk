import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { WebView } from "react-native-webview";
import { initiateEsewa, initiateKhalti, verifyEsewa, verifyKhalti } from "../services/tickets";

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const baseQuantity = Number(params.quantity || 1) || 1;
  const [quantity, setQuantity] = React.useState(baseQuantity);
  const amount = React.useMemo(() => quantity * 500, [quantity]);
  const [status, setStatus] = React.useState<string | null>(null);
  const [paying, setPaying] = React.useState(false);
  const [visitDate, setVisitDate] = React.useState<string>(String(params.visit_date || ""));
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  // Khalti specific state
  const [showKhalti, setShowKhalti] = React.useState(false);
  const [showEsewa, setShowEsewa] = React.useState(false);
  const [khaltiUrl, setKhaltiUrl] = React.useState<string | null>(null);
  const [esewaParams, setEsewaParams] = React.useState<any>(null);
  const [pidx, setPidx] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Failed to fetch user from storage", e);
      }
    };
    fetchUser();
  }, []);

  const handlePay = async (method: "khalti" | "esewa") => {
    if (!params.siteId || !visitDate || !params.siteName) {
      Alert.alert("Missing info", "Target site or visit date is missing.");
      return;
    }
    if (method === "khalti") {
      handleKhaltiPay();
    } else {
      handleEsewaPay();
    }
  };

  const handleKhaltiPay = async () => {
    setPaying(true);
    setStatus("Initiating Khalti payment...");
    try {
      const res = await initiateKhalti({
        museum_id: params.siteId,
        price: 500,
        quantity: quantity,
        visit_date: visitDate,
      });

      if (res.payment_url) {
        setKhaltiUrl(res.payment_url);
        setPidx(res.pidx);
        setShowKhalti(true);
        setStatus("Waiting for Khalti payment...");
      } else {
        throw new Error("Failed to get Khalti payment URL");
      }
    } catch (err: any) {
      console.error('Khalti error:', err);
      Alert.alert("Error", "Could not initiate Khalti payment. Verify your backend is running and Khalti keys are correct.");
      setStatus("Khalti initiation failed.");
    } finally {
      setPaying(false);
    }
  };

  const handleEsewaPay = async () => {
    setPaying(true);
    setStatus("Initiating eSewa payment...");
    try {
      const res = await initiateEsewa({
        museum_id: params.siteId,
        price: 500,
        quantity: quantity,
        visit_date: visitDate,
      });

      if (res.signature) {
        setEsewaParams(res);
        setShowEsewa(true);
        setStatus("Waiting for eSewa payment...");
      } else {
        throw new Error("Failed to get eSewa payment parameters");
      }
    } catch (err: any) {
      console.error('eSewa error:', err);
      Alert.alert("Error", "Could not initiate eSewa payment. Verify your backend is running and eSewa keys are correct.");
      setStatus("eSewa initiation failed.");
    } finally {
      setPaying(false);
    }
  };

  const onKhaltiStateChange = async (webViewState: any) => {
    const { url } = webViewState;
    if (url.includes("success.historicalwalk.com/khalti")) {
      setShowKhalti(false);
      setPaying(true);
      setStatus("Verifying Khalti payment...");

      try {
        if (pidx) {
          const verifyRes = await verifyKhalti({ pidx });
          console.log('Khalti Verification successful:', verifyRes);

          const ticketId = verifyRes.ticket?.ticket_id || "N/A";

          setStatus("Khalti Payment Successful!");

          // Navigate to success screen with details
          router.replace({
            pathname: "/ticket-success",
            params: {
              museumName: params.siteName,
              visitDate: visitDate,
              quantity: String(quantity),
              totalAmount: String(amount),
              ticketId: String(ticketId),
              qrCode: verifyRes.ticket?.qr_code || "N/A",
            }
          });
        }
      } catch (err: any) {
        console.error('Khalti Verification error:', err);
        setStatus("Khalti Verification failed: " + (err.message || "Unknown error"));
        Alert.alert("Khalti Payment error", "Could not verify Khalti payment. Please contact support if amount was debited.");
      } finally {
        setPaying(false);
      }
    }
  };

  const onEsewaStateChange = async (webViewState: any) => {
    const { url } = webViewState;
    if (url.includes("success.historicalwalk.com/esewa")) {
      if (url.includes("failure.historicalwalk.com/esewa")) {
        setShowEsewa(false);
        setStatus("eSewa payment failed.");
        Alert.alert("Payment Failed", "eSewa transaction failed or was cancelled.");
        setPaying(false); // Ensure paying state is reset
        return;
      }

      // Extract 'data' parameter from URL for verification
      const urlParams = url.split("?")[1];
      const dataParam = urlParams?.split("&").find((p: string) => p.startsWith("data="))?.split("=")[1];

      if (dataParam) {
        setShowEsewa(false);
        setPaying(true);
        setStatus("Verifying eSewa payment...");
        try {
          const verifyRes = await verifyEsewa({ encodedData: decodeURIComponent(dataParam) });
          console.log('eSewa Verification successful:', verifyRes);
          const ticketId = verifyRes.ticket?.ticket_id || "N/A";
          setStatus("eSewa Payment Successful!");
          router.replace({
            pathname: "/ticket-success",
            params: {
              museumName: params.siteName,
              visitDate: visitDate,
              quantity: String(quantity),
              totalAmount: String(amount),
              ticketId: String(ticketId),
              qrCode: verifyRes.ticket?.qr_code || "N/A",
            }
          });
        } catch (err: any) {
          console.error('eSewa verify error:', err);
          setStatus("eSewa Verification failed: " + (err.message || "Unknown error"));
          Alert.alert("eSewa Payment error", "Could not verify eSewa payment. Please contact support if amount was debited.");
        } finally {
          setPaying(false);
        }
      }
    }
  };

  const adjustQuantity = (delta: number) => {
    setQuantity((prev) => {
      const next = Math.max(1, prev + delta);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backIconButton}>
            <Ionicons name="chevron-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Payment</Text>
            <Text style={styles.subtitle}>Complete your ticket purchase</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Site</Text>
            <Text style={styles.value}>{params.siteName || "Ticket"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
              <Text style={[styles.value, !visitDate && { color: '#94a3b8' }]}>
                {visitDate || "Select Date"}
              </Text>
            </TouchableOpacity>
          </View>

          {showCalendar && (
            <View style={styles.calendarInline}>
              <Calendar
                onDayPress={(day: any) => {
                  setVisitDate(day.dateString);
                  setShowCalendar(false);
                }}
                markedDates={{
                  [visitDate]: { selected: true, selectedColor: '#b0191e' }
                }}
                theme={{
                  todayTextColor: '#b0191e',
                  arrowColor: '#b0191e',
                  selectedDayBackgroundColor: '#b0191e',
                }}
              />
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => adjustQuantity(-1)}>
                <Ionicons name="remove" size={16} color="#0f172a" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={() => adjustQuantity(1)}>
                <Ionicons name="add" size={16} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.total}>Rs. {amount}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.payButton, styles.khaltiButtonOutline, paying && styles.disabledButton]}
            onPress={() => handlePay("khalti")}
            disabled={paying}
          >
            <Image
              source={require("../assets/images/khalti-logo.png")}
              style={styles.paymentLogo}
              resizeMode="contain"
            />
            <Text style={styles.payTextKhalti}>{paying ? "Processing..." : `Pay with Khalti (Rs. ${amount})`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payButton, styles.esewaButtonOutline, paying && styles.disabledButton]}
            onPress={() => handlePay("esewa")}
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

        {status && <Text style={styles.status}>{status}</Text>}

        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Khalti WebView Modal */}
      <Modal visible={showKhalti} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Khalti Payment</Text>
            <TouchableOpacity onPress={() => setShowKhalti(false)}>
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
      <Modal visible={showEsewa} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>eSewa Payment</Text>
            <TouchableOpacity onPress={() => setShowEsewa(false)}>
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
  container: { padding: 16, paddingTop: 40, gap: 14 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  subtitle: { fontSize: 13, color: "#475569" },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#64748b", fontSize: 13 },
  value: { color: "#0f172a", fontSize: 14, fontWeight: "600" },
  total: { color: "#b0191e", fontSize: 15, fontWeight: "700" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  qtyValue: { minWidth: 26, textAlign: "center", fontSize: 14, fontWeight: "700", color: "#0f172a" },
  buttonContainer: {
    gap: 12,
    marginTop: 10,
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
  paymentLogo: {
    width: 24,
    height: 24,
  },
  payTextKhalti: { color: "#b0191e", fontSize: 15, fontWeight: "700" },
  payTextEsewa: { color: "#0f9d58", fontSize: 15, fontWeight: "700" },
  status: {
    textAlign: 'center',
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  back: { alignItems: "center", paddingVertical: 10 },
  backText: { color: "#6b7280", fontSize: 13, fontWeight: "600" },
  calendarInline: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
});
