import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
import { ResizeMode, Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SkinDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const videoRef = useRef<Video>(null);

  const [previewContent, setPreviewContent] = useState({ type: 'image', uri: '' });
  const [selectedChroma, setSelectedChroma] = useState('');
  
  if (!params.data) return null;

  let skin: any;
  try {
    skin = JSON.parse(decodeURIComponent(params.data as string));
  } catch (e) {
    return null;
  }

  const hasDetails = skin.chromas.length > 1 || skin.levels.length > 1;
  
  useEffect(() => {
    if (skin.chromas[0]?.fullRender) {
      setPreviewContent({ type: 'image', uri: skin.chromas[0].fullRender });
      setSelectedChroma(skin.chromas[0].uuid);
    }
  }, []);

  const handleChromaPress = (chroma: any) => {
    setPreviewContent({ type: 'image', uri: chroma.fullRender });
    setSelectedChroma(chroma.uuid);
  };

  const handleLevelPress = (level: any) => {
    if (level.streamedVideo) {
      setPreviewContent({ type: 'video', uri: level.streamedVideo });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{skin.displayName}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.showcase}>
          {previewContent.type === 'image' || !previewContent.uri ? (
            <Image source={{ uri: previewContent.uri }} style={styles.previewImage} />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: previewContent.uri }}
              style={styles.previewVideo}
              useNativeControls={false}
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay
            />
          )}
        </View>
        
        {/* PERBAIKAN: Tampilkan pesan jika tidak ada detail */}
        {!hasDetails && (
          <View style={styles.noDetailsContainer}>
            <Text style={styles.noDetailsText}>No chromas or levels available for this skin.</Text>
          </View>
        )}

        {skin.chromas.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CHROMAS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {skin.chromas.map((chroma: any) => (
                <TouchableOpacity key={chroma.uuid} onPress={() => handleChromaPress(chroma)} style={[styles.chromaBox, selectedChroma === chroma.uuid && styles.chromaBoxActive]}>
                  {chroma.swatch && <Image source={{ uri: chroma.swatch }} style={styles.swatchIcon} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {skin.levels.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LEVELS</Text>
            {skin.levels.map((level: any, index: number) => (
              <TouchableOpacity key={level.uuid} style={styles.levelCard} onPress={() => handleLevelPress(level)}>
                <View style={{flex: 1}}>
                  <Text style={styles.levelName}>{level.displayName || `Level ${index + 1}`}</Text>
                  {level.levelItem && <Text style={styles.levelDesc}>{level.levelItem}</Text>}
                </View>
                {level.streamedVideo && <MaterialCommunityIcons name="play-box" size={32} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  headerTitle: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 18, flex: 1, textAlign: 'center', marginHorizontal: 10 },
  content: { paddingBottom: 40 },
  
  showcase: { height: 250, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  previewVideo: { width: width, height: 250 },

  section: { marginBottom: 25 },
  sectionTitle: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 18, marginBottom: 15, marginHorizontal: 20, borderLeftWidth: 4, borderLeftColor: COLORS.primary, paddingLeft: 10 },

  chromaBox: { width: 60, height: 60, borderRadius: 8, marginRight: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.cardBg, borderWidth: 2, borderColor: 'transparent' },
  chromaBoxActive: { borderColor: COLORS.primary },
  swatchIcon: { width: 40, height: 40, resizeMode: 'contain' },

  levelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  levelName: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16 },
  levelDesc: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 12, marginTop: 4 },

  noDetailsContainer: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  noDetailsText: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 14 }
});