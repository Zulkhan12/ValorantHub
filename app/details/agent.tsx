import { COLORS, FONTS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AgentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Mencegah error jika data belum dimuat
  if (!params.data) return null;

  const agent = JSON.parse(params.data as string);

  return (
    <View style={styles.container}>
      {/* Background Image Redup */}
      <Image source={{ uri: agent.background }} style={styles.bgImage} blurRadius={3} />
      <LinearGradient colors={['transparent', COLORS.background]} style={styles.bgGradient} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Tombol Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.white} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Agent Image & Name */}
          <View style={styles.headerContainer}>
             <Image source={{ uri: agent.fullPortrait }} style={styles.fullPortrait} />
             <View style={styles.nameOverlay}>
               <Text style={styles.agentName}>{agent.displayName.toUpperCase()}</Text>
               <View style={styles.roleTag}>
                 <Image source={{ uri: agent.role?.displayIcon }} style={styles.roleIcon} />
                 <Text style={styles.roleName}>{agent.role?.displayName}</Text>
               </View>
             </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BIOGRAPHY</Text>
            <Text style={styles.description}>{agent.description}</Text>
          </View>

          {/* Abilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABILITIES</Text>
            {agent.abilities?.map((ability: any, index: number) => (
              <View key={index} style={styles.abilityCard}>
                <View style={styles.abilityIconBox}>
                  {ability.displayIcon ? (
                    <Image source={{ uri: ability.displayIcon }} style={styles.abilityIcon} />
                  ) : (
                    <MaterialCommunityIcons name="lightning-bolt" size={24} color={COLORS.white} />
                  )}
                </View>
                <View style={styles.abilityInfo}>
                  <Text style={styles.abilityName}>{ability.displayName}</Text>
                  <Text style={styles.abilityDesc}>{ability.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  bgImage: { position: 'absolute', width: '100%', height: 500, opacity: 0.3, resizeMode: 'cover' },
  bgGradient: { position: 'absolute', width: '100%', height: 500, bottom: 0 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 12 },
  scrollContent: { paddingBottom: 40 },
  headerContainer: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  fullPortrait: { width: width, height: 400, resizeMode: 'contain' },
  nameOverlay: { position: 'absolute', bottom: 0, left: 20 },
  agentName: { fontFamily: FONTS.bold, fontSize: 48, color: COLORS.white, textShadowColor: COLORS.primary, textShadowOffset: {width: 2, height: 2}, textShadowRadius: 10 },
  roleTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  roleIcon: { width: 16, height: 16, tintColor: 'white', marginRight: 5 },
  roleName: { color: 'white', fontFamily: FONTS.semiBold, fontSize: 14, textTransform: 'uppercase' },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { color: COLORS.primary, fontFamily: FONTS.bold, fontSize: 18, marginBottom: 10, letterSpacing: 1 },
  description: { color: COLORS.textPrimary, fontFamily: FONTS.regular, lineHeight: 22, fontSize: 14 },
  abilityCard: { flexDirection: 'row', marginBottom: 15, backgroundColor: COLORS.cardBg, borderRadius: 10, padding: 10, borderLeftWidth: 3, borderLeftColor: COLORS.textSecondary },
  abilityIconBox: { width: 50, height: 50, backgroundColor: '#2A2E33', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginRight: 15 },
  abilityIcon: { width: 30, height: 30, tintColor: COLORS.white, resizeMode: 'contain' },
  abilityInfo: { flex: 1 },
  abilityName: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16, marginBottom: 4 },
  abilityDesc: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 12, lineHeight: 16 },
});