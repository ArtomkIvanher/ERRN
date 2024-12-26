import React from "react";
import { auth, db } from "../../../../firebase"; // Firebase auth і Firestore з одного імпорту
import { doc, setDoc } from "firebase/firestore";

export default function ResetDB() {
  const resetFirestore = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Будь ласка, увійдіть у свій акаунт.");

    try {
      const scheduleRef = doc(db, "schedules", user.uid);
      const newScheduleData = {
        schedule: {
          duration: 120,
          breaks: [10, 20, 10, 10],
          start_time: "08:30",
          auto_save: 60,
          repeat: 1,
          subjects: [
            { id: 1, name: "Mathematics", teacher: "John Doe", zoom_link: "https://zoom.com/lesson1" },
            { id: 2, name: "Ukrainian Language", teacher: "Jane Smith", zoom_link: "https://zoom.com/lesson2" },
            { id: 3, name: "Biology", teacher: "Mark Brown", zoom_link: "https://zoom.com/lesson3" },
            { id: 4, name: "Physics", teacher: "Emily White", zoom_link: "https://zoom.com/lesson4" },
            { id: 5, name: "Informatics", teacher: "Alice Green", zoom_link: "https://zoom.com/lesson5" },
          ],
          schedule: Array(7).fill({ week1: [], week2: [], week3: [], week4: [] }),
        },
      };

      await setDoc(scheduleRef, newScheduleData);
      alert("Дані успішно оновлено в Firestore!");
    } catch (error) {
      console.error("Помилка при оновленні Firestore:", error);
      alert("Сталася помилка. Спробуйте ще раз.");
    }
  };

  return (
    <button
      onClick={resetFirestore}
      style={{
        padding: "10px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Оновити дані у Firestore
    </button>
  );
}
