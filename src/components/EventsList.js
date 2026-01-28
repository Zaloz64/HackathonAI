import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EventsList({
  upcomingEvents = [],
  pastEvents = [],
  title = "My events",
  onAddPress,
  maxHeight = 220,
}) {
  const [expandedId, setExpandedId] = useState(null);

  const upcoming = useMemo(() => upcomingEvents, [upcomingEvents]);
  const past = useMemo(() => pastEvents, [pastEvents]);

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const renderEvent = (evt) => {
    const isExpanded = expandedId === evt.id;

    return (
      <View key={evt.id} style={{ marginBottom: 8 }}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => toggleExpand(evt.id)}
          activeOpacity={0.85}
        >
          <View style={styles.avatar}>
            <Ionicons name={evt.icon || "calendar-outline"} size={18} color="#8E8E93" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.primaryText}>{evt.title}</Text>
            {!!evt.when && <Text style={styles.secondaryText}>{evt.when}</Text>}
          </View>

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color="#C7C7CC"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expanded}>
            {!!evt.details && <Text style={styles.detailsText}>{evt.details}</Text>}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                <Ionicons name="share-outline" size={16} color="#007AFF" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                <Ionicons name="calendar-outline" size={16} color="#007AFF" />
                <Text style={styles.actionText}>Add to calendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>

        <TouchableOpacity style={styles.addButton} onPress={onAddPress} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>Add event</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Upcoming events</Text>
        {upcoming.map(renderEvent)}

        <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Past events</Text>
        {past.map(renderEvent)}

        <View style={{ height: 6 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EFEFF4",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 12, fontWeight: "700", color: "#111" },
  addButton: {
    backgroundColor: "#D1D1D6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addButtonText: { fontSize: 12, fontWeight: "700", color: "#111" },

  sectionTitle: { fontSize: 12, fontWeight: "700", color: "#111", marginBottom: 6 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5EA",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#D1D1D6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  primaryText: { fontSize: 14, fontWeight: "700", color: "#111" },
  secondaryText: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  expanded: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  detailsText: { fontSize: 13, color: "#111", marginBottom: 10 },

  actionRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  actionText: { marginLeft: 6, fontSize: 12, fontWeight: "700", color: "#111" },
});
