import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { notifications } from "../api";

type NotificationItem = {
	id: string;
	title: string;
	body: string;
	time: string;
	type?: "booking" | "reminder" | "promo" | "info";
	read?: boolean;
};

const formatRelativeTime = (dateString: string): string => {
	const now = new Date();
	const then = new Date(dateString);
	const diffMs = now.getTime() - then.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${diffDays}d ago`;
};

export default function NotificationScreen() {
	const router = useRouter();
	const [items, setItems] = useState<NotificationItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

	useEffect(() => {
		fetchNotifications();
	}, []);

	const fetchNotifications = async () => {
		try {
			setLoading(true);
			const data = await notifications.getAll();

			const mapped: NotificationItem[] = (data.notifications || []).map((n: any) => ({
				id: n.notification_id.toString(),
				title: n.title,
				body: n.message,
				time: formatRelativeTime(n.created_at),
				type: n.type as any,
				read: n.is_read,
			}));
			setItems(mapped);
			setError(null);
		} catch (err: any) {
			setError('Unable to load notifications');
		} finally {
			setLoading(false);
		}
	};

	const handleMarkRead = async (id: string) => {
		try {
			await notifications.markRead(id);
			setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
		} catch (err) {
			console.error('Failed to mark as read:', err);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			await notifications.markAllRead();
			setItems((prev) => prev.map((n) => ({ ...n, read: true })));
		} catch (err) {
			console.error('Failed to mark all as read:', err);
		}
	};

	const handleClearAll = async () => {
		Alert.alert(
			'Delete All',
			'Are you sure you want to delete all notifications?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						try {
							await notifications.deleteAll();
							setItems([]);
						} catch (err) {
							console.error('Failed to delete all:', err);
						}
					},
				},
			]
		);
	};

	const renderIcon = (type?: NotificationItem["type"], read?: boolean) => {
		const color = read ? "#9ca3af" : "#b91c1c";
		switch (type) {
			case "booking":
				return <Ionicons name="ticket-outline" size={18} color={color} />;
			case "reminder":
				return <Ionicons name="alarm-outline" size={18} color={color} />;
			case "promo":
				return <Ionicons name="pricetag-outline" size={18} color={color} />;
			case "info":
			default:
				return <Ionicons name="notifications-outline" size={18} color={color} />;
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#b91c1c" />
					<Text style={styles.loadingText}>Loading notifications...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.container}>
				{/* Back Button Row */}
				<View style={styles.backButtonRow}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => router.back()}
						activeOpacity={0.7}
					>
						<Ionicons name="chevron-back" size={28} color="#b91c1c" />
						<Text style={styles.backButtonText}>Back</Text>
					</TouchableOpacity>
				</View>

				{error && (
					<View style={styles.errorBanner}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}
				<View style={styles.headerRow}>
					<View style={styles.titleRow}>
						<Text style={styles.title}>Notifications</Text>
						{unreadCount > 0 && (
							<View style={styles.badge}>
								<Text style={styles.badgeText}>{unreadCount}</Text>
							</View>
						)}
					</View>
					<View style={styles.headerActions}>
						<TouchableOpacity onPress={handleMarkAllRead} disabled={items.length === 0}>
							<Text style={[styles.actionText, items.length === 0 && styles.actionDisabled]}>Mark all read</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleClearAll} disabled={items.length === 0}>
							<Ionicons name="trash-outline" size={18} color={items.length === 0 ? "#cbd5e1" : "#b91c1c"} />
						</TouchableOpacity>
					</View>
				</View>

				{items.length === 0 ? (
					<View style={styles.emptyState}>
						<Ionicons name="notifications-off-outline" size={48} color="#cbd5e1" />
						<Text style={styles.emptyTitle}>No notifications</Text>
						<Text style={styles.emptySubtitle}>You are all caught up for now.</Text>
					</View>
				) : (
					items.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={[styles.card, item.read ? styles.cardRead : styles.cardUnread]}
							onPress={() => handleMarkRead(item.id)}
							activeOpacity={0.9}
						>
							<View style={[styles.iconWrap, item.read ? styles.iconRead : styles.iconUnread]}>
								{renderIcon(item.type, item.read)}
							</View>
							<View style={styles.cardContent}>
								<View style={styles.cardHeader}>
									<Text style={[styles.cardTitle, item.read && styles.cardTitleRead]} numberOfLines={1}>
										{item.title}
									</Text>
									<Text style={styles.cardTime}>{item.time}</Text>
								</View>
								<Text style={[styles.cardBody, item.read && styles.cardBodyRead]} numberOfLines={2}>
									{item.body}
								</Text>
							</View>
							{!item.read && <View style={styles.unreadDot} />}
						</TouchableOpacity>
					))
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: "#f8fafc" },
	backButtonRow: {
		paddingHorizontal: 4,
		paddingTop: 4,
		paddingBottom: 8,
		backgroundColor: '#f8fafc',
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	backButtonText: {
		fontSize: 17,
		color: '#b91c1c',
		fontWeight: '500',
	},
	container: { paddingHorizontal: 16, paddingTop: 36, paddingBottom: 32, gap: 14 },
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
	},
	loadingText: { fontSize: 14, color: '#6b7280' },
	errorBanner: {
		padding: 12,
		borderRadius: 10,
		backgroundColor: '#fef2f2',
		marginBottom: 12,
	},
	errorText: { color: '#b91c1c', fontSize: 13, fontWeight: '600' },
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
	badge: {
		backgroundColor: "#b91c1c",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
	},
	badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	actionText: { color: "#2563eb", fontWeight: "700", fontSize: 13 },
	actionDisabled: { color: "#cbd5e1" },
	emptyState: {
		paddingVertical: 80,
		alignItems: "center",
		gap: 8,
	},
	emptyTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
	emptySubtitle: { fontSize: 13, color: "#6b7280" },
	card: {
		flexDirection: "row",
		gap: 12,
		padding: 14,
		borderRadius: 14,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 3 },
		elevation: 2,
		alignItems: "center",
	},
	cardUnread: {
		borderLeftWidth: 3,
		borderLeftColor: "#b91c1c",
	},
	cardRead: {
		borderLeftWidth: 3,
		borderLeftColor: "#e5e7eb",
	},
	iconWrap: {
		width: 40,
		height: 40,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	iconUnread: { backgroundColor: "#fee2e2" },
	iconRead: { backgroundColor: "#f1f5f9" },
	cardContent: { flex: 1, gap: 4 },
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 8,
	},
	cardTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
	cardTitleRead: { color: "#4b5563" },
	cardBody: { fontSize: 13, color: "#374151" },
	cardBodyRead: { color: "#6b7280" },
	cardTime: { fontSize: 12, color: "#6b7280" },
	unreadDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#b91c1c",
	},
});

