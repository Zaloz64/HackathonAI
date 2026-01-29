import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FriendsList({
  friends = [],
  onAddPress,
  onOpenFriend,
  maxHeight = 170,
  searchPlaceholder = "Search friends",
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;

    return friends.filter((f) => {
      const name = String(f.name || "").toLowerCase();
      const sub = String(f.subtitle || "").toLowerCase();
      return name.includes(q) || sub.includes(q);
    });
  }, [friends, query]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#8E8E93" />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
          />

          {!!query && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearBtn}
              activeOpacity={0.85}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Add friend */}
        <TouchableOpacity style={styles.addButton} onPress={onAddPress} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, maxHeight }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 6 }}
      >
        {filtered.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            style={styles.row}
            onPress={() => onOpenFriend?.(friend)}
            activeOpacity={0.85}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={18} color="#8E8E93" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.primaryText}>{friend.name}</Text>
              {!!friend.subtitle && <Text style={styles.secondaryText}>{friend.subtitle}</Text>}
            </View>

            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={22} color="#8E8E93" />
            <Text style={styles.emptyText}>No friends found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: null,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: null,
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 0,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  clearBtn: { marginLeft: 6 },

  addButton: {
    backgroundColor: "#243526",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { fontSize: 12, fontWeight: "800", color: "#FFFFFF" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: null,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 2000,
    backgroundColor: null,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    marginRight: 10,
  },
  primaryText: { fontSize: 14, fontWeight: "700", color: "#111" },
  secondaryText: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  emptyState: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  emptyText: { fontSize: 13, fontWeight: "700", color: "#8E8E93" },
});
