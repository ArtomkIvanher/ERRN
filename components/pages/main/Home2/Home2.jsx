import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function Home2({ schedule }) {
  const daysOfWeek = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'П’ятниця',
    'Субота',
    'Неділя',
  ];

  const subjects = schedule?.subjects || [];
  const weeks = Array.from({ length: schedule?.repeat || 1 }, (_, i) => `week${i + 1}`);

  // Якщо розклад не завантажений або дані некоректні
  if (!schedule || !Array.isArray(schedule.schedule)) {
    return <Text>Loading or invalid schedule data...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Розклад по тижнях</Text>
      {weeks.map((week, weekIndex) => (
        <View key={week} style={styles.weekContainer}>
          <Text style={styles.weekTitle}>Тиждень {weekIndex + 1}</Text>
          {schedule.schedule.map((day, dayIndex) => (
            <View key={`${week}-${dayIndex}`} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{daysOfWeek[dayIndex]}</Text>
              {schedule.schedule[dayIndex][week].length > 0 ? (
                schedule.schedule[dayIndex][week].map((subjectId, subjectIndex) => {
                  const subject = subjects.find(subject => subject.id === subjectId);
                  return (
                    <View key={subjectIndex} style={styles.subjectContainer}>
                      <Text style={styles.subjectName}>
                        Пара {subjectIndex + 1}: {subject?.name || '—'}
                      </Text>
                      {subject && (
                        <>
                          <Text style={styles.subjectDetails}>
                            Викладач: {subject.teacher}
                          </Text>
                          <TouchableOpacity
                            onPress={() => Linking.openURL(subject.zoom_link)}
                            style={styles.zoomLinkButton}
                          >
                            <Text style={styles.zoomLinkText}>Zoom посилання</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noDataText}>Немає даних</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  weekContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dayContainer: {
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subjectContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#eaf4fc',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subjectDetails: {
    fontSize: 14,
    color: '#555',
  },
  zoomLinkButton: {
    marginTop: 5,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
  },
  zoomLinkText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  noDataText: {
    fontSize: 14,
    color: '#777',
  },
});
