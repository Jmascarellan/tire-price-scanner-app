import { ActionButton } from '@/components/ActionButton';
import { AddNeumForm } from '@/components/AddNeumForm';
import { ImagePreview } from '@/components/ImagePreview';
import { ManualInputForm } from '@/components/ManualInputForm';
import { useResetStore } from '@/hooks/useResetStore';
import { styles } from '@/styles/ScanScreen.styles';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

import {
  Camera,
  Image as ImageIcon,
  Circle as XCircle,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const LogoBW = require('../../assets/images/logoBlackAndW.png');

const WEBHOOK_URL =
  'https://primary-production-45a8.up.railway.app/webhook/909fb171-eba4-443c-936a-8cd1a29d0cad';

interface TireData {
  nombre: string;
  medida: string;
  precio: string;
  marca: string;
}

interface ScanState {
  selectedImage: string | null;
  isLoading: boolean;
  result: TireData[] | null;
  error: string | null;
}

export default function ScanScreen() {
  const [state, setState] = useState<ScanState>({
    selectedImage: null,
    isLoading: false,
    result: null,
    error: null,
  });

  const [quantity, setQuantity] = useState(2);
  const [montaje, setMontaje] = useState(20);
  const [neumFee, setNeumFee] = useState(12);
  const [showSettings, setShowSettings] = useState(false);
  const [exportDescriptionModal, setExportDescriptionModal] = useState(false);
  const [roundingEnabled, setRoundingEnabled] = useState(true);
  const [neumNetPrice, setNeumNetPrice] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const [modeloSeleccionado, setModeloSeleccionado] = useState<{
    [marca: string]: number;
  }>({});
  const [desplegado, setDesplegado] = useState<{ [marca: string]: boolean }>(
    {}
  );

  const [measurements, setMeasurements] = useState('');
  const [moreSpeed, setMoreSpeed] = useState(false);
  const [velocityCode, setVelocityCode] = useState('');
  const [velocityCode2, setVelocityCode2] = useState('');

  const [analizedImage, setAnalizedImage] = useState(false);
  const [isVelocityCodeY, setIsVelocityCodeY] = useState(false);
  const [exportDescription, setExportDescription] = useState('');
  const [exportCapture, setExportCapture] = useState(false);

  const allBrands = [
    'MICHELIN',
    'BRIDGESTONE',
    'CONTINENTAL',
    'DUNLOP',
    'GOODYEAR',
    'PIRELLI',
    'YOKOHAMA',
    'COOPER',
    'FIRESTONE',
    'HANKOOK',
    'KLEBER',
    'KUMHO',
    'RADAR',
    'TOYO',
    'UNIROYAL',
    'VREDESTEIN',
    'NANKANG',
    'LANVIGATOR',
    'TRACMAX',
    'DAVANTI',
    'KORMORAN',
    'ANTARES',
    'COMFOSER',
    'DOUBLE COIN',
    'GOODRIDE',
    'KAPSEN',
    'NEXEN',
    'PETLAS',
    'ROADCRUZA',
    'SUNNY',
    'VIKING',
  ];

  const ALL_BRANDS = ['TODAS', ...allBrands];

  const [marcasFiltradas, setMarcasFiltradas] = useState<string[]>([
    'LANVIGATOR',
    'KUMHO',
    'FIRESTONE',
    'HANKOOK',
    'CONTINENTAL',
    'MICHELIN',
  ]);

  const marcasRenderizadas = React.useMemo(() => {
    if (!state.result) return [];

    const marcasSet = new Set<string>();
    state.result.forEach((item) => {
      if (item?.json?.marca) {
        marcasSet.add(item.json.marca);
      }
    });

    return Array.from(marcasSet).sort();
  }, [state.result]);

  const [pendingRequests, setPendingRequests] = useState(0);

  const toggleMarca = (marca: string) => {
    if (marca === 'TODAS') {
      if (marcasFiltradas.length === allBrands.length) {
        // Si todas estaban seleccionadas, deseleccionarlas
        setMarcasFiltradas([]);
      } else {
        // Seleccionar todas
        setMarcasFiltradas([...allBrands]);
      }
    } else {
      setMarcasFiltradas((prev) => {
        const nuevaLista = prev.includes(marca)
          ? prev.filter((m) => m !== marca)
          : [...prev, marca];

        return nuevaLista;
      });
    }
  };

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (state.selectedImage && !state.result && !state.isLoading) {
      analyzeImage();
    }
  }, [state.selectedImage]);

  useEffect(() => {
    if (!state.result) return;
    setMarcasFiltradas((prev) =>
      prev.filter(
        (marca) => marca === 'TODAS' || marcasRenderizadas.includes(marca)
      )
    );
  }, [state.result]);

  const viewShotRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Necesitamos acceso a tu galería para seleccionar imágenes.'
      );
    }
  };

  const updateState = (updates: Partial<ScanState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetScan = () => {
    setState({
      selectedImage: null,
      isLoading: false,
      result: null,
      error: null,
    });
    setQuantity(2);
    setMeasurements('');
    setVelocityCode('');
    setVelocityCode2('');
    setMoreSpeed(false);
    setAnalizedImage(false);
    setMontaje(20);
    setNeumFee(12);
    setRoundingEnabled(true);
    setShowSettings(false);
    setShowFilter(false);
    setShowKeyboard(false);
    setModeloSeleccionado({});
    setDesplegado({});
    setIsVelocityCodeY(false);
    setNeumNetPrice(false);
    setExportDescription('');
    setExportCapture(false);
    setMarcasFiltradas([
      'LANVIGATOR',
      'KUMHO',
      'FIRESTONE',
      'HANKOOK',
      'CONTINENTAL',
      'MICHELIN',
    ]);
  };
  const shouldReset = useResetStore((state) => state.shouldReset);
  const clearReset = useResetStore((state) => state.clearReset);

  useEffect(() => {
    if (shouldReset) {
      resetScan(); // tu función local
      setShowKeyboard(false);
      setModeloSeleccionado({});
      setDesplegado({});
      clearReset();
    }
  }, [shouldReset]);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos acceso a la cámara para tomar fotos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        updateState({
          selectedImage: imageUri,
          error: null,
          result: null,
        });
      }
    } catch (error) {
      updateState({
        error: 'Error al acceder a la cámara. Inténtalo de nuevo.',
      });
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        updateState({
          selectedImage: imageUri,
          error: null,
          result: null,
        });
      }
    } catch (error) {
      updateState({
        error: 'Error al acceder a la galería. Inténtalo de nuevo.',
      });
    }
  };

  const submitManualMeasure = async (medida: string) => {
    setPendingRequests((prev) => prev + 1);
    updateState({ isLoading: true, error: null });

    if (!measurements) {
      setMeasurements(medida);
      const velocity = formatMeasurementVelocityCode(medida);
      setVelocityCode(velocity);
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medida }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0]?.json?.content === 'LECTURA INCORRECTA.'
      ) {
        updateState({
          error:
            'La medida ingresada no arrojó resultados. Verifica los valores.',
          isLoading: false,
        });
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        setShowKeyboard(false);

        // 🔁 FUSIÓN de resultados con los existentes
        setState((prev) => {
          const existing = prev.result || [];
          const nuevos = data;

          const combinadosUnicos = [
            ...existing,
            ...nuevos.filter((nuevo) => {
              return !existing.some(
                (ex) =>
                  ex.json?.nombre === nuevo.json?.nombre &&
                  ex.json?.precio === nuevo.json?.precio &&
                  ex.json?.marca === nuevo.json?.marca
              );
            }),
          ];

          return {
            ...prev,
            result: combinadosUnicos,
            selectedImage: null,
          };
        });

        // Si hay demasiados resultados, lanzar búsqueda por marcas premium
        if (
          data.length > 49 &&
          !medida.includes('CONTINENTAL') &&
          !medida.includes('MICHELIN')
        ) {
          // Inicia las búsquedas premium
          submitManualMeasure(medida + 'CONTINENTAL');
          submitManualMeasure(medida + 'MICHELIN');
        }

        return;
      }

      updateState({
        error: 'No se encontraron resultados para la medida ingresada.',
      });
    } catch (error) {
      updateState({
        error: 'Error al buscar los neumáticos. Verifica tu conexión.',
      });
    } finally {
      setPendingRequests((prev) => {
        const updated = prev - 1;
        if (updated === 0) {
          updateState({ isLoading: false }); // ✅ Solo aquí termina el "analizando..."
        }
        return updated;
      });
    }
  };

  const analyzeImage = async () => {
    if (!state.selectedImage) return;

    updateState({ isLoading: true, error: null });
    setAnalizedImage(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: state.selectedImage,
        type: 'image/jpeg',
        name: 'tire.jpg',
      } as any);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0]?.json?.content === 'LECTURA INCORRECTA.'
      ) {
        updateState({
          error: 'Lectura incorrecta.\nIntenta con otra imagen más clara.',
          isLoading: false,
        });
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        const nombre = data[0]?.json?.nombre || '';
        console.log('nombre', nombre);
        const formatedMeasurement = formatMeasurementForInput(nombre);
        console.log('formatedMeasurement', formatedMeasurement);
        setMeasurements(formatedMeasurement); // ✅ Guarda la medida detectada

        const velocity = formatMeasurementVelocityCode(formatedMeasurement);
        setVelocityCode(velocity);

        setState((prev) => {
          const existing = prev.result || [];
          const nuevos = data;

          const combinadosUnicos = [
            ...existing,
            ...nuevos.filter((nuevo) => {
              return !existing.some(
                (ex) =>
                  ex.json?.nombre === nuevo.json?.nombre &&
                  ex.json?.precio === nuevo.json?.precio &&
                  ex.json?.marca === nuevo.json?.marca
              );
            }),
          ];

          return {
            ...prev,
            result: combinadosUnicos,
            isLoading: false,
          };
        });

        return;
      }

      updateState({
        error: 'No se encontraron resultados. Intenta con otra imagen.',
        isLoading: false,
      });
    } catch (error) {
      console.error('Error al analizar imagen:', error);
      updateState({
        error:
          'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.',
        isLoading: false,
      });
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const agruparPorMarca = (items: TireData[]) => {
    const grupos: { [marca: string]: TireData[] } = {};

    for (const item of items) {
      const marca = item.json?.marca || 'Desconocida';
      if (!grupos[marca]) grupos[marca] = [];
      grupos[marca].push(item);
    }

    // Ordenar todos los modelos por precio ascendente dentro de cada marca
    Object.entries(grupos).forEach(([marca, modelos]) => {
      grupos[marca] = modelos.sort((a, b) => {
        const precioA = parseFloat(
          a.json?.precio?.replace('€', '').replace(',', '.') || '0'
        );
        const precioB = parseFloat(
          b.json?.precio?.replace('€', '').replace(',', '.') || '0'
        );
        return precioA - precioB;
      });
    });

    return grupos;
  };

  const formatMeasurementForInput = (input: string) => {
    const regex = /(\d{3})\/(\d{2})R(\d{2})\s(\d{2,3})([A-Z])/i;
    const match = input.match(regex);

    if (!match) return input;

    const [, ancho, perfil, rin, indice, velocidad] = match;
    return `${ancho}/${perfil}/${rin}/${indice}/${velocidad}`;
  };

  const formatMeasurement = (input: string) => {
    const parts = input.split('/');

    const [ancho, perfil, rin, indice, velocidad] = parts;

    let medida = `${ancho}/${perfil} R${rin}`;

    if (indice && velocidad) {
      medida += ` ${indice}${velocidad}`;
    } else if (indice) {
      medida += ` ${indice}`;
    }

    return medida;
  };

  const formatMeasurementVelocityCode = (input: string) => {
    const parts = input.split('/');

    const [ancho, perfil, rin, indice, velocidad] = parts;

    if (!ancho || !perfil || !rin || !indice || !velocidad || velocidad === 'Y')
      return input;

    // Escalado de velocidad: H → V → W → Y
    const escalado = {
      T: 'H',
      H: 'V',
      V: 'W',
      W: 'Y',
    };

    const nextCode = escalado[velocidad.toUpperCase()];
    if (!nextCode) return `${ancho}/${perfil}/${rin}/${indice}/${velocidad}`;

    return `${ancho}/${perfil}/${rin}/${indice}/${nextCode}`;
  };

  const handleMoreSpeed = () => {
    if (velocityCode2) {
      setMoreSpeed(true);
    } else if (velocityCode) {
      const velocityCodeNext = formatMeasurementVelocityCode(velocityCode);
      setVelocityCode2(velocityCodeNext);
      setVelocityCode(velocityCodeNext);
    }
  };

  const isSpeedCodeY = (medida: string): boolean => {
    const parts = medida.split('/');
    const velocidad = parts[4]; // índice 4 es el código de velocidad

    return velocidad?.toUpperCase() === 'Y';
  };

  const captureBudget = async () => {
    try {
      if (!viewShotRef.current) return;

      setIsCapturing(true); // 👉 Oculta botones antes de capturar

      // Esperar al siguiente frame para asegurar que el DOM actualizó
      await new Promise((resolve) => setTimeout(resolve, 100));

      const uri = await viewShotRef.current.capture();

      setIsCapturing(false); // 👉 Volver a mostrar los botones

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert(
          'Presupuesto generado',
          'No se puede compartir, pero puedes guardarlo manualmente desde la app.'
        );
      }
    } catch (error) {
      setIsCapturing(false); // Asegura que vuelva a su estado si hay error
      console.error('Error capturando presupuesto:', error);
      Alert.alert('Error', 'No se pudo generar el presupuesto.');
    }
  };

  const saveBudgetCapture = async () => {
    try {
      if (!viewShotRef.current) return;

      setIsCapturing(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const uri = await viewShotRef.current.capture();
      setIsCapturing(false);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'No se pudo guardar la imagen. Permiso denegado.'
        );
        return;
      }

      await MediaLibrary.createAssetAsync(uri);
      Alert.alert(
        'Imagen guardada',
        'El presupuesto fue guardado en tu galería correctamente.'
      );
    } catch (error) {
      setIsCapturing(false);
      console.error('Error al guardar imagen:', error);
      Alert.alert('Error', 'No se pudo guardar el presupuesto en la galería.');
    }
  };

  const captureBudgetHandle = () => {
    setExportDescriptionModal(true);
  };

  const saveBudgetCaptureHandle = () => {
    setExportCapture(true);
    setExportDescriptionModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Escáner de Neumáticos</Text>
          {measurements && (
            <Text style={styles.title}>{formatMeasurement(measurements)}</Text>
          )}
        </View>

        {state.error && (
          <View style={styles.errorContainer}>
            <XCircle size={20} color="#EF4444" strokeWidth={2} />
            <Text style={styles.errorText}>{state.error}</Text>
          </View>
        )}

        {!state.selectedImage && !state.isLoading && !state.result ? (
          <View style={styles.actionContainer}>
            <ActionButton
              icon={<ImageIcon size={24} color="#2563EB" strokeWidth={2} />}
              title="Seleccionar de Galería"
              subtitle="Elegir imagen existente"
              onPress={pickImage}
              variant="secondary"
            />
            <ActionButton
              icon={<Camera size={24} color="#FFFFFF" strokeWidth={2} />}
              title="Tomar Foto"
              subtitle="Usar cámara"
              onPress={takePhoto}
              variant="primary"
            />
            <ActionButton
              title="Ingresar Medida Manualmente"
              subtitle=""
              onPress={() => setShowKeyboard((prev) => !prev)}
              variant="secondary"
            />
            {showKeyboard && <ManualInputForm onSubmit={submitManualMeasure} />}
          </View>
        ) : (
          <View style={styles.imageSection}>
            {state.selectedImage && (
              <ImagePreview uri={state.selectedImage} onRetake={resetScan} />
            )}

            <View style={styles.counterContainer}>
              <Text style={styles.counterTitle}>¿Cuántos neumáticos?</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setQuantity((prev) => Math.max(0, prev - 1))}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.counterValue}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setQuantity((prev) => Math.min(4, prev + 1))}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingsControls}>
              <TouchableOpacity
                style={styles.settingContainerButton}
                onPress={() => setShowSettings(true)}
              >
                <Text style={{ fontSize: 22, color: '#2563EB' }}>
                  ⚙️ Ajustes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingContainerButton}
                onPress={() => setShowFilter(true)}
              >
                <Text style={{ fontSize: 22, color: '#2563EB' }}>
                  Filtrar Marcas
                </Text>
              </TouchableOpacity>
            </View>

            {state.isLoading && (
              <View style={styles.loadingSection}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Analizando neumático...</Text>
                <Text style={styles.loadingSubtext}>
                  Esto puede tomar unos segundos
                </Text>
              </View>
            )}

            {state.result && quantity !== 0 && (
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'png', quality: 1 }}
              >
                {isCapturing && (
                  <View style={styles.logoContainer}>
                    <Text style={styles.titleExport}>Presupuesto</Text>
                    <Text style={styles.titleExport}>MAYU GARAGE</Text>
                    <Text style={styles.subtitleExport}>
                      {exportDescription}
                    </Text>
                  </View>
                )}

                <View style={styles.resultContainer}>
                  {(() => {
                    const grupos = agruparPorMarca(state.result);
                    return Object.entries(grupos).map(([marca, modelos]) => {
                      if (!marcasFiltradas.includes(marca)) return null;

                      const seleccionadoIndex = modeloSeleccionado[marca] ?? 0;
                      const seleccionado = modelos[seleccionadoIndex];
                      const nombre =
                        seleccionado.json?.nombre || 'Modelo desconocido';
                      const precioStr = seleccionado.json?.precio || '0';
                      const precioNum =
                        parseFloat(
                          precioStr.replace('€', '').replace(',', '.')
                        ) || 0;

                      let totalNeumNet = precioNum * quantity;

                      let total =
                        precioNum * quantity +
                        montaje * quantity +
                        neumFee * quantity;
                      if (roundingEnabled) {
                        total = Math.ceil(total / 5) * 5;
                      }

                      return (
                        <View key={marca} style={styles.resultCard}>
                          <Text style={styles.resultText}>🛞 {marca}</Text>
                          {neumNetPrice ? (
                            <Text style={styles.finalPrice}>
                              {quantity}xNeum = {totalNeumNet.toFixed(2)} €
                            </Text>
                          ) : (
                            <Text style={styles.finalPrice}>
                              {quantity}xNeum + Montaje (Precio final) ={' '}
                              {total.toFixed(2)} €
                            </Text>
                          )}
                          <Text style={styles.resultDetail}>{nombre}</Text>
                          {modelos.length > 1 && !isCapturing && (
                            <>
                              {!isCapturing && !desplegado[marca] ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    setDesplegado((prev) => ({
                                      ...prev,
                                      [marca]: true,
                                    }))
                                  }
                                >
                                  <Text style={styles.extraModelsText}>
                                    + {modelos.length - 1} modelos elegibles
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    <TouchableOpacity
                                      onPress={() =>
                                        setDesplegado((prev) => ({
                                          ...prev,
                                          [marca]: false,
                                        }))
                                      }
                                    >
                                      <Text style={styles.aspaButton}>✕</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.variantList}>
                                    {modelos.map((item, index) => {
                                      if (index === seleccionadoIndex)
                                        return null;
                                      const nombreAlt =
                                        item.json?.nombre ||
                                        'Modelo alternativo';
                                      const precioAlt =
                                        item.json?.precio || '0';
                                      const precioNumAlt =
                                        parseFloat(
                                          precioAlt
                                            .replace('€', '')
                                            .replace(',', '.')
                                        ) || 0;

                                      let totalNeumNetAlt =
                                        precioNumAlt * quantity;
                                      let totalAlt =
                                        precioNumAlt * quantity +
                                        montaje * quantity +
                                        neumFee * quantity;
                                      if (roundingEnabled) {
                                        totalAlt = Math.ceil(totalAlt / 5) * 5;
                                      }
                                      return (
                                        <TouchableOpacity
                                          key={index}
                                          style={styles.variantItem}
                                          onPress={() => {
                                            setModeloSeleccionado((prev) => ({
                                              ...prev,
                                              [marca]: index,
                                            }));
                                            setDesplegado((prev) => ({
                                              ...prev,
                                              [marca]: false,
                                            }));
                                          }}
                                        >
                                          <Text style={styles.variantText}>
                                            • {nombreAlt} {'\n'}
                                            {neumNetPrice ? (
                                              <Text style={styles.finalPrice}>
                                                {totalNeumNetAlt.toFixed(2)} €
                                              </Text>
                                            ) : (
                                              <Text style={styles.finalPrice}>
                                                {totalAlt.toFixed(2)} €
                                              </Text>
                                            )}
                                          </Text>
                                        </TouchableOpacity>
                                      );
                                    })}
                                  </View>
                                </View>
                              )}
                            </>
                          )}
                        </View>
                      );
                    });
                  })()}
                </View>
              </ViewShot>
            )}
          </View>
        )}

        {state.result && !state.isLoading && (
          <>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={captureBudgetHandle}
            >
              <Text style={styles.exportButtonText}>
                📤 Exportar Presupuesto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={saveBudgetCaptureHandle}
            >
              <Text style={styles.exportButtonText}>
                💾 Guardar Presupuesto
              </Text>
            </TouchableOpacity>
          </>
        )}

        {state.isLoading && state.result && (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Busqueda afinada...</Text>
            <Text style={styles.loadingSubtext}>
              Esto puede tomar unos segundos
            </Text>
          </View>
        )}

        {!state.isLoading &&
          measurements &&
          !moreSpeed &&
          velocityCode &&
          !isVelocityCodeY && (
            <View style={styles.actionContainer}>
              <ActionButton
                title="Añadir neumáticos con código de velocidad superior"
                subtitle={velocityCode}
                onPress={() => {
                  submitManualMeasure(velocityCode);
                  setIsVelocityCodeY(isSpeedCodeY(velocityCode));
                  handleMoreSpeed();
                }}
                variant="secondary"
              />
            </View>
          )}

        {!state.isLoading && measurements && (
          <View style={styles.actionContainer}>
            <ActionButton
              title="+Añadir más medidas manualmente+"
              subtitle=""
              onPress={() => setShowKeyboard((prev) => !prev)}
              variant="secondary"
            />
            {showKeyboard && (
              <AddNeumForm
                baseMeasurement={measurements}
                onSubmit={submitManualMeasure}
              />
            )}
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            💡 Consejos para mejores resultados:
          </Text>
          <Text style={styles.infoText}>
            • Asegúrate de que la medida del neumático esté bien iluminada{'\n'}
            • Mantén la cámara estable y enfocada{'\n'}• La medida suele estar
            en el lateral del neumático{'\n'}• Ejemplo de formato: "205/55 R16
            91V"{'\n'}• Cuando se rendericen los resultados podras configurar
            las marcas a mostrar en el presupuesto, su modelo y la cantidad en
            base a tus necesidades.{'\n'}• Cuando tengas listo tu presupuesto
            exporta el presupuesto para enviar a tu cliente.
          </Text>
        </View>

        <Modal
          visible={showSettings}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSettings(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajustes de Presupuesto</Text>

              <View style={styles.modalColumn}>
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.modalOptionText}>
                    Mostrar solo precio neto de neumáticos
                  </Text>
                  <Switch
                    value={neumNetPrice}
                    onValueChange={setNeumNetPrice}
                    trackColor={{ false: '#ccc', true: '#2563EB' }}
                    thumbColor={roundingEnabled ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View>
                  <Text style={styles.modalOptionText}>
                    Redondear precios al alza
                  </Text>
                  <Switch
                    value={roundingEnabled}
                    onValueChange={setRoundingEnabled}
                    trackColor={{ false: '#ccc', true: '#2563EB' }}
                    thumbColor={neumNetPrice ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>

              {!neumNetPrice && (
                <>
                  <View style={styles.modalColumn}>
                    <Text style={styles.modalOptionText}>
                      Precio de Montaje: {montaje} €
                    </Text>
                    <Slider
                      style={{ width: '100%', height: 50 }}
                      minimumValue={0}
                      maximumValue={40}
                      step={1}
                      value={montaje}
                      onValueChange={setMontaje}
                      minimumTrackTintColor="#2563EB"
                      maximumTrackTintColor="#ccc"
                    />
                  </View>

                  <View style={styles.modalColumn}>
                    <Text style={styles.modalOptionText}>
                      Tasa por Neumático: {neumFee} €
                    </Text>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={30}
                      step={1}
                      value={neumFee}
                      onValueChange={setNeumFee}
                      minimumTrackTintColor="#2563EB"
                      maximumTrackTintColor="#ccc"
                    />
                  </View>
                </>
              )}
              <TouchableOpacity
                onPress={() => setShowSettings(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showFilter}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFilter(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selección de Marcas</Text>

              <ScrollView style={{ maxHeight: 500 }}>
                {state.result ? (
                  ['TODAS', ...marcasRenderizadas].map((marca) => (
                    <TouchableOpacity
                      key={marca}
                      onPress={() => toggleMarca(marca)}
                      style={[
                        styles.modalRow,
                        {
                          backgroundColor: marcasFiltradas.includes(marca)
                            ? '#DBEAFE'
                            : 'transparent',
                        },
                      ]}
                    >
                      <Text style={styles.modalOptionText}>{marca}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.modalOptionText}>
                    Cargando resultados...{'\n'}
                  </Text>
                )}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowFilter(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={exportDescriptionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setExportDescriptionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Descripción del Cliente</Text>

              {/* Input keyboard for export description */}
              <TextInput
                style={styles.modalInput}
                placeholder="Descripción del Cliente"
                value={exportDescription}
                onChangeText={setExportDescription}
                maxLength={30}
              />
              <TouchableOpacity
                onPress={() => {
                  if (!exportDescription.trim()) {
                    Alert.alert(
                      'Falta la descripción',
                      'Introduce una descripción antes de exportar.'
                    );
                    return;
                  }

                  setExportDescriptionModal(false);

                  // Esperar a que se cierre el modal visualmente
                  setTimeout(() => {
                    if (exportCapture) {
                      saveBudgetCapture();
                      setExportCapture(false);
                    } else {
                      captureBudget();
                    }
                  }, 500);
                }}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>
                  Confirmar y Generar Presupuesto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setExportDescriptionModal(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
