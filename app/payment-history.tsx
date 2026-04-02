import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { router } from "expo-router";
import { payment as paymentApi } from "../api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentHistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');

  useEffect(() => {
    checkAdmin();
    fetchHistory();
  }, [viewMode]);

  const checkAdmin = async () => {
    const userType = await AsyncStorage.getItem('userType');
    setIsAdmin(userType === 'admin');
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      let data;
      if (viewMode === 'all') {
        data = await paymentApi.getAllHistory();
      } else {
        data = await paymentApi.getHistory();
      }
      setHistory(data.history || []);
    } catch (e: any) {
      setError(e.message || "Failed to load payment history");
      Alert.alert('Error', e.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ticket': return 'ticket-outline';
      case 'story': return 'book-outline';
      case 'site': return 'business-outline';
      default: return 'card-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ticket': return '#3b82f6'; // Blue
      case 'story': return '#10b981'; // Green
      case 'site': return '#f59e0b'; // Amber
      default: return '#6366f1'; // Indigo
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.historyCard}>
      <View style={[styles.iconContainer, { backgroundColor: getTypeColor(item.type) + '20' }]}>
        <Ionicons name={getTypeIcon(item.type)} size={24} color={getTypeColor(item.type)} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        {viewMode === 'all' && item.user && (
          <Text style={styles.userInfo}>{item.user.name} ({item.user.email})</Text>
        )}
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()} • {item.method}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>Rs. {item.amount}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.statusText, { color: item.status === 'completed' ? '#166534' : '#991b1b' }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
            {viewMode === 'all' ? "All System Payments" : "My Payment History"}
        </Text>
      </View>

      {isAdmin && (
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, viewMode === 'my' && styles.activeTab]} 
            onPress={() => setViewMode('my')}
          >
            <Text style={[styles.tabText, viewMode === 'my' && styles.activeTabText]}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, viewMode === 'all' && styles.activeTab]} 
            onPress={() => setViewMode('all')}
          >
            <Text style={[styles.tabText, viewMode === 'all' && styles.activeTabText]}>All Users</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHistory}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="receipt-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No payment history found</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: { marginRight: 16, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: { 
    flex: 1, 
    paddingVertical: 8, 
    alignItems: 'center', 
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: { backgroundColor: '#1e3a8a' },
  tabText: { fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  listContent: { padding: 16, gap: 12 },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#334155' },
  userInfo: { fontSize: 12, color: '#1e40af', fontWeight: '500', marginTop: 2 },
  date: { fontSize: 13, color: '#64748b', marginTop: 2 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  errorText: { color: "#ef4444", marginBottom: 16, textAlign: 'center' },
  retryButton: { backgroundColor: "#1e3a8a", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: '600' },
  emptyText: { color: "#64748b", marginTop: 16, fontSize: 16 },
});
