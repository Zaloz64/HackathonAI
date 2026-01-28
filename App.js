import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const OCR_API_KEY = 'K85329702488957'; // Free OCR.space API key
const API_URL = 'http://localhost:3001'; // Backend URL - change for production

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
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setLoading(true);
      setIngredientsImage(result.assets[0].uri);

      try {
        const formData = new FormData();
        formData.append('base64Image', `data:image/jpeg;base64,${result.assets[0].base64}`);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', '2');

        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            'apikey': OCR_API_KEY,
          },
          body: formData,
        });

        const ocrResult = await response.json();

        if (ocrResult.ParsedResults && ocrResult.ParsedResults[0]) {
          const extractedText = ocrResult.ParsedResults[0].ParsedText;
          setScannedIngredients({ raw: extractedText });

          // Call backend for allergen classification
          try {
            const classifyResponse = await fetch(`${API_URL}/api/classify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text: extractedText }),
            });

            if (classifyResponse.ok) {
              const verdict = await classifyResponse.json();
              setAllergenVerdict(verdict);
            } else {
              // Backend error - use null to indicate classification failed
              setAllergenVerdict(null);
            }
          } catch (classifyError) {
            console.log('Classification failed:', classifyError.message);
            setAllergenVerdict(null);
          }

          setIngredientsModalVisible(true);
        } else {
          alert('Could not extract text from image. Try again with better lighting.');
        }
      } catch (error) {
        alert('Error processing image: ' + error.message);
      } finally {
        setLoading(false);
      }
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
    <View style={styles.container}>
      <Text style={styles.title}>Food Scanner</Text>
      <Text style={styles.subtitle}>Scan products to see ingredients</Text>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      <TouchableOpacity style={styles.button} onPress={startScanning} disabled={loading}>
        <Text style={styles.buttonText}>Scan Barcode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.ingredientButton]} onPress={scanIngredients} disabled={loading}>
        <Text style={styles.buttonText}>Scan Ingredients</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.viewButton, (!product && !scannedIngredients) && styles.buttonDisabled]}
        onPress={() => {
          if (scannedIngredients) {
            viewScannedIngredients();
          } else if (product) {
            viewSavedProduct();
          } else {
            alert('No product or ingredients scanned yet!');
          }
        }}
        disabled={(!product && !scannedIngredients) || loading}
      >
        <Text style={styles.buttonText}>View Last Scan</Text>
      </TouchableOpacity>

      {product && (
        <Text style={styles.savedText}>Product: {product.product_name || 'Unknown'}</Text>
      )}
      {scannedIngredients && (
        <Text style={styles.savedText}>Ingredients scanned!</Text>
      )}

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
            <Text style={styles.productName}>Allergen Analysis</Text>

            {ingredientsImage && (
              <Image source={{ uri: ingredientsImage }} style={styles.productImage} />
            )}

            {allergenVerdict ? (
              <>
                <View style={styles.allergenVerdictContainer}>
                  <View style={[styles.allergenBadge, allergenVerdict.has_gluten ? styles.allergenDanger : styles.allergenSafe]}>
                    <Text style={styles.allergenBadgeText}>
                      Gluten: {allergenVerdict.has_gluten ? 'YES' : 'NO'}
                    </Text>
                  </View>
                  <View style={[styles.allergenBadge, allergenVerdict.has_milk ? styles.allergenDanger : styles.allergenSafe]}>
                    <Text style={styles.allergenBadgeText}>
                      Milk: {allergenVerdict.has_milk ? 'YES' : 'NO'}
                    </Text>
                  </View>
                </View>

                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confidence:</Text>
                  <View style={styles.confidenceBar}>
                    <View style={[styles.confidenceFill, { width: `${allergenVerdict.confidence * 100}%` }]} />
                  </View>
                  <Text style={styles.confidenceValue}>{Math.round(allergenVerdict.confidence * 100)}%</Text>
                </View>

                {allergenVerdict.method === 'keyword_fallback' && (
                  <Text style={styles.fallbackWarning}>Using keyword detection (backend unavailable)</Text>
                )}

                {allergenVerdict.evidence && allergenVerdict.evidence.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Evidence</Text>
                    {allergenVerdict.evidence.map((item, index) => (
                      <View key={index} style={styles.evidenceItem}>
                        <Text style={styles.evidenceText}>"{item}"</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Classification Unavailable</Text>
                <Text style={styles.sectionContent}>
                  Could not classify allergens. Make sure the backend server is running.
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extracted Text</Text>
              <Text style={styles.sectionContent}>
                {scannedIngredients?.raw || 'No text extracted'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setIngredientsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <StatusBar style="auto" />
    </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
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
  savedText: {
    marginTop: 20,
    color: '#34C759',
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
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
});
