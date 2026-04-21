import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
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
import { Review, reviews } from "../api";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function ReviewScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUserType();
  }, []);

  useEffect(() => {
    if (userType !== null) {
      fetchMyReviews();
    }
  }, [userType]);

  const fetchUserType = async () => {
    try {
      const storedType = await AsyncStorage.getItem('userType');
      const storedUser = await AsyncStorage.getItem('user');

      console.log('Stored user:', storedUser);

      if (!storedUser) {
        console.error('No user found in AsyncStorage');
        setUserType(storedType ? storedType.toLowerCase() : null);
        setCurrentUserId(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user:', parsedUser);

      const role = parsedUser?.role || storedType;
      const userId = parsedUser?.user_id || parsedUser?.userId || parsedUser?.id || null;

      console.log('Setting user type:', role, 'User ID:', userId);

      setUserType(role ? role.toLowerCase() : null);
      setCurrentUserId(userId);

      if (!userId) {
        console.error('Could not extract user_id from stored user');
      }
    } catch (err) {
      console.error('Error fetching user type:', err);
      setUserType(null);
      setCurrentUserId(null);
    }
  };

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use different endpoint based on user type
      const data = userType === 'admin'
        ? await reviews.getAllAdmin()
        : await reviews.getMyReviews();

      setMyReviews(data.reviews || []);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const data = await reviews.delete(reviewId);
              Alert.alert('Success', data.message || 'Review deleted successfully');
              fetchMyReviews(); // Refresh the list
            } catch (err: any) {
              console.error('Delete error:', err);
              Alert.alert('Error', 'Failed to delete review');
            }
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Ionicons
            key={value}
            name={value <= rating ? "star" : "star-outline"}
            size={16}
            color="#f6c343"
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b91c1c" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
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

        <View style={styles.headerSection}>
          <Text style={styles.title}>{userType === 'admin' ? 'All Reviews' : 'My Reviews'}</Text>
          <Text style={styles.subtitle}>
            {userType === 'admin' ? 'Manage all reviews' : 'Manage your reviews'}
          </Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {myReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
            <Text style={styles.emptySubtitle}>
              Visit places and share your experience!
            </Text>
          </View>
        ) : (
          <View style={styles.reviewList}>
            {myReviews.map((review) => (
              <View key={review.review_id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.museumInfo}>
                    <Text style={styles.museumName}>
                      {review.museum?.name || review.site?.name || 'Unknown Item'}
                    </Text>
                    {userType === 'admin' && review.user && (
                      <View style={styles.userNameRow}>
                        <Ionicons name="person" size={14} color="#6b7280" />
                        <Text style={styles.userName}>{review.user.name}</Text>
                      </View>
                    )}
                    {renderStars(review.rating)}
                  </View>
                  {userType !== 'admin' && (
                    <TouchableOpacity
                      onPress={() => handleDeleteReview(review.review_id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#dc2626" />
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.reviewThoughts}>{review.thoughts}</Text>

                <View style={styles.reviewFooter}>
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                    <Text style={styles.dateText}>{formatDate(review.created_at)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  backButtonRow: {
    paddingHorizontal: 4,
    paddingBottom: 8,
    backgroundColor: '#f9fafb',
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
  container: {
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 32,
    gap: 16,
  },
  headerSection: {
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  reviewList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  museumInfo: {
    flex: 1,
    gap: 6,
  },
  museumName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userName: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  reviewThoughts: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
});
