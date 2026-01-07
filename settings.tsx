import { ChevronRight, CircleHelp as HelpCircle, Info, Mail, Shield } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const showInfo = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const settingsOptions = [
    {
      id: 'about',
      title: 'Acerca de la App',
      subtitle: 'Información de la aplicación',
      icon: <Info size={20} color="#6B7280" strokeWidth={2} />,
      onPress: () => showInfo(
        'Escáner de Neumáticos v1.0',
        'Aplicación desarrollada para escanear y extraer medidas de neumáticos usando tecnología OCR avanzada.'
      ),
    },
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      subtitle: 'Preguntas frecuentes',
      icon: <HelpCircle size={20} color="#6B7280" strokeWidth={2} />,
      onPress: () => showInfo(
        'Ayuda',
        '1. Toma una foto clara del lateral del neumático\n2. Asegúrate de que la medida esté visible\n3. Espera el resultado del análisis\n4. Confirma si la medida es correcta'
      ),
    },
    {
      id: 'contact',
      title: 'Contacto',
      subtitle: 'Enviar comentarios',
      icon: <Mail size={20} color="#6B7280" strokeWidth={2} />,
      onPress: () => showInfo(
        'Contacto',
        'Para soporte técnico o comentarios, contacta con nuestro equipo de desarrollo.\nEmail: jopemasan87@gmail.com'
      ),
    },
    {
      id: 'privacy',
      title: 'Privacidad',
      subtitle: 'Política de privacidad',
      icon: <Shield size={20} color="#6B7280" strokeWidth={2} />,
      onPress: () => showInfo(
        'Privacidad',
        'Las imágenes se procesan de forma segura y no se almacenan permanentemente en nuestros servidores.'
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
        <Text style={styles.subtitle}>
          Ajustes y información de la aplicación
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.settingItem}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingIcon}>
                  {option.icon}
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
              </View>
            </TouchableOpacity>
          ))}
        </View>


        <View style={styles.versionSection}>
          <Text style={styles.versionText}>
            Versión 1.0.0 • Desarrollado con React Native + Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  webhookSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  webhookInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  webhookTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  webhookUrl: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
    marginBottom: 8,
  },
  webhookNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    lineHeight: 16,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});