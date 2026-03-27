import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { useHabits } from '@/context/HabitsContext';
import { GoodHabit, TaskTemplate } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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

const EMOJIS = ['💪', '📚', '🏃', '🧘', '💧', '🎯', '🌱', '🎨', '🎵', '✍️', '🍎', '😴', '🧠', '🚴', '🏊'];

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function CreateGoodHabit() {
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { goodHabits, addGoodHabit, updateGoodHabit } = useHabits();

  const existingHabit = useMemo(() => (edit ? goodHabits.find((h) => h.id === edit) : null), [edit, goodHabits]);

  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💪');
  const [selectedColor, setSelectedColor] = useState(Colors.habitColors[0]);
  const [tasks, setTasks] = useState<TaskTemplate[]>([{ id: uuid(), label: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingHabit) {
      setName(existingHabit.name);
      setSelectedEmoji(existingHabit.icon);
      setSelectedColor(existingHabit.color);
      setTasks(existingHabit.tasks.length > 0 ? [...existingHabit.tasks] : [{ id: uuid(), label: '' }]);
    }
  }, [existingHabit?.id]);

  function addTask() {
    setTasks((prev) => [...prev, { id: uuid(), label: '' }]);
  }

  function updateTask(id: string, label: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, label } : t)));
  }

  function removeTask(id: string) {
    if (tasks.length <= 1) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please give your habit a name.');
      return;
    }
    const validTasks = tasks.filter((t) => t.label.trim() !== '');
    if (validTasks.length === 0) {
      Alert.alert('Add a task', 'Add at least one task for this habit.');
      return;
    }

    setSaving(true);
    if (existingHabit) {
      updateGoodHabit(existingHabit.id, {
        name: name.trim(),
        icon: selectedEmoji,
        color: selectedColor,
        tasks: validTasks,
      });
    } else {
      addGoodHabit({
        name: name.trim(),
        icon: selectedEmoji,
        color: selectedColor,
        tasks: validTasks,
      });
    }
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Nav */}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
            <ThemedText variant="h3">{existingHabit ? 'Edit Habit' : 'New Habit'}</ThemedText>
            <View style={{ width: 24 }} />
          </View>

          {/* Emoji picker */}
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

          {/* Color picker */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Color</Text>
            <View style={styles.colorRow}>
              {Colors.habitColors.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedColor(c)}
                  style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]}
                  accessibilityLabel={`Select color ${c}`}
                />
              ))}
            </View>
          </View>

          {/* Name input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Habit name</Text>
            <TextInput
              style={[styles.input, { borderColor: selectedColor }]}
              placeholder="e.g. Morning workout"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={40}
              returnKeyType="done"
              accessibilityLabel="Habit name input"
            />
          </View>

          {/* Tasks */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Daily tasks</Text>
            <Text style={styles.hint}>These appear as your daily checklist. Template — edit anytime.</Text>
            {tasks.map((task, idx) => (
              <View key={task.id} style={styles.taskRow}>
                <View style={[styles.bullet, { backgroundColor: selectedColor }]} />
                <TextInput
                  style={styles.taskInput}
                  placeholder={`Task ${idx + 1}`}
                  placeholderTextColor={Colors.textMuted}
                  value={task.label}
                  onChangeText={(text) => updateTask(task.id, text)}
                  returnKeyType={idx === tasks.length - 1 ? 'done' : 'next'}
                  accessibilityLabel={`Task ${idx + 1} input`}
                />
                <TouchableOpacity onPress={() => removeTask(task.id)} accessibilityLabel="Remove task">
                  <Ionicons name="close-circle" size={20} color={tasks.length > 1 ? Colors.textMuted : Colors.surface3} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addTaskBtn} onPress={addTask}>
              <Ionicons name="add" size={18} color={selectedColor} />
              <Text style={[styles.addTaskText, { color: selectedColor }]}>Add task</Text>
            </TouchableOpacity>
          </View>

          {/* Preview card */}
          <View style={[styles.previewCard, { borderLeftColor: selectedColor }]}>
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            <View>
              <Text style={[styles.previewName, { color: selectedColor }]}>
                {name || 'Your habit name'}
              </Text>
              <Text style={styles.previewTasks}>
                {tasks.filter((t) => t.label.trim()).length} task{tasks.filter((t) => t.label.trim()).length !== 1 ? 's' : ''} per day
              </Text>
            </View>
          </View>

          <Button
            label={existingHabit ? 'Save changes' : 'Create habit'}
            onPress={handleSave}
            loading={saving}
            color={selectedColor}
            size="lg"
            style={{ marginTop: Spacing.sm }}
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
  colorRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.white },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  taskRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.sm + 4,
  },
  bullet: { width: 8, height: 8, borderRadius: 4 },
  taskInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  addTaskBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: 4 },
  addTaskText: { fontSize: FontSize.sm, fontWeight: '600' },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md, borderLeftWidth: 4,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  previewEmoji: { fontSize: 32 },
  previewName: { fontSize: FontSize.lg, fontWeight: '700' },
  previewTasks: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
});
