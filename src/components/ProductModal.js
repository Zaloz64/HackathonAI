import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { getNutriScoreColor } from '../utils/helpers';
import { styles } from '../styles/styles';

export default function ProductModal({ visible, product, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
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
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}
