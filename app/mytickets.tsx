import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { tickets as ticketsApi } from "../api";

type Ticket = {
    ticket_id: number;
    status: string;
    purchase_date: string;
    visit_date: string;
    price: number;
    quantity: number;
    qr_code: string;
    museum?: {
        name: string;
        location?: string;
    };
};

export default function MyTicketsScreen() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await ticketsApi.getAll();
            setTickets(data.tickets || []);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load tickets");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTickets();
    };

    const renderTicketItem = ({ item }: { item: Ticket }) => {
        const isCheckedIn = item.status === 'checked_in';
        const statusColor = isCheckedIn ? "#10b981" : "#3b82f6";
        const statusLabel = isCheckedIn ? "Checked In" : "Available";

        return (
            <View style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                    </View>
                    <Text style={styles.ticketId}>#{item.ticket_id}</Text>
                </View>

                <View style={styles.ticketMain}>
                    <Text style={styles.museumName}>{item.museum?.name || "Museum"}</Text>
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar-outline" size={14} color="#64748b" />
                            <Text style={styles.detailText}>
                                {new Date(item.visit_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="people-outline" size={14} color="#64748b" />
                            <Text style={styles.detailText}>{item.quantity} {item.quantity > 1 ? 'People' : 'Person'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.ticketFooter}>
                    <View>
                        <Text style={styles.footerLabel}>Total Amount</Text>
                        <Text style={styles.priceText}>Rs. {item.price}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.viewQrButton, isCheckedIn && styles.viewQrButtonDisabled]}
                        disabled={isCheckedIn}
                        onPress={() => {
                            router.push({
                                pathname: "/ticket-success",
                                params: {
                                    museumName: item.museum?.name || "Museum",
                                    visitDate: item.visit_date,
                                    quantity: String(item.quantity),
                                    totalAmount: String(item.price),
                                    ticketId: String(item.ticket_id),
                                    qrCode: item.qr_code
                                }
                            });
                        }}
                    >
                        <Ionicons name="qr-code-outline" size={18} color={isCheckedIn ? "#94a3b8" : "#fff"} />
                        <Text style={[styles.viewQrText, isCheckedIn && styles.viewQrTextDisabled]}>
                            {isCheckedIn ? "Scanned" : "View QR"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#b91c1c" />
                    <Text style={styles.loadingText}>Loading your tickets...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Tickets</Text>
                    <View style={{ width: 40 }} />
                </View>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchTickets}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={tickets}
                        renderItem={renderTicketItem}
                        keyExtractor={(item) => item.ticket_id.toString()}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#b91c1c"]} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="ticket-outline" size={64} color="#cbd5e1" />
                                <Text style={styles.emptyTitle}>No tickets found</Text>
                                <Text style={styles.emptySubtitle}>You haven't purchased any tickets yet.</Text>
                                <TouchableOpacity
                                    style={styles.exploreButton}
                                    onPress={() => router.push("/museum")}
                                >
                                    <Text style={styles.exploreText}>Explore Museums</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f8fafc" },
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    listContainer: { padding: 16, gap: 16 },
    ticketCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f1f5f9",
    },
    ticketHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 12, fontWeight: "600" },
    ticketId: { fontSize: 12, color: "#94a3b8", fontWeight: "500" },
    ticketMain: { marginVertical: 4 },
    museumName: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 8 },
    detailsRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
    detailItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    detailText: { fontSize: 13, color: "#64748b", fontWeight: "500" },
    ticketFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
    },
    footerLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" },
    priceText: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
    viewQrButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#b91c1c",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    viewQrButtonDisabled: { backgroundColor: "#f1f5f9" },
    viewQrText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    viewQrTextDisabled: { color: "#94a3b8" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    loadingText: { color: "#64748b", fontSize: 14 },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12 },
    errorText: { color: "#ef4444", textAlign: "center", fontSize: 14 },
    retryButton: {
        backgroundColor: "#b91c1c",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    retryText: { color: "#fff", fontWeight: "700" },
    emptyContainer: { flex: 1, alignItems: "center", paddingTop: 100, gap: 12 },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
    emptySubtitle: { fontSize: 14, color: "#64748b", textAlign: "center" },
    exploreButton: {
        marginTop: 8,
        backgroundColor: "#b91c1c",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    exploreText: { color: "#fff", fontWeight: "700" },
});
