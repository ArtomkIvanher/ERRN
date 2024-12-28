import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home2({ schedule, subjects }) {
  const daysOfWeek = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'П’ятниця',
    'Субота',
    'Неділя',
  ];

  if (!schedule || !Array.isArray(schedule.schedule)) {
    return <Text>Розклад відсутній або завантажується...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Розклад по днях</Text>

      {schedule.schedule.map((day, dayIndex) => (
        <View key={dayIndex} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{daysOfWeek[dayIndex] || 'Невідомий день'}</Text>
          {Object.keys(day || {})
            .sort(
              (a, b) =>
                parseInt(a.replace('week', '')) -
                parseInt(b.replace('week', ''))
            )
            .map(weekPart => (
              <View key={weekPart} style={styles.weekPartContainer}>
                <Text style={styles.weekPartTitle}>{weekPart}</Text>
                {day[weekPart]?.map((subjectId, subjectIndex) => (
                  <Text key={subjectIndex} style={styles.subjectText}>
                    {subjects?.find(s => s.id === subjectId)?.name || 'Невідомий предмет'}
                  </Text>
                ))}
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weekPartContainer: {
    marginBottom: 10,
  },
  weekPartTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  subjectText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
