import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPersonById } from "../config/people";

const COLORS = {
  cream: '#F4F0E2',
  greenDark: '#5F8A5F',
  greenMid: '#9DBB97',
  greenLight: '#9FBE9A',
  text: '#333',
};

function capitalize(s) {
  const str = String(s || "");
  return str.length ? str[0].toUpperCase() + str.slice(1) : str;
}

export default function FriendProfile({ friendId, onBack }) {
  const person = useMemo(() => getPersonById(friendId), [friendId]);
  if (!person) return null;

  const firstName = person.name?.split(" ")[0] || "Friend";

  const Tag = ({ label, variant }) => (
    <View style={[s.tagBase, s[`tag_${variant}`]]}>
      <Text style={[s.tagTextBase, s[`tagText_${variant}`]]}>{label}</Text>
      {variant === 'danger' && (
        <Ionicons name="warning" size={12} color="#D63031" style={{ marginLeft: 6 }} />
      )}
    </View>
  );

  return (
    <ScrollView style={s.container}>
      {/* Header with avatar */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={20} color="#F4F0E2" />
          <Text style={s.backText}>Friends</Text>
        </TouchableOpacity>

        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Ionicons name="person" size={60} color="#fff" />
          </View>
          <View style={s.qrBadge}>
            <Ionicons name="qr-code-outline" size={16} color="#fff" />
          </View>
        </View>

        <Text style={s.name}>{person.name}</Text>
        <Text style={s.email}>@{person.username}</Text>
      </View>

      {/* Allergies */}
      <View style={[s.section, s.sectionTight]}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>{firstName}'s Allergies</Text>
        </View>
        <View style={s.tagsRow}>
          {(person.allergies?.length ? person.allergies : ["None"]).map((a) => (
            <Tag
              key={`allergy-${a}`}
              label={a === "None" ? "None" : capitalize(a)}
              variant={a === "None" ? "soft" : "danger"}
            />
          ))}
        </View>
      </View>

      {/* Dietary Profile */}
      <View style={[s.section, s.sectionTight]}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>Dietary Preferences</Text>
        </View>
        <View style={s.tagsRow}>
          {(person.dietaryProfile?.length ? person.dietaryProfile : ["None"]).map((d) => (
            <Tag
              key={`diet-${d}`}
              label={d}
              variant={d === "None" ? "soft" : "neutral"}
            />
          ))}
        </View>
      </View>

      {/* Dislikes */}
      <View style={[s.section, s.sectionTight]}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>Dislikes</Text>
        </View>
        <View style={s.tagsRow}>
          {(person.dislikes?.length ? person.dislikes : ["None"]).map((d) => (
            <Tag
              key={`dislike-${d}`}
              label={d}
              variant={d === "None" ? "soft" : "soft"}
            />
          ))}
        </View>
      </View>

      {/* Favorites */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{firstName}'s Favorites</Text>
        <View style={s.favGrid}>
          {(person.favorites?.length ? person.favorites : Array.from({ length: 6 }, (_, i) => ({ id: `p-${i}` }))).map((f) => (
            <View key={f.id} style={s.favTile}>
              <Ionicons name="heart-outline" size={16} color="#fff" style={s.heart} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
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

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backText: { fontSize: 14, fontWeight: '700', color: '#F4F0E2' },

  avatarWrap: {
    position: 'relative',
    marginBottom: 15,
    marginTop: 10,
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
  sectionTight: { marginTop: 0 },

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

  favGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginTop: 8 },
  favTile: { width: '31.5%', aspectRatio: 1, borderRadius: 12, backgroundColor: COLORS.greenMid, position: 'relative', overflow: 'hidden' },
  heart: { position: 'absolute', top: 8, right: 8, opacity: 0.9 },
});
