import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';


// Services
import { fetchProduct, scanIngredientsImage, classifyAllergens } from './src/services/api';

// Utils
import { checkSafetyForPersonas } from './src/utils/helpers';

// Components
import {
  Scanner,
  TopNavigation,
  PersonaBar,
  MainContent,
  BottomNavigation,
  ProductModal,
  IngredientsModal,
  ProfilePage,
  EventsPage,
  SocialsPage,
  FriendProfile,
  FriendsPage
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
  const [selectedTopTab, setSelectedTopTab] = useState('persona');
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  const [safetyResult, setSafetyResult] = useState(null);
  //const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  


  // Toggle persona selection
  const togglePersona = (personaId) => {
    setSelectedPersonas(prev =>
      prev.includes(personaId)
        ? prev.filter(id => id !== personaId)
        : [...prev, personaId]
    );
    setSafetyResult(null);
  };

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
          method: scanResult.method,
          notes: scanResult.notes
        };
        setAllergenVerdict(verdict);

        // Check safety for selected personas
        const safety = checkSafetyForPersonas(verdict, selectedPersonas);
        setSafetyResult(safety);
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
            onAddEvent={() => console.log("Add event")}
            onOpenFriends={() => setActiveTab("friends")}
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
      default:
        return (
          <>
            <TopNavigation
              selectedTab={selectedTopTab}
              onSelectTab={setSelectedTopTab}
              personaCount={selectedPersonas.length}
            />

            {selectedTopTab === 'persona' && (
              <PersonaBar
                selectedPersonas={selectedPersonas}
                onTogglePersona={togglePersona}
              />
            )}

            <MainContent
              loading={loading}
              ingredientsImage={ingredientsImage}
              safetyResult={safetyResult}
              selectedPersonas={selectedPersonas}
              scannedIngredients={scannedIngredients}
              onViewDetails={() => setIngredientsModalVisible(true)}
            />
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        onAnalyzeAllergens={analyzeAllergens}
        onClose={() => setIngredientsModalVisible(false)}
      />

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
