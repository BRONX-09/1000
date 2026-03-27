import { CounterDisplay } from '@/components/bad/CounterDisplay';
import { DayStreakBar } from '@/components/bad/DayStreakBar';
import { UrgeButton } from '@/components/bad/UrgeButton';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { MILESTONE_MESSAGES } from '@/constants/Messages';
import { useHabits } from '@/context/HabitsContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function BadHabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { badHabits, incrementUrge, completeBadHabit, extendBadHabit, deleteBadHabit } = useHabits();

  const habit = useMemo(() => badHabits.find((h) => h.id === id), [badHabits, id]);
  const [milestoneModal, setMilestoneModal] = useState<{ visible: boolean; msg: string }>({ visible: false, msg: '' });
  const [overcomModal, setOvercomeModal] = useState(false);
  const [extendDays, setExtendDays] = useState(7);

  if (!habit) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <ThemedText variant="h3">Habit not found</ThemedText>
          <Button label="Go back" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  function handleUrgePress() {
    const { newCount, hitMilestone } = incrementUrge(habit!.id);
    if (newCount === 0 && habit!.urgeCount > 0) {
      // Just hit 1000
      const msg = MILESTONE_MESSAGES[1000];
      setMilestoneModal({ visible: true, msg });
    } else if (hitMilestone && MILESTONE_MESSAGES[newCount]) {
      setMilestoneModal({ visible: true, msg: MILESTONE_MESSAGES[newCount] });
    }
  }

  function handleOvercome() {
    completeBadHabit(habit!.id);
    setOvercomeModal(false);
    router.back();
  }

  function handleDelete() {
    Alert.alert('Delete', `Delete "${habit!.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteBadHabit(habit!.id);
          router.back();
        },
      },
    ]);
  }

  // Recalculate streak days based on start date
  const today = new Date().toISOString().split('T')[0];
  const startMs = new Date(habit.startDate).getTime();
  const nowMs = new Date(today).getTime();
  const streakDays = Math.floor((nowMs - startMs) / 86400000);

  const canOvercome = streakDays >= habit.targetDays;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[habit.color + '33', Colors.bg]} style={styles.headerGradient}>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
              <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} accessibilityLabel="Delete habit">
              <Ionicons name="trash-outline" size={20} color={Colors.red} />
            </TouchableOpacity>
          </View>

          <View style={styles.habitHeader}>
            <View style={[styles.iconCircle, { backgroundColor: habit.color + '33' }]}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
            </View>
            <ThemedText variant="h2">{habit.name}</ThemedText>
            <Text style={styles.tagline}>
              {habit.isCompleted ? '🏆 You overcame this!' : 'Every NO is a win.'}
            </Text>
          </View>
        </LinearGradient>

        {/* THE BUTTON */}
        {!habit.isCompleted && (
          <UrgeButton
            color={habit.color}
            onPress={handleUrgePress}
          />
        )}

        {/* Counter */}
        <View style={styles.counterSection}>
          <CounterDisplay
            current={habit.urgeCount}
            total={1000}
            color={habit.color}
            milestoneResets={habit.milestoneResets}
          />
          {habit.totalUrgeCount > habit.urgeCount && (
            <Text style={styles.totalCount}>
              Total all-time: {habit.totalUrgeCount.toLocaleString()} resistances
            </Text>
          )}
        </View>

        {/* Day streak */}
        <View style={styles.card}>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.md }}>Clean Day Streak</ThemedText>
          <DayStreakBar
            streakDays={streakDays}
            targetDays={habit.targetDays}
            color={habit.color}
          />
        </View>

        {/* Actions */}
        {!habit.isCompleted && (
          <View style={styles.actionsCard}>
            {canOvercome ? (
              <>
                <Text style={styles.actionHint}>
                  🎉 You've completed {habit.targetDays} days! You can mark this habit as overcome, or extend the challenge.
                </Text>
                <Button
                  label="Mark as Overcome 🏆"
                  onPress={() => setOvercomeModal(true)}
                  color={habit.color}
                />
                <TouchableOpacity
                  style={styles.extendBtn}
                  onPress={() => {
                    Alert.alert(
                      'Extend challenge',
                      'How many more days?',
                      [7, 14, 21, 30].map((d) => ({
                        text: `${d} days`,
                        onPress: () => extendBadHabit(habit!.id, d),
                      }))
                    );
                  }}
                >
                  <Text style={[styles.extendText, { color: habit.color }]}>Extend challenge</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.actionHint}>
                Keep going. {habit.targetDays - streakDays} more days to complete the challenge.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Milestone modal */}
      <Modal visible={milestoneModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🏅</Text>
            <ThemedText variant="h2" style={{ textAlign: 'center' }}>Milestone!</ThemedText>
            <Text style={styles.modalMsg}>{milestoneModal.msg}</Text>
            <Button
              label="Keep going"
              onPress={() => setMilestoneModal({ visible: false, msg: '' })}
              color={habit.color}
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Overcome modal */}
      <Modal visible={overcomModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🏆</Text>
            <ThemedText variant="h2" style={{ textAlign: 'center' }}>You Won.</ThemedText>
            <Text style={styles.modalMsg}>
              You said NO {habit.totalUrgeCount.toLocaleString()} times.{'\n'}
              {habit.name} is no longer in charge of you.{'\n\n'}
              This is freedom.
            </Text>
            <Button label="Close this chapter" onPress={handleOvercome} color={habit.color} />
            <Button
              label="Not yet"
              onPress={() => setOvercomeModal(false)}
              variant="ghost"
              style={{ marginTop: Spacing.xs }}
            />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: Spacing.xxl, gap: Spacing.md },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  headerGradient: { padding: Spacing.md, paddingTop: 0 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  habitHeader: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  iconCircle: { width: 72, height: 72, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  habitIcon: { fontSize: 36 },
  tagline: { fontSize: FontSize.md, color: Colors.textSecondary, fontStyle: 'italic' },
  counterSection: { alignItems: 'center', paddingHorizontal: Spacing.md },
  totalCount: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: Spacing.xs },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginHorizontal: Spacing.md },
  actionsCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginHorizontal: Spacing.md, gap: Spacing.md },
  actionHint: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  extendBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  extendText: { fontSize: FontSize.md, fontWeight: '600' },
  modalOverlay: {
    flex: 1, backgroundColor: '#00000088', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.surface2, borderRadius: Radius.xl, padding: Spacing.xl,
    alignItems: 'center', gap: Spacing.md, width: '100%',
  },
  modalEmoji: { fontSize: 64 },
  modalMsg: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
