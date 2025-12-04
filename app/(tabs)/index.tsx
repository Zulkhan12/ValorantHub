import { COLORS, FONTS } from '@/constants/theme';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ROLES = ["ALL", "Duelist", "Initiator", "Controller", "Sentinel"];

export default function AgentsScreen() {
  const [agents, setAgents] = useState<any[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedRole === "ALL") {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent => agent.role?.displayName === selectedRole);
      setFilteredAgents(filtered);
    }
  }, [selectedRole, agents]);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
      setAgents(response.data.data);
      setFilteredAgents(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (item: any) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setTimeout(() => {
      const encodedData = encodeURIComponent(JSON.stringify(item));
      router.push({ pathname: '/details/agent', params: { data: encodedData } });
      setTimeout(() => setIsNavigating(false), 1000);
    }, 100);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => handlePress(item)}>
      <LinearGradient colors={[COLORS.cardBg, '#2A2E33']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient}>
        <Image source={{ uri: item.displayIcon }} style={styles.agentImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.agentName}>{item.displayName.toUpperCase()}</Text>
          <View style={styles.roleContainer}>
             <Text style={styles.agentRole}>{item.role?.displayName}</Text>
          </View>
          <Text numberOfLines={2} style={styles.agentDesc}>{item.description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isNavigating && <View style={styles.overlay}><ActivityIndicator size="large" color={COLORS.primary} /></View>}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VALORANT <Text style={{color: COLORS.primary}}>HUB</Text></Text>
        <Text style={styles.subHeader}>Select an agent to view details</Text>
      </View>

      {/* FILTER BAR */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20}}>
          {ROLES.map((role, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.filterChip, selectedRole === role && styles.filterChipActive]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[styles.filterText, selectedRole === role && styles.filterTextActive]}>{role}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <FlatList
          data={filteredAgents}
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
  header: { paddingHorizontal: 20, paddingBottom: 10, paddingTop: 10 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.white },
  subHeader: { fontFamily: FONTS.regular, color: COLORS.textSecondary, fontSize: 14, marginTop: -5 },
  
  // Styles Filter
  filterContainer: { marginBottom: 10, height: 40 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.cardBg, marginRight: 10, borderWidth: 1, borderColor: '#333' },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 12 },
  filterTextActive: { color: COLORS.white },

  listContent: { padding: 20, paddingTop: 10, paddingBottom: 100 },
  card: { marginBottom: 16, borderRadius: 16, overflow: 'hidden', elevation: 4, borderWidth: 1, borderColor: '#333' },
  cardGradient: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  agentImage: { width: 90, height: 90, resizeMode: 'contain' },
  infoContainer: { flex: 1, marginLeft: 15 },
  agentName: { color: COLORS.white, fontSize: 22, fontFamily: FONTS.bold, letterSpacing: 1 },
  roleContainer: { backgroundColor: 'rgba(255, 70, 85, 0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 6 },
  agentRole: { color: COLORS.primary, fontSize: 12, fontFamily: FONTS.semiBold, textTransform: 'uppercase' },
  agentDesc: { color: COLORS.textSecondary, fontSize: 12, fontFamily: FONTS.regular, lineHeight: 18 },
});