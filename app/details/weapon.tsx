import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
// PERBAIKAN: Impor CustomAlert
import { CustomAlert } from '@/components/CustomAlert';

const { width } = Dimensions.get('window');

export default function WeaponDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // State untuk mengontrol CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });

  if (!params.data) return null;

  let weapon: any;
  try {
    weapon = JSON.parse(decodeURIComponent(params.data as string));
  } catch (e) {
    return null;
  }

  const stats = weapon.weaponStats;

  const handleSkinPress = (skin: any) => {
    const hasDetails = skin.chromas.length > 1 || skin.levels.length > 1;

    if (!hasDetails) {
      // Tampilkan CustomAlert
      setAlertInfo({
        title: "No Details",
        message: "This skin does not have any chromas or upgrade levels."
      });
      setAlertVisible(true);
      return;
    }
    
    if (isNavigating) return;
    setIsNavigating(true);
    
    setTimeout(() => {
      const encodedData = encodeURIComponent(JSON.stringify(skin));
      router.push({
        pathname: '/details/skin',
        params: { data: encodedData },
      });
      setTimeout(() => setIsNavigating(false), 1000);
    }, 50);
  };

  const DamageRow = ({ range, label }: { range: any, label: string }) => (
    <View style={styles.damageRow}>
      <Text style={styles.damageLabel}>{label}</Text>
      <View style={styles.damageValueBox}><Text style={styles.damageValue}>{range?.headDamage.toFixed(0)}</Text></View>
      <View style={styles.damageValueBox}><Text style={styles.damageValue}>{range?.bodyDamage.toFixed(0)}</Text></View>
      <View style={styles.damageValueBox}><Text style={styles.damageValue}>{range?.legDamage.toFixed(0)}</Text></View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Panggil CustomAlert di sini */}
      <CustomAlert 
        visible={alertVisible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertVisible(false)}
      />

      {isNavigating && <View style={styles.overlay}><ActivityIndicator size="large" color={COLORS.primary} /></View>}
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{weapon.displayName.toUpperCase()}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ... sisa kode tidak berubah ... */}
        {/* Konten ScrollView tetap sama persis seperti kode sebelumnya */}
        <View style={styles.showcase}>
          <LinearGradient colors={['#2A2E33', COLORS.background]} style={styles.showcaseBg} />
          <Image source={{ uri: weapon.displayIcon }} style={styles.weaponImage} />
          <View style={styles.typeTag}>
             <Text style={styles.typeText}>{weapon.shopData?.category || 'MELEE'}</Text>
          </View>
        </View>

        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statBox}><Text style={styles.statLabel}>FIRE RATE</Text><Text style={styles.statValue}>{stats.fireRate}</Text></View>
            <View style={styles.statBox}><Text style={styles.statLabel}>MAGAZINE</Text><Text style={styles.statValue}>{stats.magazineSize}</Text></View>
            <View style={styles.statBox}><Text style={styles.statLabel}>RELOAD</Text><Text style={styles.statValue}>{stats.reloadTimeSeconds}s</Text></View>
          </View>
        )}

        {stats?.damageRanges && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DAMAGE STATS</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.damageLabel, {color: COLORS.textSecondary}]}>RANGE</Text>
              <Text style={[styles.damageHead, {color: COLORS.primary}]}>HEAD</Text>
              <Text style={styles.damageHead}>BODY</Text>
              <Text style={styles.damageHead}>LEG</Text>
            </View>
            {stats.damageRanges.map((range: any, index: number) => (
              <DamageRow key={index} range={range} label={`${range.rangeStartM}-${range.rangeEndM}m`} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AVAILABLE SKINS ({weapon.skins.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.skinsScroll}>
            {weapon.skins.map((skin: any, index: number) => {
              if (!skin.displayIcon && !skin.chromas[0]?.fullRender) return null;
              const imgUri = skin.displayIcon || skin.chromas[0].fullRender;
              const isDefaultSkin = skin.displayName.toLowerCase().includes('standard');
              
              return (
                <TouchableOpacity key={index} style={styles.skinCard} onPress={() => handleSkinPress(skin)} disabled={isDefaultSkin}>
                  <Image source={{ uri: imgUri }} style={styles.skinImage} />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.skinOverlay}>
                    <Text numberOfLines={1} style={styles.skinName}>{skin.displayName}</Text>
                  </LinearGradient>
                  {isDefaultSkin && <View style={styles.defaultOverlay} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 25, 35, 0.7)', zIndex: 999, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  headerTitle: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 20, letterSpacing: 1 },
  content: { paddingBottom: 40 },
  showcase: { alignItems: 'center', justifyContent: 'center', height: 220, marginBottom: 20 },
  showcaseBg: { position: 'absolute', width: '100%', height: '100%', opacity: 0.5 },
  weaponImage: { width: width * 0.9, height: 140, resizeMode: 'contain' },
  typeTag: { position: 'absolute', bottom: 10, right: 20, backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  typeText: { color: 'white', fontFamily: FONTS.semiBold, fontSize: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 25 },
  statBox: { backgroundColor: COLORS.cardBg, flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: FONTS.semiBold, marginBottom: 5 },
  statValue: { color: COLORS.white, fontSize: 18, fontFamily: FONTS.bold },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 18, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: COLORS.primary, paddingLeft: 10 },
  tableHeader: { flexDirection: 'row', marginBottom: 10, paddingHorizontal: 10 },
  damageHead: { flex: 1, textAlign: 'center', fontSize: 12, fontFamily: FONTS.bold, color: COLORS.textSecondary },
  damageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: '#1F2326', padding: 10, borderRadius: 8 },
  damageLabel: { flex: 1, color: COLORS.textSecondary, fontSize: 12, fontFamily: FONTS.regular },
  damageValueBox: { flex: 1, alignItems: 'center' },
  damageValue: { color: COLORS.white, fontFamily: FONTS.semiBold, fontSize: 14 },
  skinsScroll: { marginLeft: -20, paddingLeft: 20 },
  skinCard: { width: 220, height: 140, marginRight: 15, backgroundColor: '#2A2E33', borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  skinImage: { width: '90%', height: 80, resizeMode: 'contain' },
  skinOverlay: { position: 'absolute', bottom: 0, width: '100%', padding: 10 },
  skinName: { color: COLORS.white, fontFamily: FONTS.regular, fontSize: 12, textAlign: 'center' },
  defaultOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }
});