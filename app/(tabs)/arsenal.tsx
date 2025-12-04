import { COLORS, FONTS } from '@/constants/theme';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ["ALL", "Sidearm", "SMG", "Shotgun", "Rifle", "Sniper", "Heavy", "Melee"];

export default function ArsenalScreen() {
  const [weapons, setWeapons] = useState<any[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedCat, setSelectedCat] = useState("ALL");
  
  const router = useRouter();
  
  // LOGIC RESPONSIF UNTUK WEB & MOBILE
  const { width } = useWindowDimensions();
  
  // Tentukan jumlah kolom berdasarkan lebar layar
  let numColumns = 2;
  if (width > 768) numColumns = 3;  // Tablet
  if (width > 1024) numColumns = 4; // Desktop Kecil
  if (width > 1440) numColumns = 5; // Desktop Besar

  // Hitung lebar kartu agar pas dengan margin
  const GAP = 15; // Jarak antar kartu
  const PADDING = 30; // Total padding kiri kanan container (15 + 15)
  const availableWidth = width - PADDING - ((numColumns - 1) * GAP);
  const cardWidth = availableWidth / numColumns;

  useEffect(() => {
    fetchWeapons();
  }, []);

  useEffect(() => {
    if (selectedCat === "ALL") {
      setFilteredWeapons(weapons);
    } else {
      const filtered = weapons.filter(w => {
        const cat = w.shopData?.category || 'Melee';
        return cat.includes(selectedCat);
      });
      setFilteredWeapons(filtered);
    }
  }, [selectedCat, weapons]);

  const fetchWeapons = async () => {
    try {
      const response = await axios.get('https://valorant-api.com/v1/weapons');
      setWeapons(response.data.data);
      setFilteredWeapons(response.data.data);
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
      router.push({ pathname: '/details/weapon', params: { data: encodedData } });
      setTimeout(() => setIsNavigating(false), 1000);
    }, 50);
  };

  const renderItem = ({ item }: { item: any }) => {
    const rawCat = item.shopData?.category || 'Melee';
    const displayCat = rawCat.replace('EEquippableCategory::', '');

    return (
      <TouchableOpacity 
        style={[styles.card, { width: cardWidth }]} // Lebar dinamis
        activeOpacity={0.8} 
        onPress={() => handlePress(item)}
      >
        <LinearGradient colors={['#2A2E33', COLORS.cardBg]} style={styles.cardGradient}>
          <Image source={{ uri: item.displayIcon }} style={styles.weaponImage} />
          <View style={styles.textContainer}>
            <Text style={styles.weaponName}>{item.displayName.toUpperCase()}</Text>
            <Text style={styles.weaponType}>{displayCat}</Text>
          </View>
          <View style={styles.priceTag}>
              <Text style={styles.priceText}>{item.shopData?.cost ? `$${item.shopData.cost}` : 'FREE'}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isNavigating && <View style={styles.overlay}><ActivityIndicator size="large" color={COLORS.primary} /></View>}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ARSENAL</Text>
        <Text style={styles.subHeader}>Weapons & Skins Collection</Text>
      </View>

      {/* FILTER BAR */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 15}}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.filterChip, selectedCat === cat && styles.filterChipActive]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.filterText, selectedCat === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <FlatList
          // PENTING: Key harus berubah jika jumlah kolom berubah agar FlatList merender ulang layout
          key={numColumns} 
          data={filteredWeapons}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
          numColumns={numColumns} // Jumlah kolom dinamis
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper} // Style untuk baris
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
  
  // Filter Styles
  filterContainer: { marginBottom: 10, height: 40 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.cardBg, marginRight: 10, borderWidth: 1, borderColor: '#333' },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 12 },
  filterTextActive: { color: COLORS.white },

  listContent: { paddingHorizontal: 15, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' }, // Agar item rata kiri-kanan
  
  // Card styles tanpa width fix (width diatur inline style)
  card: { marginBottom: 15, borderRadius: 12, overflow: 'hidden', elevation: 3 },
  cardGradient: { padding: 10, alignItems: 'center', height: 160, justifyContent: 'space-between' },
  weaponImage: { width: '100%', height: 80, resizeMode: 'contain', marginTop: 10 },
  textContainer: { alignItems: 'center', width: '100%' },
  weaponName: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16, textAlign: 'center' },
  weaponType: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 10 },
  priceTag: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priceText: { color: COLORS.gold, fontSize: 10, fontFamily: FONTS.semiBold }
});