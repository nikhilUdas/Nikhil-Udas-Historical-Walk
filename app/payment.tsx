import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { bookTicket } from "../services/tickets";

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const baseQuantity = Number(params.quantity || 1) || 1;
  const [quantity, setQuantity] = React.useState(baseQuantity);
  const amount = React.useMemo(() => quantity * 500, [quantity]);
  const [method, setMethod] = React.useState<"esewa" | "khalti" | null>("esewa");
  const [status, setStatus] = React.useState<string | null>(null);
  const [paying, setPaying] = React.useState(false);

  const handlePay = async () => {
    if (!method) {
      setStatus("Choose a payment method");
      return;
    }
    if (!params.siteId || !params.visit_date || !params.siteName) {
      Alert.alert("Missing info", "Site or date is missing. Go back and re-open booking.");
      return;
    }
    setPaying(true);
    setStatus(null);
    try {
      await bookTicket({
        site_id: Number(params.siteId),
        name: (params.name as string) || "Guest",
        email: (params.email as string) || "guest@example.com",
        visit_date: String(params.visit_date),
        quantity,
      });
      setStatus(`${method.toUpperCase()} payment + booking successful (mock)`);
      setTimeout(() => {
        router.back();
      }, 900);
    } catch (err: any) {
      setStatus(err?.message || "Payment failed");
      Alert.alert("Payment failed", err?.message || "Network request failed. Check API base URL.");
    } finally {
      setPaying(false);
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
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Complete your ticket purchase</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Site</Text>
            <Text style={styles.value}>{params.siteName || "Ticket"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{params.visit_date || "TBD"}</Text>
          </View>
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

        <Text style={styles.sectionLabel}>Choose payment method</Text>
        <View style={styles.methodsRow}>
          <TouchableOpacity
            style={[styles.methodCard, method === "esewa" && styles.methodCardActive]}
            onPress={() => setMethod("esewa")}
            activeOpacity={0.9}
          >
            <Ionicons name="wallet" size={18} color={method === "esewa" ? "#0f9d58" : "#0f172a"} />
            <Text style={[styles.methodText, method === "esewa" && styles.methodTextActive]}>eSewa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodCard, method === "khalti" && styles.methodCardActive]}
            onPress={() => setMethod("khalti")}
            activeOpacity={0.9}
          >
            <Ionicons name="card" size={18} color={method === "khalti" ? "#5b21b6" : "#0f172a"} />
            <Text style={[styles.methodText, method === "khalti" && styles.methodTextActive]}>Khalti</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Heads up</Text>
          <Text style={styles.noteText}>This is a mock flow. In production, redirect to {method || "your"} gateway app/web.</Text>
        </View>

        {status && <Text style={styles.status}>{status}</Text>}

        <TouchableOpacity style={styles.payButton} activeOpacity={0.9} onPress={handlePay} disabled={paying}>
          <Ionicons name="card" size={18} color="#fff" />
          <Text style={styles.payText}>{paying ? "Processing..." : `Pay Rs. ${amount}`}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f6fa" },
  container: { padding: 16, gap: 14 },
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
  sectionLabel: { marginTop: 4, fontSize: 13, color: "#0f172a", fontWeight: "700" },
  methodsRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  methodCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  methodCardActive: {
    borderColor: "#b0191e",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  methodText: { color: "#0f172a", fontSize: 14, fontWeight: "600" },
  methodTextActive: { color: "#b0191e" },
  noteBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
  },
  noteTitle: { fontSize: 12, fontWeight: "700", color: "#0f172a" },
  noteText: { fontSize: 12, color: "#475569" },
  status: { fontSize: 12, color: "#0f172a" },
  payButton: {
    marginTop: 6,
    backgroundColor: "#b0191e",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  payText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  back: { alignItems: "center", paddingVertical: 10 },
  backText: { color: "#6b7280", fontSize: 13, fontWeight: "600" },
});
