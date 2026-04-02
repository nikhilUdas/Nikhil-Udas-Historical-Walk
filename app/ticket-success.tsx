import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from 'expo-sharing';
import React, { useRef } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";

export default function TicketSuccessScreen() {
    const params = useLocalSearchParams();
    const viewShotRef = useRef<any>(null);

    const museumName = params.museumName || "Museum Visit";
    const visitDate = params.visitDate || "Not Specified";
    const quantity = params.quantity || "1";
    const totalAmount = params.totalAmount || "0";
    const ticketId = params.ticketId || "N/A";
    const qrCodeValue = (params.qrCode as string) || "N/A";

    const handleDownload = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert("Error", "Sharing is not available on this device");
                return;
            }
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Failed to capture ticket:", error);
            Alert.alert("Error", "Failed to generate ticket image.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.successHeader}>
                    <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={40} color="#fff" />
                    </View>
                    <Text style={styles.successTitle}>Payment Successful!</Text>
                    <Text style={styles.successSubtitle}>Your booking has been confirmed.</Text>
                </View>

                <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
                    <View style={styles.ticketCard}>
                        <View style={styles.ticketHeader}>
                            <Ionicons name="business-outline" size={24} color="#b0191e" />
                            <Text style={styles.ticketHeaderText}>OFFICIAL TICKET</Text>
                        </View>

                        <View style={styles.dottedLine} />

                        <View style={styles.ticketBody}>
                            <Text style={styles.museumTitle}>{museumName}</Text>

                            <View style={styles.infoRow}>
                                <View style={styles.infoCol}>
                                    <Text style={styles.infoLabel}>DATE</Text>
                                    <Text style={styles.infoValue}>{visitDate}</Text>
                                </View>
                                <View style={styles.infoCol}>
                                    <Text style={styles.infoLabel}>QUANTITY</Text>
                                    <Text style={styles.infoValue}>{quantity} Person(s)</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoCol}>
                                    <Text style={styles.infoLabel}>TICKET ID</Text>
                                    <Text style={styles.infoValue}>#HW-{ticketId}</Text>
                                </View>
                                <View style={styles.infoCol}>
                                    <Text style={styles.infoLabel}>TOTAL PAID</Text>
                                    <Text style={styles.infoValue}>Rs. {totalAmount}</Text>
                                </View>
                            </View>

                            <View style={styles.qrPlaceholder}>
                                {qrCodeValue !== "N/A" ? (
                                    <View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 10 }}>
                                        <QRCode
                                            value={qrCodeValue}
                                            size={120}
                                            color="#0f172a"
                                            backgroundColor="white"
                                        />
                                    </View>
                                ) : (
                                    <Ionicons name="qr-code-outline" size={100} color="#0f172a" />
                                )}
                                <Text style={styles.qrText}>Scan at Entry</Text>
                            </View>
                        </View>

                        <View style={styles.ticketFooter}>
                            <Text style={styles.footerText}>Historical Walk - Nepal Heritage</Text>
                        </View>
                    </View>
                </ViewShot>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                        <Ionicons name="download-outline" size={20} color="#fff" />
                        <Text style={styles.downloadText}>Download Ticket (PNG)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homeButton} onPress={() => router.replace("/navigationbar")}>
                        <Text style={styles.homeText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f8fafc" },
    container: { flex: 1, padding: 20, alignItems: "center" },
    successHeader: { alignItems: "center", marginTop: 20, marginBottom: 30 },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#22c55e",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    successTitle: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
    successSubtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },

    ticketCard: {
        width: 320,
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    ticketHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        gap: 10,
        backgroundColor: "#fff5f5",
    },
    ticketHeaderText: { fontSize: 13, fontWeight: "700", color: "#b0191e", letterSpacing: 1 },
    dottedLine: {
        height: 1,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderStyle: "dashed",
        marginHorizontal: 16,
    },
    ticketBody: { padding: 20 },
    museumTitle: { fontSize: 20, fontWeight: "800", color: "#0f172a", marginBottom: 20, textAlign: "center" },
    infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    infoCol: { flex: 1 },
    infoLabel: { fontSize: 10, color: "#94a3b8", fontWeight: "700", marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
    qrPlaceholder: {
        alignItems: "center",
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
    },
    qrText: { fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: "600" },
    ticketFooter: {
        padding: 12,
        backgroundColor: "#f8fafc",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
    },
    footerText: { fontSize: 10, color: "#94a3b8", fontWeight: "600" },

    actionButtons: { width: "100%", gap: 12, marginTop: 40 },
    downloadButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#b0191e",
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    downloadText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    homeButton: {
        alignItems: "center",
        paddingVertical: 12,
    },
    homeText: { color: "#64748b", fontSize: 14, fontWeight: "600" },
});
