import { COLORS, FONTS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function BundleDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  if (!params.data) return null;

  let bundle: any;
  try {
    bundle = JSON.parse(decodeURIComponent(params.data as string));
  } catch (e) {
    return null;
  }
  
  // FUNGSI BARU: Untuk membuka link wiki
  const handleViewDetailsPress = async () => {
    const bundleNameForUrl = bundle.displayName.replace(/ /g, '_');
    const url = `https://valorant.fandom.com/wiki/BUNDLES/${bundleNameForUrl}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Error`, `Could not open the URL for this bundle.`);
    }
  };

  const mainImage = bundle.verticalPromoImage || bundle.displayIcon || bundle.displayIcon2;

  return (
    <View style={styles.container}>
      <Image source={{ uri: mainImage }} style={styles.bgImage} />
      <LinearGradient colors={['rgba(15, 25, 35, 0.3)', COLORS.background]} style={styles.gradient} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.spacer} />
          
          <View style={styles.infoBox}>
            <Text style={styles.title}>{bundle.displayName.toUpperCase()}</Text>
            
            <View style={styles.divider} />

            {bundle.extraDescription ? (
               <Text style={styles.desc}>{bundle.extraDescription}</Text>
            ) : (
               <Text style={styles.desc}>
                 This is an exclusive Valorant collection. Includes premium skins and items. 
                 Master the art of style with the {bundle.displayName} set.
               </Text>
            )}

            {/* Tombol sekarang memanggil fungsi handleViewDetailsPress */}
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8} onPress={handleViewDetailsPress}>
                <MaterialCommunityIcons name="web" size={20} color={COLORS.white} />
                <Text style={styles.ctaText}>VIEW IN STORE</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  bgImage: { position: 'absolute', width: width, height: height * 0.7, resizeMode: 'cover' },
  gradient: { position: 'absolute', width: width, height: height, top: 0 },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { flexGrow: 1, paddingBottom: 40 },
  spacer: { height: height * 0.5 },
  
  infoBox: { padding: 25, alignItems: 'center' },
  title: { fontSize: 36, fontFamily: FONTS.bold, color: COLORS.white, textAlign: 'center', textShadowColor: COLORS.primary, textShadowOffset: {width: 0, height: 0}, textShadowRadius: 15 },
  divider: { width: 50, height: 4, backgroundColor: COLORS.primary, marginVertical: 20 },
  desc: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textPrimary, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  
  ctaButton: { 
    flexDirection: 'row',
    backgroundColor: COLORS.primary, 
    paddingHorizontal: 30, 
    paddingVertical: 15, 
    borderRadius: 8, 
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5 
  },
  ctaText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16, letterSpacing: 1, marginLeft: 10 }
});