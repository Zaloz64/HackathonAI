import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  cream: '#F4F0E2',
  greenDark: '#5F8A5F',
  greenMid: '#9DBB97',
  greenLight: '#9FBE9A',
  text: '#333',
  logout: '#2B1F1A', // dark brown / charcoal
};

export default function ProfilePage() {
  const [allergies, setAllergies] = useState(['Gluten', 'Lactose']);
  const [dietary, setDietary] = useState(['High Protein', 'Low Sugar']);
  const [dislikes, setDislikes] = useState(['Mushrooms', 'Cilantro']);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTarget, setModalTarget] = useState(null); // 'allergies' | 'dietary' | 'dislikes'
  const [inputValue, setInputValue] = useState('');

  const modalTitle = useMemo(() => {
    if (modalTarget === 'allergies') return 'Add Allergy';
    if (modalTarget === 'dietary') return 'Add Dietary Preference';
    if (modalTarget === 'dislikes') return 'Add Dislike';
    return 'Add';
  }, [modalTarget]);

  const openAddModal = (target) => {
    setModalTarget(target);
    setInputValue('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalTarget(null);
    setInputValue('');
  };

  const normalize = (s) => s.trim().replace(/\s+/g, ' ');

  const addItem = () => {
    const value = normalize(inputValue);
    if (!value) return;

    const addUnique = (arrSetter, arr) => {
      const exists = arr.some((x) => x.toLowerCase() === value.toLowerCase());
      if (exists) return;
      arrSetter([...arr, value]);
    };

    if (modalTarget === 'allergies') addUnique(setAllergies, allergies);
    if (modalTarget === 'dietary') addUnique(setDietary, dietary);
    if (modalTarget === 'dislikes') addUnique(setDislikes, dislikes);

    closeModal();
  };

  const removeItem = (target, item) => {
    const removeFrom = (setter, arr) => setter(arr.filter((x) => x !== item));

    if (target === 'allergies') removeFrom(setAllergies, allergies);
    if (target === 'dietary') removeFrom(setDietary, dietary);
    if (target === 'dislikes') removeFrom(setDislikes, dislikes);
  };

  const Tag = ({ label, variant, onRemove }) => (
    <View style={[profileStyles.tagBase, profileStyles[`tag_${variant}`]]}>
      <Text style={[profileStyles.tagTextBase, profileStyles[`tagText_${variant}`]]}>
        {label}
      </Text>

      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.8}
        style={profileStyles.tagRemoveBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="close"
          size={14}
          color={variant === 'soft' ? '#444' : variant === 'neutral' ? COLORS.greenDark : '#D63031'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ScrollView style={profileStyles.container}>
        <View style={profileStyles.header}>
          <View style={profileStyles.avatarWrap}>
            <View style={profileStyles.avatar}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>

            <TouchableOpacity style={profileStyles.qrBadge} activeOpacity={0.85}>
              <Ionicons name="qr-code-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={profileStyles.name}>My Profile</Text>
          <Text style={profileStyles.email}>user@example.com</Text>
        </View>

        {/* Allergies */}
        <View style={[profileStyles.section, profileStyles.sectionTight]}>
          <View style={profileStyles.sectionHeaderRow}>
            <Text style={profileStyles.sectionTitle}>My Allergies</Text>
            <TouchableOpacity onPress={() => openAddModal('allergies')} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={22} color={COLORS.greenDark} />
            </TouchableOpacity>
          </View>

          <View style={profileStyles.tagsRow}>
            {allergies.map((a) => (
              <Tag
                key={`allergy-${a}`}
                label={a}
                variant="danger"
                onRemove={() => removeItem('allergies', a)}
              />
            ))}
          </View>
        </View>

        {/* Dietary */}
        <View style={[profileStyles.section, profileStyles.sectionTight]}>
          <View style={profileStyles.sectionHeaderRow}>
            <Text style={profileStyles.sectionTitle}>Dietary Preferences</Text>
            <TouchableOpacity onPress={() => openAddModal('dietary')} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={22} color={COLORS.greenDark} />
            </TouchableOpacity>
          </View>

          <View style={profileStyles.tagsRow}>
            {dietary.map((d) => (
              <Tag
                key={`dietary-${d}`}
                label={d}
                variant="neutral"
                onRemove={() => removeItem('dietary', d)}
              />
            ))}
          </View>
        </View>

        {/* Dislikes */}
        <View style={[profileStyles.section, profileStyles.sectionTight]}>
          <View style={profileStyles.sectionHeaderRow}>
            <Text style={profileStyles.sectionTitle}>Dislikes</Text>
            <TouchableOpacity onPress={() => openAddModal('dislikes')} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={22} color={COLORS.greenDark} />
            </TouchableOpacity>
          </View>

          <View style={profileStyles.tagsRow}>
            {dislikes.map((d) => (
              <Tag
                key={`dislike-${d}`}
                label={d}
                variant="soft"
                onRemove={() => removeItem('dislikes', d)}
              />
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={profileStyles.menuItem} activeOpacity={0.85}>
            <Ionicons name="person-circle-outline" size={24} color={COLORS.text} />
            <Text style={profileStyles.menuItemText}>Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.menuItem} activeOpacity={0.85}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <Text style={profileStyles.menuItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.menuItem} activeOpacity={0.85}>
            <Ionicons name="shield-outline" size={24} color={COLORS.text} />
            <Text style={profileStyles.menuItemText}>Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.menuItem} activeOpacity={0.85}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.text} />
            <Text style={profileStyles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.menuItem} activeOpacity={0.85}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.text} />
            <Text style={profileStyles.menuItemText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          {/* Log out as a settings row (no big red button) */}
          <TouchableOpacity
            style={[profileStyles.menuItem, profileStyles.menuItemLast]}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.logout} />
            <Text style={[profileStyles.menuItemText, { color: COLORS.logout }]}>Log Out</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* <View style={{ height: 60 }} /> */}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={closeModal}>
        <Pressable style={profileStyles.modalBackdrop} onPress={closeModal} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={profileStyles.modalCenter}
        >
          <View style={profileStyles.modalCard}>
            <View style={profileStyles.modalHeader}>
              <Text style={profileStyles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={closeModal} activeOpacity={0.8}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={profileStyles.modalHint}>Type a value and tap Add.</Text>

            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g. Nuts / Vegan / Shrimp"
              placeholderTextColor="#888"
              style={profileStyles.modalInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={addItem}
            />

            <View style={profileStyles.modalActions}>
              <TouchableOpacity
                onPress={closeModal}
                style={profileStyles.btnSecondary}
                activeOpacity={0.85}
              >
                <Text style={profileStyles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addItem}
                style={profileStyles.btnPrimary}
                activeOpacity={0.85}
              >
                <Text style={profileStyles.btnPrimaryText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: COLORS.greenDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greenMid,
  },

  avatarWrap: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.greenLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.cream },
  email: { fontSize: 14, color: '#d4d0c2', marginTop: 5 },

  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  sectionTight: {
    marginTop: 0,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },

  tagBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagTextBase: { fontWeight: '500' },

  tag_danger: { backgroundColor: '#FFE5E5', borderColor: '#FF6B6B' },
  tagText_danger: { color: '#D63031' },

  tag_neutral: { backgroundColor: '#E8F0E4', borderColor: COLORS.greenMid },
  tagText_neutral: { color: COLORS.greenDark },

  tag_soft: { backgroundColor: '#F2F2F2', borderColor: '#D6D6D6' },
  tagText_soft: { color: '#444' },

  tagRemoveBtn: {
    marginLeft: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 15,
  },

  // Modal
  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  modalHint: {
    color: '#555',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  btnSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
  },
  btnSecondaryText: {
    color: '#333',
    fontWeight: '600',
  },
  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORS.greenDark,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
