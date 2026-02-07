# Google Maps-Style Location Search Implementation

## Overview
This implementation provides a real-time location search autocomplete feature for Nepal using the Nominatim API with a Google Maps-style dark theme UI.

## Features
✅ Real-time search suggestions as user types  
✅ Limited to Nepal locations only  
✅ Dark theme UI similar to Google Maps  
✅ Debounced search (300ms) for better performance  
✅ Smart place type detection with appropriate icons  
✅ Smooth map camera animation  
✅ Draggable markers  
✅ Loading indicators  

---

## API Setup

### Nominatim API (OpenStreetMap)

**Base URL:** `https://nominatim.openstreetmap.org/search`

**Required Headers:**
```javascript
{
  'User-Agent': 'HistoricalWalkApp/1.0 (contact@example.com)',
  'Accept-Language': 'en'
}
```

**Key Parameters:**
- `format=json` - Response format
- `q=${query}` - Search query
- `countrycodes=np` - **Limits results to Nepal only**
- `limit=8` - Maximum 8 suggestions
- `addressdetails=1` - Include address breakdown
- `extratags=1` - Additional place information

**No API Key Required** - Nominatim is free but has usage limits:
- Max 1 request per second
- Must include User-Agent header
- For production: Consider hosting your own Nominatim instance

---

## Implementation Details

### 1. State Management

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState<any[]>([]);
const [isSearching, setIsSearching] = useState(false);
const [selectedCoords, setSelectedCoords] = useState({
  latitude: 27.7172,  // Default: Kathmandu
  longitude: 85.3240
});
const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
const mapRef = React.useRef<MapView>(null);
```

### 2. Debounced Search Function

```typescript
const handleSearchInput = (text: string) => {
  setSearchQuery(text);
  
  // Clear existing timeout
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  // Debounce: wait 300ms after user stops typing
  searchTimeoutRef.current = setTimeout(() => {
    fetchSearchSuggestions(text);
  }, 300);
};
```

**Why Debouncing?**
- Reduces API calls (Nominatim has rate limits)
- Waits for user to finish typing
- Better user experience and performance

### 3. Search API Call

```typescript
const fetchSearchSuggestions = async (query: string) => {
  if (query.trim().length < 2) {
    setSearchResults([]);
    setIsSearching(false);
    return;
  }

  setIsSearching(true);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&` +
      `q=${encodeURIComponent(query)}&` +
      `countrycodes=np&` +  // Nepal only
      `limit=8&` +
      `addressdetails=1&` +
      `extratags=1`,
      {
        headers: {
          'User-Agent': 'HistoricalWalkApp/1.0 (contact@example.com)',
          'Accept-Language': 'en'
        }
      }
    );
    const data = await response.json();
    setSearchResults(data || []);
  } catch (error) {
    console.error('Search error:', error);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};
```

### 4. Handle Selection & Map Animation

```typescript
const handleSelectSuggestion = (item: any) => {
  const newCoords = {
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
  };
  setSelectedCoords(newCoords);
  
  // Extract clean place name
  const placeName = item.name || 
                   item.address?.city || 
                   item.address?.town || 
                   item.address?.village || 
                   'Selected Location';
  setSearchQuery(placeName);
  setSearchResults([]);
  
  // Smart zoom based on place type
  const zoomLevel = item.type === 'city' ? 0.1 : 
                   item.type === 'locality' ? 0.05 : 
                   0.02;
  
  // Animate map camera
  mapRef.current?.animateToRegion({
    latitude: newCoords.latitude,
    longitude: newCoords.longitude,
    latitudeDelta: zoomLevel,
    longitudeDelta: zoomLevel,
  }, 1000); // 1 second animation
};
```

**Zoom Levels:**
- City: 0.1 (zoomed out)
- Locality/Town: 0.05 (medium)
- Specific place: 0.02 (zoomed in)

---

## UI Components

### Search Input (Dark Theme)

```jsx
<View style={styles.searchContainer}>
  <View style={styles.searchInputWrapper}>
    <Ionicons name="search" size={20} color="#9CA3AF" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search in Nepal (cities, landmarks, hotels...)"
      placeholderTextColor="#9CA3AF"
      value={searchQuery}
      onChangeText={handleSearchInput}
      returnKeyType="search"
      autoCapitalize="words"
      autoCorrect={false}
    />
    {isSearching && (
      <Text style={styles.loadingText}>...</Text>
    )}
  </View>
</View>
```

### Suggestion List

```jsx
{searchResults && searchResults.length > 0 && (
  <ScrollView 
    style={styles.suggestionList}
    keyboardShouldPersistTaps="handled"
  >
    {searchResults.map((item, idx) => {
      const placeName = item.name || item.address?.city || 'Unknown';
      const addressParts = [];
      
      if (item.address) {
        if (item.address.road) addressParts.push(item.address.road);
        if (item.address.city) addressParts.push(item.address.city);
        if (item.address.state) addressParts.push(item.address.state);
      }
      
      // Dynamic icon based on place type
      let iconName = 'location';
      if (item.type === 'city') iconName = 'business';
      else if (item.type === 'tourism') iconName = 'camera';
      else if (item.type === 'hotel') iconName = 'bed';
      
      return (
        <TouchableOpacity
          key={item.place_id || idx}
          style={styles.suggestionItem}
          onPress={() => handleSelectSuggestion(item)}
        >
          <View style={styles.suggestionIconContainer}>
            <Ionicons name={iconName} size={20} color="#9CA3AF" />
          </View>
          <View style={styles.suggestionTextContainer}>
            <Text style={styles.suggestionText}>{placeName}</Text>
            <Text style={styles.suggestionSubtext}>
              {addressParts.join(', ')}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#4B5563" />
        </TouchableOpacity>
      );
    })}
  </ScrollView>
)}
```

### Map with Marker

```jsx
<MapView
  ref={mapRef}
  style={styles.map}
  initialRegion={{
    latitude: 27.7172,
    longitude: 85.3240,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  }}
  onPress={handleMapPress}
>
  <Marker
    coordinate={selectedCoords}
    title="Selected Location"
    draggable
    onDragEnd={handleMarkerDrag}
  />
</MapView>
```

---

## Styling (Dark Theme)

```typescript
const styles = StyleSheet.create({
  // Search container - dark background
  searchContainer: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  
  // Search input wrapper
  searchInputWrapper: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Search input text
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#F9FAFB',
  },
  
  // Suggestion list container
  suggestionList: {
    backgroundColor: '#1F2937',
    maxHeight: 300,
  },
  
  // Individual suggestion item
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  
  // Icon container (circular)
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Place name text (white)
  suggestionText: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  
  // Address text (gray)
  suggestionSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
```

**Color Palette (Tailwind CSS equivalents):**
- `#1F2937` - gray-800 (background)
- `#374151` - gray-700 (lighter background)
- `#F9FAFB` - gray-50 (text)
- `#9CA3AF` - gray-400 (secondary text)
- `#4B5563` - gray-600 (icons)

---

## How It Works

### 1. User Types
```
User types: "kath"
  ↓
handleSearchInput() is called
  ↓
Debounce timer starts (300ms)
  ↓
After 300ms: fetchSearchSuggestions("kath")
  ↓
API Call to Nominatim with countrycodes=np
  ↓
Results displayed in dark-themed list
```

### 2. User Selects Location
```
User taps suggestion
  ↓
handleSelectSuggestion(item) is called
  ↓
Extract latitude, longitude from item
  ↓
Update selectedCoords state
  ↓
Update marker position
  ↓
Animate map camera to new location (1s animation)
  ↓
Clear search results
  ↓
Update search query with place name
```

### 3. Map Interaction
```
User taps map
  ↓
handleMapPress() gets coordinates
  ↓
Update marker position
  ↓
Update selectedCoords state

User drags marker
  ↓
handleMarkerDrag() gets new coordinates
  ↓
Update selectedCoords state
```

---

## API Response Structure

```json
[
  {
    "place_id": 123456,
    "lat": "27.7172",
    "lon": "85.3240",
    "name": "Kathmandu",
    "display_name": "Kathmandu, Bagmati Province, Nepal",
    "type": "city",
    "class": "place",
    "address": {
      "city": "Kathmandu",
      "state": "Bagmati Province",
      "country": "Nepal",
      "country_code": "np"
    }
  }
]
```

**Key Fields:**
- `lat`, `lon` - Coordinates
- `name` - Place name
- `display_name` - Full address
- `type` - Place type (city, tourism, hotel, etc.)
- `address` - Breakdown of address components

---

## Testing

### Test Cases

1. **Basic Search:**
   - Type "kathmandu"
   - Should show Kathmandu city results

2. **Hotel Search:**
   - Type "hotel kathmandu"
   - Should show hotel suggestions with bed icon

3. **Landmark Search:**
   - Type "swayambhunath"
   - Should show temple/tourism locations

4. **Empty Search:**
   - Type less than 2 characters
   - Should show no results

5. **No Results:**
   - Type "xyz123abc"
   - Should show "No locations found" message

6. **Selection:**
   - Select a suggestion
   - Map should animate to location
   - Marker should appear

7. **Debouncing:**
   - Type quickly
   - API should only be called after 300ms pause

---

## Production Considerations

### 1. Rate Limiting
Nominatim has a 1 request/second limit. For production:
- Implement request queue
- Add exponential backoff
- Consider self-hosting Nominatim
- Or use paid alternatives (Google Places, Mapbox)

### 2. Error Handling
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  // Handle data
} catch (error) {
  console.error('Search error:', error);
  Alert.alert('Error', 'Failed to search. Please try again.');
}
```

### 3. Caching
Consider caching frequent searches:
```typescript
const searchCache = new Map();

const fetchWithCache = async (query) => {
  if (searchCache.has(query)) {
    return searchCache.get(query);
  }
  const results = await fetchSearchSuggestions(query);
  searchCache.set(query, results);
  return results;
};
```

### 4. Analytics
Track search behavior:
```typescript
// Log searches
Analytics.logEvent('location_search', {
  query: searchQuery,
  results_count: searchResults.length
});

// Log selections
Analytics.logEvent('location_selected', {
  place_name: placeName,
  place_type: item.type
});
```

---

## Dependencies

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "react-native": "0.74.0",
    "react-native-maps": "1.14.0",
    "@expo/vector-icons": "^14.0.0"
  }
}
```

**Installation:**
```bash
npx expo install react-native-maps @expo/vector-icons
```

---

## Advantages of This Implementation

✅ **No API Key Required** - Nominatim is free  
✅ **Nepal-Specific** - Only shows relevant results  
✅ **Dark Theme** - Modern, Google Maps-style UI  
✅ **Performant** - Debouncing reduces API calls  
✅ **Smart Zoom** - Adjusts based on place type  
✅ **Rich Data** - Address breakdowns, place types  
✅ **Smooth Animations** - Professional user experience  
✅ **Flexible** - Easy to extend with more features  

---

## Future Enhancements

1. **Recent Searches** - Save and display recent searches
2. **Favorites** - Let users save favorite locations
3. **Current Location** - Add "Use my location" button
4. **Directions** - Integrate routing between points
5. **Place Details** - Show photos, ratings, hours
6. **Offline Mode** - Cache popular locations
7. **Voice Search** - Speech-to-text search
8. **Multi-Language** - Support Nepali language

---

## Troubleshooting

### Issue: No suggestions appearing
**Solution:** Check console logs, verify network connection, ensure API headers are correct

### Issue: Wrong locations shown
**Solution:** Verify `countrycodes=np` parameter is included

### Issue: Map not animating
**Solution:** Ensure `mapRef.current` is defined, check `animateToRegion` parameters

### Issue: Search too slow
**Solution:** Reduce debounce time or implement local caching

---

## Support

For issues or questions:
- Check Nominatim docs: https://nominatim.org/
- React Native Maps: https://github.com/react-native-maps/react-native-maps
- Expo docs: https://docs.expo.dev/

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**License:** MIT
