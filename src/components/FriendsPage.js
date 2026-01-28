import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FriendsList from "./FriendsList";
import { getFriendsOf } from "../config/people";

const CURRENT_USER_ID = "hugo";

export default function FriendsPage({ onBack, onOpenFriend }) {
  const friends = getFriendsOf ? getFriendsOf(CURRENT_USER_ID) : [
    { id: "hanna", name: "Hanna Knulsson", username: "hannak" },
    { id: "nils", name: "Nils Bredin", username: "nilsb" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={22} color="#F4F0E2" />
          <Text style={styles.backText}>Events</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Your Friends</Text>
        <View style={{ width: 72 }} />
      </View>

      <FriendsList
        friends={friends.map((f) => ({
          id: f.id,
          name: f.name,
          subtitle: f.username ? `@${f.username}` : undefined,
        }))}
        onAddPress={() => console.log("Add friend")}
        onOpenFriend={(friendRow) => onOpenFriend?.(friendRow)}
        maxHeight="auto"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F0E2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: "#5F8A5F",
    borderBottomWidth: 1,
    borderBottomColor: "#9DBB97",
    marginBottom: 0,
  },
  backBtn: { flexDirection: "row", alignItems: "center", width: 72 },
  backText: { fontSize: 14, fontWeight: "700", color: "#F4F0E2" },
  title: { fontSize: 18, fontWeight: "800", color: "#F4F0E2" },
});
