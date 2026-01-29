import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';


// Services
import { fetchProduct, scanIngredientsImage, classifyAllergens } from './src/services/api';

// Utils
import { checkSafetyForPersonas, checkSafetyForDiet, checkSafetyForEvent } from './src/utils/helpers';

// Components
import {
  Scanner,
  MainContent,
  BottomNavigation,
  ProductModal,
  IngredientsModal,
  ProfilePage,
  EventsPage,
  SocialsPage,
  FriendProfile,
  FriendsPage,
  EventDetailPage,
  ScanSettingsModal,
  ShoppingList,
} from './src/components';

// Styles
import { styles } from './src/styles/styles';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [scannedIngredients, setScannedIngredients] = useState(null);
  const [allergenVerdict, setAllergenVerdict] = useState(null);
  const [ingredientsImage, setIngredientsImage] = useState(null);
  const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false);
  const [analyzingAllergens, setAnalyzingAllergens] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  const [safetyResult, setSafetyResult] = useState(null);
  //const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scanSubTab, setScanSubTab] = useState('scanner'); // 'scanner' | 'shopping'


  // Toggle persona selection
  const togglePersona = (personaId) => {
    setSelectedPersonas(prev =>
      prev.includes(personaId)
        ? prev.filter(id => id !== personaId)
        : [...prev, personaId]
    );
  };

  const toggleAllergen = (allergen) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleEvent = (eventId) => {
    setSelectedEventId(prev => (prev === eventId ? null : eventId));
  };

  // Recalculate safety when selection or allergen verdict updates
  useEffect(() => {
    if (allergenVerdict && selectedPersonas.length > 0) {
      const safety = checkSafetyForPersonas(allergenVerdict, selectedPersonas);
      setSafetyResult(safety);
    } else if (allergenVerdict && selectedAllergens.length > 0) {
      const safety = checkSafetyForDiet(allergenVerdict, selectedAllergens);
      setSafetyResult(safety);
    } else if (allergenVerdict && selectedEventId) {
      const safety = checkSafetyForEvent(allergenVerdict, selectedEventId);
      setSafetyResult(safety);
    } else {
      setSafetyResult(null);
    }
  }, [selectedPersonas, selectedAllergens, selectedEventId, allergenVerdict]);

  // Handle barcode scan
  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setScanning(false);
    setLoading(true);

    try {
      const productData = await fetchProduct(data);
      setProduct(productData);
      setProductModalVisible(true);
    } catch (error) {
      alert(error.message || 'Error fetching product information');
    } finally {
      setLoading(false);
    }
  };

  // Start barcode scanning
  const startScanning = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        alert('Camera permission is required to scan products');
        return;
      }
    }
    setScanned(false);
    setScanning(true);
  };

  // Scan ingredients photo
  const scanIngredients = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to scan ingredients');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.3,
      base64: true,
      exif: false,
    });

    if (!result.canceled && result.assets[0].base64) {
      setLoading(true);
      setIngredientsImage(result.assets[0].uri);

      try {
        const scanResult = await scanIngredientsImage(result.assets[0].base64);
        setScannedIngredients({ raw: scanResult.text });

        const verdict = {
          gluten: scanResult.gluten,
          milk: scanResult.milk,
          soy: scanResult.soy,
          eggs: scanResult.eggs,
          nuts: scanResult.nuts,
          lactose: scanResult.lactose,
          method: scanResult.method,
          notes: scanResult.notes
        };
        setAllergenVerdict(verdict);
        // Safety result is now calculated by useEffect when allergenVerdict changes
      } catch (error) {
        if (error.name === 'AbortError') {
          alert('Request timed out after 60s. Check backend logs.');
        } else {
          alert('Error: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Analyze allergens from scanned text
  const analyzeAllergens = async () => {
    if (!scannedIngredients?.raw) {
      alert('No text to analyze');
      return;
    }

    setAnalyzingAllergens(true);

    try {
      const verdict = await classifyAllergens(scannedIngredients.raw);
      setAllergenVerdict(verdict);
    } catch (error) {
      if (error.name === 'AbortError') {
        alert('Analysis timed out. The server may be slow.');
      } else {
        alert('Could not connect to server: ' + error.message);
      }
    } finally {
      setAnalyzingAllergens(false);
    }
  };

  // Show scanner view
  if (scanning) {
    return (
      <Scanner
        scanned={scanned}
        onBarCodeScanned={handleBarCodeScanned}
        onCancel={() => setScanning(false)}
      />
    );
  }

  // Render page content based on active tab
  const renderPageContent = () => {
    switch (activeTab) {
      case "events":
        return (
          <EventsPage
            onOpenFriends={() => setActiveTab("friends")}
            onOpenEvent={(event) => {
              setSelectedEvent(event);
              setActiveTab("eventDetail");
            }}
          />
        );

      case "eventDetail":
        return (
          <EventDetailPage
            event={selectedEvent}
            onBack={() => setActiveTab("events")}
          />
        );

      case "friends":
        return (
          <FriendsPage
            onBack={() => setActiveTab("events")}
            onOpenFriend={(friend) => {
              setSelectedFriendId(friend.id);
              setActiveTab("friendProfile");
            }}
          />
        );

      case "friendProfile":
        return (
          <FriendProfile
            friendId={selectedFriendId}
            onBack={() => setActiveTab("friends")}
          />
        );
      case "profile":
        return <ProfilePage />;
      default: {
        const filterCount = selectedPersonas.length + selectedAllergens.length + (selectedEventId ? 1 : 0);
        return (
          <>
            {/* Header */}
            <View style={{
              backgroundColor: '#5F8A5F',
              paddingTop: 60,
              paddingBottom: 12,
              paddingHorizontal: 20,
            }}>
              {/* Title row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#F4F0E2' }}>Food Scanner</Text>
                <TouchableOpacity
                  onPress={() => setSettingsVisible(true)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#9DBB97', borderRadius: 20,
                    paddingHorizontal: 14, paddingVertical: 8, gap: 6,
                  }}
                >
                  <Ionicons name="options" size={16} color="#F4F0E2" />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#F4F0E2' }}>
                    Filters{filterCount > 0 ? ` (${filterCount})` : ''}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sub-tab toggle */}
              <View style={{
                flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)',
                borderRadius: 12, padding: 3,
              }}>
                <TouchableOpacity
                  style={{
                    flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
                    backgroundColor: scanSubTab === 'scanner' ? '#F4F0E2' : 'transparent',
                  }}
                  onPress={() => setScanSubTab('scanner')}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    fontSize: 14, fontWeight: '700',
                    color: scanSubTab === 'scanner' ? '#3D6B3D' : '#F4F0E2',
                  }}>Scanner</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
                    backgroundColor: scanSubTab === 'shopping' ? '#F4F0E2' : 'transparent',
                  }}
                  onPress={() => setScanSubTab('shopping')}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    fontSize: 14, fontWeight: '700',
                    color: scanSubTab === 'shopping' ? '#3D6B3D' : '#F4F0E2',
                  }}>Shopping List</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Content */}
            {scanSubTab === 'scanner' ? (
              <MainContent
                loading={loading}
                ingredientsImage={ingredientsImage}
                safetyResult={safetyResult}
                selectedPersonas={selectedPersonas}
                selectedAllergens={selectedAllergens}
                selectedEventId={selectedEventId}
                scannedIngredients={scannedIngredients}
                onViewDetails={() => setIngredientsModalVisible(true)}
              />
            ) : (
              <ShoppingList selectedPersonas={selectedPersonas} />
            )}
          </>
        );
      }
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {renderPageContent()}

      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onScanPress={scanIngredients}
        onScanLongPress={startScanning}
        loading={loading}
      />

      <ProductModal
        visible={productModalVisible}
        product={product}
        onClose={() => setProductModalVisible(false)}
      />

      <IngredientsModal
        visible={ingredientsModalVisible}
        ingredientsImage={ingredientsImage}
        scannedIngredients={scannedIngredients}
        allergenVerdict={allergenVerdict}
        analyzingAllergens={analyzingAllergens}
        safetyResult={safetyResult}
        onAnalyzeAllergens={analyzeAllergens}
        onClose={() => setIngredientsModalVisible(false)}
      />

      <ScanSettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        selectedPersonas={selectedPersonas}
        onTogglePersona={togglePersona}
        selectedAllergens={selectedAllergens}
        onToggleAllergen={toggleAllergen}
        selectedEventId={selectedEventId}
        onSelectEvent={toggleEvent}
      />

      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
