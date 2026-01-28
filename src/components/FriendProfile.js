import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPersonById } from "../config/people";

export default function FriendProfile({ friendId, onBack }) {
    const person = useMemo(() => getPersonById(friendId), [friendId]);
    if (!person) return null;

    const firstName = person.name?.split(" ")[0] || "Friend";

    return (
        <View style={styles.screen}>
            {/* Keep header fixed */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.85}>
                    <Ionicons name="chevron-back" size={20} color="#F4F0E2" />
                    <Text style={styles.backText}>Friends</Text>
                </TouchableOpacity>

                <Text style={styles.topTitle} numberOfLines={1}>
                    {person.name}
                </Text>

                <View style={{ width: 72 }} />
            </View>

            {/* Make content scrollable */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarWrap}>
                    <View style={styles.avatarCircle} />
                    <View style={styles.qrBadge}>
                        <Text style={styles.qrText}>QR</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.username}>@{person.username}</Text>
                    <Text style={styles.fullName}>{person.name}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{firstName}’s diet</Text>

                    <InfoRow label="Dietary profile">
                        {(person.dietaryProfile?.length ? person.dietaryProfile : ["None"]).map((t) => (
                            <Pill key={t} text={t} tone={t === "None" ? "muted" : "neutral"} />
                        ))}
                    </InfoRow>

                    <InfoRow label="Allergens">
                        {(person.allergies?.length ? person.allergies : ["None"]).map((a) => (
                            <Pill
                                key={a}
                                text={a === "None" ? "None" : capitalize(a)}
                                tone={a === "None" ? "muted" : "warn"}
                            />
                        ))}
                    </InfoRow>

                    <InfoRow label="Dislikes">
                        {(person.dislikes?.length ? person.dislikes : ["None"]).map((d) => (
                            <Pill key={d} text={d} tone={d === "None" ? "muted" : "neutral"} />
                        ))}
                    </InfoRow>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{firstName}’s favorites</Text>

                    <View style={styles.favGrid}>
                        {(person.favorites?.length ? person.favorites : Array.from({ length: 6 }, (_, i) => ({ id: `p-${i}` }))).map((f) => (
                            <View key={f.id} style={styles.favTile}>
                                <Ionicons name="heart-outline" size={16} color="#fff" style={styles.heart} />
                            </View>
                        ))}
                    </View>
                </View>

                {/* extra space so last card isn't tight to bottom */}
                <View style={{ height: 16 }} />
            </ScrollView>
        </View>
    );
}

function InfoRow({ label, children }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={styles.pills}>{children}</View>
        </View>
    );
}

function Pill({ text, tone = "neutral" }) {
    const style = toneStyles[tone] || toneStyles.neutral;
    return (
        <View style={[styles.pill, style.pill]}>
            <Text style={[styles.pillText, style.text]} numberOfLines={1}>
                {text}
            </Text>
            {tone === "warn" && (
                <Ionicons name="warning" size={12} color={style.text.color} style={{ marginLeft: 6 }} />
            )}
        </View>
    );
}

const toneStyles = {
    neutral: { pill: { backgroundColor: "#E8F0E4", borderWidth: 1, borderColor: "#9DBB97" }, text: { color: "#5F8A5F" } },
    warn: { pill: { backgroundColor: "#FFE5E5", borderWidth: 1, borderColor: "#FF6B6B" }, text: { color: "#D63031" } },
    muted: { pill: { backgroundColor: "#F2F2F2", borderWidth: 1, borderColor: "#D6D6D6" }, text: { color: "#999" } },
};

function capitalize(s) {
    const str = String(s || "");
    return str.length ? str[0].toUpperCase() + str.slice(1) : str;
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F4F0E2" },

    topBar: {
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
    topTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "800", color: "#F4F0E2" },

    scrollContent: { paddingBottom: 20, paddingHorizontal: 16 },

    avatarWrap: { alignItems: "center", marginTop: 20, marginBottom: 12 },
    avatarCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#9FBE9A" },
    qrBadge: {
        position: "absolute",
        right: 48,
        bottom: 8,
        width: 22,
        height: 22,
        borderRadius: 6,
        backgroundColor: "#9DBB97",
        alignItems: "center",
        justifyContent: "center",
    },
    qrText: { fontSize: 10, fontWeight: "900", color: "#fff" },

    card: { backgroundColor: "#fff", borderRadius: 14, padding: 12, marginBottom: 12 },

    username: { textAlign: "center", fontSize: 12, fontWeight: "700", color: "#5F8A5F", marginBottom: 2 },
    fullName: { textAlign: "center", fontSize: 12, fontWeight: "700", color: "#333" },

    sectionTitle: { fontSize: 12, fontWeight: "800", color: "#333", marginBottom: 10 },
    row: { marginBottom: 10 },
    rowLabel: { fontSize: 11, fontWeight: "800", color: "#666", marginBottom: 8 },
    pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

    pill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
    pillText: { fontSize: 12, fontWeight: "800" },

    favGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 },
    favTile: { width: "31.5%", aspectRatio: 1, borderRadius: 12, backgroundColor: "#9DBB97", position: "relative", overflow: "hidden" },
    heart: { position: "absolute", top: 8, right: 8, opacity: 0.9 },
});
