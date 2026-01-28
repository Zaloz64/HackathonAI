import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// CHANGE THIS to your ngrok URL or local IP
const API_URL = 'https://beatriz-satisfiable-topologically.ngrok-free.dev';

// Personas with their allergies
const PERSONAS = [
  { id: 'saga', name: 'Saga', allergies: ['gluten', 'soy'] },
  { id: 'hugo', name: 'Hugo', allergies: ['milk', 'lactose'] },
  { id: 'hanna', name: 'Hanna', allergies: ['gluten', 'milk'] },
];

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
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('scan'); // 'friends', 'scan', 'profile'
  const [selectedTopTab, setSelectedTopTab] = useState('persona'); // 'persona', 'dietary', 'events'
  const [selectedPersonas, setSelectedPersonas] = useState([]); // Selected persona IDs
  const [safetyResult, setSafetyResult] = useState(null); // { safe: bool, unsafeFor: [{name, reasons}] }

  // Toggle persona selection
  const togglePersona = (personaId) => {
    setSelectedPersonas(prev =>
      prev.includes(personaId)
        ? prev.filter(id => id !== personaId)
        : [...prev, personaId]
    );
    // Reset safety result when personas change
    setSafetyResult(null);
  };

  // Check if scanned product is safe for selected personas
  const checkSafetyForPersonas = (verdict) => {
    if (!verdict || selectedPersonas.length === 0) {
      setSafetyResult(null);
      return;
    }

    const unsafeFor = [];

    selectedPersonas.forEach(personaId => {
      const persona = PERSONAS.find(p => p.id === personaId);
      if (!persona) return;

      const reasons = [];

      // Check gluten
      if (persona.allergies.includes('gluten') && verdict.gluten?.contains) {
        reasons.push('Contains gluten');
      }
      if (persona.allergies.includes('gluten') && verdict.gluten?.traces) {
        reasons.push('May contain traces of gluten');
      }

      // Check milk/lactose
      if ((persona.allergies.includes('milk') || persona.allergies.includes('lactose')) && verdict.milk?.contains) {
        reasons.push('Contains milk');
      }
      if ((persona.allergies.includes('milk') || persona.allergies.includes('lactose')) && verdict.milk?.traces) {
        reasons.push('May contain traces of milk');
      }

      if (reasons.length > 0) {
        unsafeFor.push({ name: persona.name, reasons });
      }
    });

    setSafetyResult({
      safe: unsafeFor.length === 0,
      unsafeFor,
      checkedPersonas: selectedPersonas.map(id => PERSONAS.find(p => p.id === id)?.name).filter(Boolean)
    });
  };

  // Test backend connection
  const testConnection = async () => {
    setConnectionStatus('testing...');
    console.log(`[TEST] Testing connection to ${API_URL}/api/ping`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_URL}/api/ping`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('[TEST] Connection successful:', data);
        setConnectionStatus('Connected!');
        alert('Backend connected successfully!');
      } else {
        console.log('[TEST] Bad response:', response.status);
        setConnectionStatus(`Error: ${response.status}`);
      }
    } catch (error) {
      console.log('[TEST] Connection failed:', error.message);
      setConnectionStatus(`Failed: ${error.message}`);
      alert(`Cannot connect to backend!\n\nURL: ${API_URL}\nError: ${error.message}\n\nMake sure:\n1. Backend is running\n2. Phone and computer on same WiFi\n3. URL is correct`);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setScanning(false);
    setLoading(true);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${data}.json`,
        {
          headers: {
            'User-Agent': 'FoodScannerApp/1.0 (expo-app)',
          },
        }
      );
      const result = await response.json();

      if (result.status === 1) {
        setProduct(result.product);
        setProductModalVisible(true);
      } else {
        alert('Product not found in database');
      }
    } catch (error) {
      alert('Error fetching product information');
    } finally {
      setLoading(false);
    }
  };

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

  const viewSavedProduct = () => {
    if (product) {
      setProductModalVisible(true);
    } else {
      alert('No product scanned yet. Scan a product first!');
    }
  };

  const scanIngredients = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to scan ingredients');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.3, // Lower quality for faster upload
      base64: true,
      exif: false,
    });

    if (!result.canceled && result.assets[0].base64) {
      setLoading(true);
      setIngredientsImage(result.assets[0].uri);

      const startTime = Date.now();
      const imgSize = Math.round(result.assets[0].base64.length / 1024);

      console.log('\n========== APP SCAN START ==========');
      console.log(`[APP STEP 1] Image captured - Size: ${imgSize}KB`);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('[APP TIMEOUT] 60s timeout reached - aborting');
          controller.abort();
        }, 60000);

        console.log(`[APP STEP 2] ${Date.now() - startTime}ms - Sending to backend...`);

        const response = await fetch(`${API_URL}/api/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: result.assets[0].base64
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log(`[APP STEP 3] ${Date.now() - startTime}ms - Backend responded (status: ${response.status})`);

        if (response.ok) {
          const scanResult = await response.json();
          console.log(`[APP STEP 4] ${Date.now() - startTime}ms - Response parsed`);
          console.log(`[APP RESULT] Backend timing: ${scanResult.timing?.total_ms}ms`);
          console.log('========== APP SCAN COMPLETE ==========\n');

          setScannedIngredients({ raw: scanResult.text });
          const verdict = {
            gluten: scanResult.gluten,
            milk: scanResult.milk,
            method: scanResult.method,
            notes: scanResult.notes
          };
          setAllergenVerdict(verdict);

          // Check safety for selected personas
          checkSafetyForPersonas(verdict);

          // Don't open modal automatically, show result in main view
          // setIngredientsModalVisible(true);
        } else {
          const errorData = await response.json();
          console.log(`[APP ERROR] ${Date.now() - startTime}ms - ${JSON.stringify(errorData)}`);
          alert('Scan failed: ' + (errorData.message || errorData.error));
        }
      } catch (error) {
        console.log(`[APP ERROR] ${Date.now() - startTime}ms - ${error.name}: ${error.message}`);
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

  const analyzeAllergens = async () => {
    if (!scannedIngredients?.raw) {
      alert('No text to analyze');
      return;
    }

    setAnalyzingAllergens(true);

    try {
      // Add timeout for backend call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const classifyResponse = await fetch(`${API_URL}/api/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: scannedIngredients.raw }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (classifyResponse.ok) {
        const verdict = await classifyResponse.json();
        setAllergenVerdict(verdict);
      } else {
        alert('Failed to analyze allergens. Check if backend is running.');
      }
    } catch (classifyError) {
      if (classifyError.name === 'AbortError') {
        alert('Analysis timed out. The server may be slow.');
      } else {
        console.log('Classification failed:', classifyError.message);
        alert('Could not connect to server: ' + classifyError.message);
      }
    } finally {
      setAnalyzingAllergens(false);
    }
  };

  const viewScannedIngredients = () => {
    if (scannedIngredients) {
      setIngredientsModalVisible(true);
    } else {
      alert('No ingredients scanned yet. Scan ingredients first!');
    }
  };

  if (scanning) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerText}>Point at a barcode</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.closeButton, styles.cancelButton]}
          onPress={() => setScanning(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Pills */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.topPill, selectedTopTab === 'persona' && styles.topPillActive]}
          onPress={() => setSelectedTopTab('persona')}
        >
          <Text style={[styles.topPillText, selectedTopTab === 'persona' && styles.topPillTextActive]}>
            Persona ({selectedPersonas.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topPill, selectedTopTab === 'dietary' && styles.topPillActive]}
          onPress={() => setSelectedTopTab('dietary')}
        >
          <Text style={[styles.topPillText, selectedTopTab === 'dietary' && styles.topPillTextActive]}>
            Dietary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topPill, selectedTopTab === 'events' && styles.topPillActive]}
          onPress={() => setSelectedTopTab('events')}
        >
          <Text style={[styles.topPillText, selectedTopTab === 'events' && styles.topPillTextActive]}>
            Events (10)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Persona Selection Pills (shown when Persona tab is active) */}
      {selectedTopTab === 'persona' && (
        <View style={styles.personaBar}>
          {PERSONAS.map(persona => (
            <TouchableOpacity
              key={persona.id}
              style={[
                styles.personaPill,
                selectedPersonas.includes(persona.id) && styles.personaPillActive
              ]}
              onPress={() => togglePersona(persona.id)}
            >
              <Text style={[
                styles.personaPillText,
                selectedPersonas.includes(persona.id) && styles.personaPillTextActive
              ]}>
                {persona.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        ) : (
          <View style={styles.scanPreview}>
            {/* Show scanned image if available */}
            {ingredientsImage && (
              <Image
                source={{ uri: ingredientsImage }}
                style={styles.scannedImagePreview}
                blurRadius={4}
              />
            )}

            {/* Safety Result Overlay */}
            {safetyResult && selectedPersonas.length > 0 ? (
              <View style={styles.safetyOverlay}>
                {safetyResult.safe ? (
                  <>
                    <View style={styles.safeIcon}>
                      <Ionicons name="checkmark" size={60} color="#fff" />
                    </View>
                    <Text style={styles.safetyTitle}>
                      This is safe for {safetyResult.checkedPersonas?.join(', ')}
                    </Text>
                  </>
                ) : (
                  <>
                    <View style={styles.unsafeIcon}>
                      <Ionicons name="close" size={60} color="#fff" />
                    </View>
                    {safetyResult.unsafeFor.map((person, idx) => (
                      <View key={idx} style={styles.unsafeReasonContainer}>
                        <Text style={styles.safetyTitle}>
                          This is not safe for {person.name}:
                        </Text>
                        {person.reasons.map((reason, rIdx) => (
                          <Text key={rIdx} style={styles.unsafeReason}>• {reason}</Text>
                        ))}
                      </View>
                    ))}
                  </>
                )}

                {/* View details button */}
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => setIngredientsModalVisible(true)}
                >
                  <Text style={styles.viewDetailsText}>View full details</Text>
                </TouchableOpacity>
              </View>
            ) : ingredientsImage ? (
              <View style={styles.imageOverlay}>
                <Ionicons name="checkmark-circle" size={48} color="#34C759" />
                <Text style={styles.imageOverlayText}>Scan complete</Text>
                {selectedPersonas.length === 0 && (
                  <Text style={styles.selectPersonaHint}>Select a persona to check safety</Text>
                )}
              </View>
            ) : (
              <View style={styles.scanFrame}>
                <Ionicons name="camera-outline" size={64} color="#ccc" />
                <Text style={styles.scanHint}>Tap the scan button below</Text>
                <Text style={styles.scanSubHint}>to scan ingredients or barcode</Text>
                {selectedPersonas.length > 0 && (
                  <Text style={styles.selectedPersonasHint}>
                    Checking for: {selectedPersonas.map(id => PERSONAS.find(p => p.id === id)?.name).join(', ')}
                  </Text>
                )}
              </View>
            )}

            {/* View last scan */}
            {scannedIngredients && !safetyResult && (
              <TouchableOpacity
                style={styles.lastScanCard}
                onPress={() => setIngredientsModalVisible(true)}
              >
                <Ionicons name="document-text" size={20} color="#007AFF" />
                <Text style={styles.lastScanText}>View scan results</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('friends')}
        >
          <Ionicons
            name={activeTab === 'friends' ? 'people' : 'people-outline'}
            size={28}
            color={activeTab === 'friends' ? '#007AFF' : '#8E8E93'}
          />
          <Text style={[styles.navLabel, activeTab === 'friends' && styles.navLabelActive]}>Friends</Text>
        </TouchableOpacity>

        {/* Center Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={scanIngredients}
          onLongPress={startScanning}
          disabled={loading}
        >
          <View style={styles.scanButtonInner}>
            <Ionicons name="scan" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={28}
            color={activeTab === 'profile' ? '#007AFF' : '#8E8E93'}
          />
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={productModalVisible}
        onRequestClose={() => setProductModalVisible(false)}
      >
        <ScrollView style={styles.modalScrollView}>
          <View style={styles.productModalContainer}>
            {product?.image_url && (
              <Image source={{ uri: product.image_url }} style={styles.productImage} />
            )}

            <Text style={styles.productName}>{product?.product_name || 'Unknown Product'}</Text>

            {product?.brands && (
              <Text style={styles.productBrand}>Brand: {product.brands}</Text>
            )}

            {product?.nutrition_grades && (
              <View style={[styles.nutriScoreBadge, getNutriScoreColor(product.nutrition_grades)]}>
                <Text style={styles.nutriScoreText}>
                  Nutri-Score: {product.nutrition_grades.toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.sectionContent}>
                {product?.ingredients_text || 'No ingredients information available'}
              </Text>
            </View>

            {product?.nutriments && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nutrition (per 100g)</Text>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Energy:</Text>
                  <Text style={styles.nutrientValue}>{product.nutriments['energy-kcal_100g'] || '-'} kcal</Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Fat:</Text>
                  <Text style={styles.nutrientValue}>{product.nutriments.fat_100g || '-'} g</Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Saturated Fat:</Text>
                  <Text style={styles.nutrientValue}>{product.nutriments['saturated-fat_100g'] || '-'} g</Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Carbs:</Text>
                  <Text style={styles.nutrientValue}>{product.nutriments.carbohydrates_100g || '-'} g</Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Sugars:</Text>
                  <Text style={styles.nutrientValue}>{product.nutriments.sugars_100g || '-'} g</Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Protein:</Text>
                  <Text style={styles.nutrientValue}>{product.nutriments.proteins_100g || '-'} g</Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Salt:</Text>
                  <Text style={styles.nutrientValue}>{product.nutriments.salt_100g || '-'} g</Text>
                </View>
              </View>
            )}

            {product?.allergens_tags && product.allergens_tags.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Allergens</Text>
                <Text style={styles.allergenText}>
                  {product.allergens_tags.map(a => a.replace('en:', '')).join(', ')}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setProductModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={ingredientsModalVisible}
        onRequestClose={() => setIngredientsModalVisible(false)}
      >
        <ScrollView style={styles.modalScrollView}>
          <View style={styles.productModalContainer}>
            <Text style={styles.productName}>Scanned Text</Text>

            {ingredientsImage && (
              <Image source={{ uri: ingredientsImage }} style={styles.productImage} />
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extracted Text</Text>
              <Text style={styles.sectionContent}>
                {scannedIngredients?.raw || 'No text extracted'}
              </Text>
            </View>

            {!allergenVerdict && (
              <TouchableOpacity
                style={[styles.button, styles.analyzeButton]}
                onPress={analyzeAllergens}
                disabled={analyzingAllergens}
              >
                {analyzingAllergens ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Analyze Allergens</Text>
                )}
              </TouchableOpacity>
            )}

            {allergenVerdict && (
              <>
                <Text style={styles.resultTitle}>Allergen Results</Text>

                {/* Gluten Section */}
                <View style={styles.allergenSection}>
                  <Text style={styles.allergenSectionTitle}>Gluten</Text>
                  <View style={styles.allergenRow}>
                    <View style={styles.allergenIndicator}>
                      <Text style={styles.allergenLabel}>Contains:</Text>
                      <View style={[styles.statusBadge, allergenVerdict.gluten?.contains ? styles.statusDanger : styles.statusSafe]}>
                        <Text style={styles.statusText}>{allergenVerdict.gluten?.contains ? 'YES' : 'NO'}</Text>
                      </View>
                    </View>
                    <View style={styles.allergenIndicator}>
                      <Text style={styles.allergenLabel}>Traces:</Text>
                      <View style={[styles.statusBadge, allergenVerdict.gluten?.traces ? styles.statusWarning : styles.statusSafe]}>
                        <Text style={styles.statusText}>{allergenVerdict.gluten?.traces ? 'YES' : 'NO'}</Text>
                      </View>
                    </View>
                  </View>
                  {allergenVerdict.gluten?.evidence?.length > 0 && (
                    <View style={styles.evidenceInline}>
                      {allergenVerdict.gluten.evidence.map((item, index) => (
                        <Text key={index} style={styles.evidenceTextSmall}>"{item}"</Text>
                      ))}
                    </View>
                  )}
                  <Text style={styles.confidenceSmall}>
                    Confidence: {Math.round((allergenVerdict.gluten?.confidence || 0) * 100)}%
                  </Text>
                </View>

                {/* Milk Section */}
                <View style={styles.allergenSection}>
                  <Text style={styles.allergenSectionTitle}>Milk</Text>
                  <View style={styles.allergenRow}>
                    <View style={styles.allergenIndicator}>
                      <Text style={styles.allergenLabel}>Contains:</Text>
                      <View style={[styles.statusBadge, allergenVerdict.milk?.contains ? styles.statusDanger : styles.statusSafe]}>
                        <Text style={styles.statusText}>{allergenVerdict.milk?.contains ? 'YES' : 'NO'}</Text>
                      </View>
                    </View>
                    <View style={styles.allergenIndicator}>
                      <Text style={styles.allergenLabel}>Traces:</Text>
                      <View style={[styles.statusBadge, allergenVerdict.milk?.traces ? styles.statusWarning : styles.statusSafe]}>
                        <Text style={styles.statusText}>{allergenVerdict.milk?.traces ? 'YES' : 'NO'}</Text>
                      </View>
                    </View>
                  </View>
                  {allergenVerdict.milk?.evidence?.length > 0 && (
                    <View style={styles.evidenceInline}>
                      {allergenVerdict.milk.evidence.map((item, index) => (
                        <Text key={index} style={styles.evidenceTextSmall}>"{item}"</Text>
                      ))}
                    </View>
                  )}
                  <Text style={styles.confidenceSmall}>
                    Confidence: {Math.round((allergenVerdict.milk?.confidence || 0) * 100)}%
                  </Text>
                </View>

                {/* Notes */}
                {allergenVerdict.notes && (
                  <Text style={styles.notesText}>{allergenVerdict.notes}</Text>
                )}

                <Text style={styles.methodText}>Method: {allergenVerdict.method}</Text>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setIngredientsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const getNutriScoreColor = (grade) => {
  const colors = {
    a: { backgroundColor: '#038141' },
    b: { backgroundColor: '#85BB2F' },
    c: { backgroundColor: '#FECB02' },
    d: { backgroundColor: '#EE8100' },
    e: { backgroundColor: '#E63E11' },
  };
  return colors[grade?.toLowerCase()] || { backgroundColor: '#666' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Top Navigation Pills
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
    backgroundColor: '#fff',
  },
  topPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
  },
  topPillActive: {
    backgroundColor: '#007AFF',
  },
  topPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  topPillTextActive: {
    color: '#fff',
  },
  // Main Content Area
  mainContent: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  scanPreview: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#333',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scannedImagePreview: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  imageOverlayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  scanFrame: {
    alignItems: 'center',
  },
  scanHint: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginTop: 15,
  },
  scanSubHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  lastScanCard: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  lastScanText: {
    fontSize: 14,
    color: '#333',
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#007AFF',
  },
  scanButton: {
    marginTop: -30,
  },
  scanButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  // Legacy styles for modals
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#34C759',
  },
  ingredientButton: {
    backgroundColor: '#FF9500',
  },
  analyzeButton: {
    backgroundColor: '#5856D6',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    width: '60%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  scannerText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  modalScrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productModalContainer: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  nutriScoreBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  nutriScoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#333',
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  allergenText: {
    fontSize: 14,
    color: '#E63E11',
    fontWeight: '500',
  },
  ingredientItem: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  ingredientBullet: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  allergenVerdictContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 20,
  },
  allergenBadge: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  allergenDanger: {
    backgroundColor: '#E63E11',
  },
  allergenSafe: {
    backgroundColor: '#038141',
  },
  allergenBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  confidenceBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    minWidth: 40,
  },
  fallbackWarning: {
    fontSize: 12,
    color: '#FF9500',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  evidenceItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  evidenceText: {
    fontSize: 13,
    color: '#333',
    fontStyle: 'italic',
  },
  allergenSection: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  allergenSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  allergenRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  allergenIndicator: {
    alignItems: 'center',
  },
  allergenLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  statusDanger: {
    backgroundColor: '#E63E11',
  },
  statusWarning: {
    backgroundColor: '#FF9500',
  },
  statusSafe: {
    backgroundColor: '#038141',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  evidenceInline: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  evidenceTextSmall: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  confidenceSmall: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  methodText: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});
