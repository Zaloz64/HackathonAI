import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { styles } from '../styles/styles';

export default function Scanner({ scanned, onBarCodeScanned, onCancel }) {
  return (
    <View style={styles.scannerContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        }}
        onBarcodeScanned={scanned ? undefined : onBarCodeScanned}
      />
      <View style={styles.scannerOverlay}>
        <View style={styles.scannerFrame} />
        <Text style={styles.scannerText}>Point at a barcode</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.closeButton, styles.cancelButton]}
        onPress={onCancel}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
