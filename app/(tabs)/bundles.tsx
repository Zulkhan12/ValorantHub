import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS } from '@/constants/theme';

export default function BundlesScreen() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [filteredBundles, setFilteredBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBundles();
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setFilteredBundles(bundles);
    } else {
      const filtered = bundles.filter(b => 
        b.displayName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredBundles(filtered);
    }
  }, [searchText, bundles]);

  const fetchBundles = async () => {
    try {
      const response = await axios.get('https://valorant-api.com/v1/bundles');
      const validBundles = response.data.data.filter((b: any) => b.displayIcon || b.displayIcon2);
      setBundles(validBundles);
      setFilteredBundles(validBundles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item: any) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setTimeout(() => {
      const encodedData = encodeURIComponent(JSON.stringify(item));
      router.push({ pathname: '/details/bundle', params: { data: encodedData } });
      setTimeout(() => setIsNavigating(false), 1000);
    }, 50);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => handlePress(item)}>
      <Image source={{ uri: item.displayIcon || item.displayIcon2 }} style={styles.bannerImage} />
      <LinearGradient colors={['transparent', 'rgba(15, 25, 35, 0.95)']} style={styles.gradientOverlay}>
        <Text style={styles.bundleName}>{item.displayName.toUpperCase()}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>COLLECTION</Text></View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isNavigating && <View style={styles.overlay}><ActivityIndicator size="large" color={COLORS.primary} /></View>}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BUNDLES</Text>
        <Text style={styles.subHeader}>Exclusive Skin Collections</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={COLORS.textSecondary} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search bundles..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <FlatList
          data={filteredBundles}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 25, 35, 0.7)', zIndex: 999, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.white },
  subHeader: { fontFamily: FONTS.regular, color: COLORS.textSecondary, fontSize: 14 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, marginHorizontal: 20, marginBottom: 15, paddingHorizontal: 15, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  searchInput: { flex: 1, color: COLORS.white, marginLeft: 10, fontFamily: FONTS.regular },

  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { marginBottom: 20, borderRadius: 16, overflow: 'hidden', height: 180, backgroundColor: COLORS.cardBg, elevation: 5, borderWidth: 1, borderColor: '#333' },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', justifyContent: 'flex-end', padding: 15 },
  bundleName: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 22, letterSpacing: 1, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 5 },
  badge: { backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 5 },
  badgeText: { color: 'white', fontFamily: FONTS.semiBold, fontSize: 10 }
});