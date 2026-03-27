import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { useHabits } from '@/context/HabitsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMOJIS = ['🚬', '📱', '🍕', '🍺', '🎰', '😤', '🛋️', '💸', '🍫', '🎮', '😠', '☕', '🌙', '😶', '🔔'];
const TARGET_OPTIONS = [21, 30, 60, 90];

export default function CreateBadHabit() {
  const router = useRouter();
  const { addBadHabit } = useHabits();

  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📱');
  const [selectedColor, setSelectedColor] = useState(Colors.red);
  const [targetDays, setTargetDays] = useState(21);
  const [extendAfter21, setExtendAfter21] = useState(false);
  const [saving, setSaving] = useState(false);

  const BAD_HABIT_COLORS = [Colors.red, Colors.orange, Colors.purple, '#F59E0B', '#10B981', '#3B82F6'];

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this habit a name.');
      return;
    }
    setSaving(true);
    addBadHabit({
      name: name.trim(),
      icon: selectedEmoji,
      color: selectedColor,
      startDate: new Date().toISOString().split('T')[0],
      targetDays,
      extendAfter21,
      extensionDays: 0,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Nav */}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close">
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
            <ThemedText variant="h3">Break a Habit</ThemedText>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.intro}>
            Name the habit you want to leave. We'll help you say NO — one urge at a time.
          </Text>

          {/* Emoji */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiRow}>
              {EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setSelectedEmoji(e)}
                  style={[
                    styles.emojiBtn,
                    selectedEmoji === e && { backgroundColor: selectedColor + '33', borderColor: selectedColor },
                  ]}
                  accessibilityLabel={`Select emoji ${e}`}
                >
                  <Text style={styles.emoji}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Color */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Color</Text>
            <View style={styles.colorRow}>
              {BAD_HABIT_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedColor(c)}
                  style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]}
                  accessibilityLabel={`Select color ${c}`}
                />
              ))}
            </View>
          </View>

          {/* Name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Habit name</Text>
            <TextInput
              style={[styles.input, { borderColor: selectedColor }]}
              placeholder="e.g. Doom scrolling, Smoking..."
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={40}
              returnKeyType="done"
              accessibilityLabel="Bad habit name input"
            />
          </View>

          {/* Target days */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Challenge duration</Text>
            <Text style={styles.hint}>21 days is the minimum. Science says habits break at 21.</Text>
            <View style={styles.daysRow}>
              {TARGET_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setTargetDays(d)}
                  style={[
                    styles.dayOption,
                    targetDays === d && { backgroundColor: selectedColor, borderColor: selectedColor },
                  ]}
                  accessibilityLabel={`${d} days`}
                >
                  <Text style={[styles.dayOptionText, targetDays === d && { color: Colors.white }]}>
                    {d}d
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Extend toggle */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setExtendAfter21(!extendAfter21)}
            accessibilityLabel="Allow extending after goal"
          >
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Allow extension after goal</Text>
              <Text style={styles.toggleSub}>Let me keep going past the target if I want</Text>
            </View>
            <View style={[styles.toggle, extendAfter21 && { backgroundColor: selectedColor }]}>
              <View style={[styles.toggleThumb, extendAfter21 && styles.toggleThumbOn]} />
            </View>
          </TouchableOpacity>

          {/* Mechanic explainer */}
          <View style={styles.explainerCard}>
            <Text style={styles.explainerTitle}>How it works</Text>
            <View style={styles.explainerRow}>
              <Text style={styles.explainerIcon}>🎯</Text>
              <Text style={styles.explainerText}>Say NO to all urges. Goal: resist 1000 times.</Text>
            </View>
            <View style={styles.explainerRow}>
              <Text style={styles.explainerIcon}>📅</Text>
              <Text style={styles.explainerText}>Stay clean for {targetDays} days straight.</Text>
            </View>
            <View style={styles.explainerRow}>
              <Text style={styles.explainerIcon}>🏆</Text>
              <Text style={styles.explainerText}>When done, close the chapter. The habit is yours to own.</Text>
            </View>
          </View>

          <Button
            label="Start the fight"
            onPress={handleSave}
            loading={saving}
            color={selectedColor}
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  intro: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  hint: { fontSize: FontSize.sm, color: Colors.textMuted },
  emojiRow: { gap: Spacing.sm, paddingBottom: 4 },
  emojiBtn: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface2, borderWidth: 2, borderColor: 'transparent',
  },
  emoji: { fontSize: 24 },
  colorRow: { flexDirection: 'row', gap: Spacing.sm },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.white },
  input: {
    backgroundColor: Colors.surface, borderWidth: 1.5,
    borderRadius: Radius.md, padding: Spacing.md,
    fontSize: FontSize.lg, color: Colors.textPrimary,
  },
  daysRow: { flexDirection: 'row', gap: Spacing.sm },
  dayOption: {
    flex: 1, paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    borderWidth: 2, borderColor: Colors.borderBright,
    alignItems: 'center', justifyContent: 'center',
  },
  dayOptionText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
  },
  toggleInfo: { flex: 1 },
  toggleTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  toggleSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  toggle: {
    width: 48, height: 28, borderRadius: 14,
    backgroundColor: Colors.surface3, padding: 3,
  },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.textMuted },
  toggleThumbOn: { backgroundColor: Colors.white, transform: [{ translateX: 20 }] },
  explainerCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.sm,
  },
  explainerTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  explainerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  explainerIcon: { fontSize: 18 },
  explainerText: { flex: 1, fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
});
