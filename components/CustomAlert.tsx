import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ visible, title, message, onClose }) => {
  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Mengganti LinearGradient dengan View biasa */}
        <View style={styles.alertBox}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.primary} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 25, 35, 0.8)', // Background redup
  },
  alertBox: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 12, // Sedikit lebih tajam
    padding: 25,
    // PERBAIKAN: Background Hitam Pekat
    backgroundColor: COLORS.cardBg, 
    borderWidth: 1,
    borderColor: '#333', // Border abu-abu gelap
    // Efek bayangan agar terlihat melayang
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginLeft: 10,
  },
  message: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 25,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});