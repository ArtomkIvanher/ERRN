import React from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import { auth, db } from "../../../../firebase"; // Firebase auth і Firestore
import { doc, setDoc } from "firebase/firestore";

export default function ResetDB() {
  const resetFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Помилка", "Будь ласка, увійдіть у свій акаунт.");
      return;
    }

    try {
      const scheduleRef = doc(db, "schedules", user.uid);
      const newScheduleData = {
        schedule: {
          duration: 80,
          breaks: [10, 20, 10, 10],
          start_time: "08:30",
          auto_save: 60,
          repeat: 1,
          subjects: [
            { id: 1, name: "Mathematics", teacher: "", zoom_link: "https://zoom.com/lesson1" },
            { id: 2, name: "Ukrainian Language", teacher: "", zoom_link: "https://zoom.com/lesson2" },
            { id: 3, name: "Biology", teacher: "", zoom_link: "https://zoom.com/lesson3" },
            { id: 4, name: "Physics", teacher: "", zoom_link: "https://zoom.com/lesson4" },
            { id: 5, name: "Informatics", teacher: "", zoom_link: "https://zoom.com/lesson5" },
          ],
          schedule: Array(7).fill({ week1: [], week2: [], week3: [], week4: [] }),
        },
      };

      await setDoc(scheduleRef, newScheduleData);
      Alert.alert("Успіх", "Дані успішно оновлено в Firestore!");
    } catch (error) {
      console.error("Помилка при оновленні Firestore:", error);
      Alert.alert("Помилка", "Сталася помилка. Спробуйте ще раз.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Оновити дані у Firestore" onPress={resetFirestore} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
