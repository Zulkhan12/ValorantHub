import { COLORS, FONTS, TOURNAMENTS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const YEARS = ["ALL", "2025", "2024", "2023", "2022", "2021"];

export default function MapScreen() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [webviewKey, setWebviewKey] = useState(0); 

  useEffect(() => {
    setWebviewKey(prev => prev + 1);
  }, [selectedYear]);

  const displayTournaments = selectedYear === "ALL" 
    ? TOURNAMENTS 
    : TOURNAMENTS.filter(t => t.year === selectedYear);

  const markersScript = displayTournaments.map(t => 
    `
    var marker${t.id} = L.marker([${t.lat}, ${t.lng}], { icon: valoIcon }).addTo(map);
    var popupContent = \`
      <div style="text-align:center; min-width: 150px;">
        <b style="font-size:16px; color:#FFFFFF; text-transform:uppercase; letter-spacing:1px;">${t.name}</b>
        <br>
        <span style="font-size:12px; color:#768079;">${t.location} (${t.year})</span>
        <div style="margin: 10px 0; height:1px; background-color:#333;"></div>
        <span style="color:#D4AF37; font-weight:bold; font-size:14px;">🏆 ${t.winner}</span>
        <br><br>
        <button 
          onclick="window.ReactNativeWebView.postMessage(JSON.stringify({ id: ${t.id} }))"
          style="background-color:#FF4655; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer; width:100%; letter-spacing:1px;">
          VIEW DETAILS
        </button>
      </div>
    \`;
    marker${t.id}.bindPopup(popupContent);
    `
  ).join('');

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background-color: #0F1923; }
        #map { height: 100vh; width: 100%; }
        .leaflet-popup-content-wrapper { background-color: #1F2326; color: #ECE8E1; border: 1px solid #FF4655; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.8); }
        .leaflet-popup-tip { background-color: #1F2326; border-top: 1px solid #FF4655; border-left: 1px solid #FF4655; }
        .leaflet-popup-close-button { color: #FF4655 !important; }
        .valo-marker { background-color: #FF4655; border: 2px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px #FF4655; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // PERBAIKAN: Tambahkan minZoom: 2 untuk membatasi zoom-out
        var map = L.map('map', {
            zoomControl: false, 
            attributionControl: false,
            minZoom: 2 
        }).setView([20, 0], 2); 
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
            subdomains: 'abcd', 
            maxZoom: 19 
        }).addTo(map);

        var valoIcon = L.divIcon({ className: 'custom-icon', html: '<div class="valo-marker" style="width:16px; height:16px;"></div>', iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -10] });
        ${markersScript}
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    if (isNavigating) return; 
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.id) {
        setIsNavigating(true);
        const selectedTournament = TOURNAMENTS.find(t => t.id === data.id);
        if (selectedTournament) {
          setTimeout(() => {
            const encodedData = encodeURIComponent(JSON.stringify(selectedTournament));
            router.push({ pathname: '/details/tournament', params: { data: encodedData } });
            setTimeout(() => setIsNavigating(false), 1000);
          }, 50);
        }
      }
    } catch (e) {
      console.log("Error parsing map message", e);
      setIsNavigating(false);
    }
  };

  return (
    <View style={styles.container}>
      {isNavigating && <View style={styles.overlay}><ActivityIndicator size="large" color={COLORS.primary} /></View>}
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>TOURNAMENT MAP</Text>
        <Text style={styles.subHeader}>Explore Global Championship Locations</Text>
      </SafeAreaView>

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

      <View style={styles.mapContainer}>
        <WebView
          key={webviewKey}
          originWhitelist={['*']}
          source={{ html: leafletHTML }}
          style={styles.map}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 25, 35, 0.7)', zIndex: 999, justifyContent: 'center', alignItems: 'center' },
  header: { paddingBottom: 10, paddingHorizontal: 20, backgroundColor: COLORS.background, paddingTop: 10 },
  headerTitle: { fontSize: 28, color: COLORS.white, fontFamily: FONTS.bold },
  subHeader: { fontFamily: FONTS.regular, color: COLORS.textSecondary, fontSize: 14, marginTop: -5 },
  
  filterContainer: { marginBottom: 10, height: 40 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.cardBg, marginRight: 10, borderWidth: 1, borderColor: '#333' },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 12 },
  filterTextActive: { color: COLORS.white },

  mapContainer: { flex: 1, overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#000' },
  map: { flex: 1, backgroundColor: COLORS.background }
});