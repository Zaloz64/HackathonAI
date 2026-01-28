import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import FriendsList from "./FriendsList";
import EventsList from "./EventsList";
import { getFriendsOf, getEventsOf } from "../config/people"; // adjust path if needed

const CURRENT_USER_ID = "hugo"; // later replace with real auth user id

export default function SocialsPage({ onOpenFriend }) {
  const friends = useMemo(() => getFriendsOf(CURRENT_USER_ID), []);
  const events = useMemo(() => getEventsOf(CURRENT_USER_ID), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FriendsList
          friends={friends.map((f) => ({
            id: f.id,
            name: f.name,
            subtitle: `@${f.username}`,
          }))}
          onAddPress={() => console.log("Add friend")}
          onOpenFriend={(friendRow) => {
            // friendRow.id is the person's id
            onOpenFriend?.({ id: friendRow.id });
          }}
        />

        <EventsList
          upcomingEvents={events.upcoming}
          pastEvents={events.past}
          onAddPress={() => console.log("Add event")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF8", paddingHorizontal: 16, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 10 },
  content: { paddingBottom: 90 },
});
