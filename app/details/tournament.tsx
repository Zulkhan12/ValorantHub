import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatusSuccess, VideoFullscreenUpdate } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { COLORS, FONTS } from '@/constants/theme';
// PERBAIKAN: Hanya impor SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TournamentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const videoRef = useRef<Video>(null);

  const [status, setStatus] = useState<Partial<AVPlaybackStatusSuccess>>({});
  const [isBuffering, setIsBuffering] = useState(false);

  if (!params.data) return null;

  let tournament: any;
  try {
    tournament = JSON.parse(decodeURIComponent(params.data as string));
  } catch (e) {
    return null;
  }

  const handleOpenYouTube = async () => {
    if (!tournament.anthemUrl) return;
    const supported = await Linking.canOpenURL(tournament.anthemUrl);
    if (supported) {
      await Linking.openURL(tournament.anthemUrl);
    } else {
      Alert.alert(`Error`, `Could not open this URL: ${tournament.anthemUrl}`);
    }
  };

  async function onFullscreenUpdate({ fullscreenUpdate }: { fullscreenUpdate: VideoFullscreenUpdate }) {
    if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_PRESENT) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    } else if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_DISMISS) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  }

  const handlePlayPress = () => {
    setIsBuffering(true);
    videoRef.current?.playAsync();
  };

  return (
    // PERBAIKAN: Hapus properti `edges` agar SafeAreaView menangani semua sisi
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EVENT DETAILS</Text>
        <TouchableOpacity style={{width: 28}} onPress={handleOpenYouTube}>
          <MaterialCommunityIcons name="youtube" size={28} color={'#FF0000'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {tournament.localAnthem && (
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={tournament.localAnthem}
                    useNativeControls={status.isPlaying}
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={newStatus => {
                        if (newStatus.isLoaded) {
                            setStatus(newStatus);
                            setIsBuffering(newStatus.isBuffering);
                        }
                    }}
                    onFullscreenUpdate={onFullscreenUpdate}
                />

                {!status.isPlaying && (
                    <TouchableOpacity 
                        style={styles.videoOverlay} 
                        onPress={handlePlayPress}
                        disabled={isBuffering}
                    >
                        {isBuffering ? (
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        ) : (
                            <MaterialCommunityIcons 
                                name="play-circle" 
                                size={80} 
                                color="rgba(255, 255, 255, 0.8)" 
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        )}

        <View style={styles.cardHero}>
          <MaterialCommunityIcons name="trophy" size={80} color={COLORS.gold} />
          <Text style={styles.tourName}>{tournament.name}</Text>
          <Text style={styles.tourLoc}>{tournament.location} • {tournament.year}</Text>
        </View>
        
        <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CHAMPION</Text>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{tournament.winner}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>FINAL SCORE</Text>
              <Text style={styles.statValue}>
                {tournament.score.split(' ').find((part: string) => part.includes('-')) || tournament.score}
              </Text>
            </View>
        </View>
        <View style={styles.infoRow}>
            <View style={styles.infoCard}><MaterialCommunityIcons name="cash-multiple" size={24} color={COLORS.gold} /><Text style={styles.infoLabel}>Prize Pool</Text><Text style={styles.infoValue}>{tournament.prizePool}</Text></View>
            <View style={styles.infoCard}><MaterialCommunityIcons name="star-circle" size={24} color={COLORS.primary} /><Text style={styles.infoLabel}>Finals MVP</Text><Text style={styles.infoValue}>{tournament.mvp}</Text></View>
        </View>
        <View style={styles.finalMatchupCard}>
            <Text style={styles.finalMatchupTitle}>GRAND FINAL MATCHUP</Text>
            <Text style={styles.finalMatchupText}>{tournament.score}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { color: COLORS.white, fontFamily: FONTS.semiBold, fontSize: 16 },
  
  // PERBAIKAN: Menambahkan paddingHorizontal dan paddingBottom statis
  content: { 
    paddingHorizontal: 20,
    paddingBottom: 40, // Memberi ruang ekstra di bawah
  },

  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  cardHero: { 
    alignItems: 'center', 
    marginBottom: 30, 
    padding: 20, 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.gold 
  },
  tourName: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 22, marginTop: 10, textAlign: 'center' },
  tourLoc: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 14, marginTop: 5 },
  
  statsContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#1F2326', 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 20, 
    justifyContent: 'space-between' 
  },
  statBox: { alignItems: 'center', flex: 1 },
  divider: { width: 1, backgroundColor: '#333', marginHorizontal: 10 },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: FONTS.semiBold, marginBottom: 5 },
  statValue: { color: COLORS.white, fontSize: 20, fontFamily: FONTS.bold },
  
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  infoCard: { width: '48%', backgroundColor: '#2A2E33', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 90 },
  infoLabel: { color: COLORS.textSecondary, marginTop: 5, fontSize: 12, fontFamily: FONTS.regular },
  infoValue: { color: COLORS.white, marginTop: 2, fontFamily: FONTS.bold, textAlign: 'center' },
  
  finalMatchupCard: { 
    backgroundColor: COLORS.cardBg, 
    padding: 20, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  finalMatchupTitle: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 10, letterSpacing: 1, marginBottom: 5 },
  finalMatchupText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16 }
});