import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, TOURNAMENTS, FONTS } from '@/constants/theme';

const YEARS = ["ALL", "2025", "2024", "2023", "2022", "2021"];

export default function EsportsScreen() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [filteredTournaments, setFilteredTournaments] = useState(TOURNAMENTS);

  useEffect(() => {
    if (selectedYear === "ALL") {
      setFilteredTournaments(TOURNAMENTS);
    } else {
      setFilteredTournaments(TOURNAMENTS.filter(t => t.year === selectedYear));
    }
  }, [selectedYear]);

  const handlePress = (item: any) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setTimeout(() => {
      const encodedData = encodeURIComponent(JSON.stringify(item));
      router.push({ pathname: '/details/tournament', params: { data: encodedData } });
      setTimeout(() => setIsNavigating(false), 1000);
    }, 50);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => handlePress(item)}>
      <View style={styles.cardLeft}>
        <MaterialCommunityIcons name="trophy-variant" size={32} color={COLORS.gold} />
        <Text style={styles.year}>{item.year}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.tournamentName}>{item.name}</Text>
        <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.textSecondary} />
            <Text style={styles.location}> {item.location}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.winnerRow}>
          <Text style={styles.winnerLabel}>CHAMPION</Text>
          <Text style={styles.winnerName}>{item.winner.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isNavigating && <View style={styles.overlay}><ActivityIndicator size="large" color={COLORS.primary} /></View>}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CHAMPIONS</Text>
        <Text style={styles.subHeader}>Hall of Fame</Text>
      </View>

      {/* FILTER BAR */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20}}>
          {YEARS.map((year, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.filterChip, selectedYear === year && styles.filterChipActive]}
              onPress={() => setSelectedYear(year)}
            >
              <Text style={[styles.filterText, selectedYear === year && styles.filterTextActive]}>{year}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTournaments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 25, 35, 0.7)', zIndex: 999, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingBottom: 10, paddingTop: 10 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.white },
  subHeader: { fontFamily: FONTS.regular, color: COLORS.textSecondary, fontSize: 14 },
  
  // Filter Styles
  filterContainer: { marginBottom: 15, height: 40 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.cardBg, marginRight: 10, borderWidth: 1, borderColor: '#333' },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 12 },
  filterTextActive: { color: COLORS.white },

  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: COLORS.gold, elevation: 3 },
  cardLeft: { alignItems: 'center', marginRight: 20, width: 50 },
  year: { color: COLORS.textSecondary, fontSize: 14, fontFamily: FONTS.bold, marginTop: 5 },
  cardRight: { flex: 1 },
  tournamentName: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  location: { color: COLORS.textSecondary, fontSize: 12, fontFamily: FONTS.regular },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 10 },
  winnerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  winnerLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: FONTS.semiBold, letterSpacing: 1 },
  winnerName: { color: COLORS.primary, fontFamily: FONTS.bold, fontSize: 16 },
});