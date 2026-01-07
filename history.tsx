import { CircleCheck as CheckCircle, Clock, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ScanRecord {
  id: string;
  measure: string;
  timestamp: Date;
  confidence: number;
}

export default function HistoryScreen() {
  const [scanHistory] = useState<ScanRecord[]>([

  ]);

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#10B981';
    if (confidence >= 0.8) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Escaneos</Text>
        <Text style={styles.subtitle}>
          Revisa todos los neumáticos escaneados
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {scanHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.emptyTitle}>Historial no implemantado</Text>
            <Text style={styles.emptyText}>
              Los neumáticos que escanees aparecerán aquí
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {scanHistory.map((record) => (
              <View key={record.id} style={styles.historyItem}>
                <View style={styles.itemHeader}>
                  <View style={styles.measureContainer}>
                    <CheckCircle 
                      size={20} 
                      color={getConfidenceColor(record.confidence)} 
                      strokeWidth={2} 
                    />
                    <Text style={styles.measureText}>{record.measure}</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteButton}>
                    <Trash2 size={18} color="#6B7280" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.itemFooter}>
                  <Text style={styles.timestampText}>
                    {formatTimestamp(record.timestamp)}
                  </Text>
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceLabel}>Confianza:</Text>
                    <Text 
                      style={[
                        styles.confidenceValue,
                        { color: getConfidenceColor(record.confidence) }
                      ]}
                    >
                      {Math.round(record.confidence * 100)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  historyList: {
    gap: 12,
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  measureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  measureText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginRight: 4,
  },
  confidenceValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});