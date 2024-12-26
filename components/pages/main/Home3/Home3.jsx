import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase";
import { getSchedule, saveSchedule } from "../../../../firestore";
import AutoSaveManager from "./AutoSaveManager";
import ScheduleManager from "./ScheduleManager";
import SubjectsManager from "./SubjectsManager";
import ResetDB from './ResetDB'

export default function Home3() {
  const [schedule, setSchedule] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30); // Мінімум 30 секунд
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAuthUser(user);
      loadSchedule(user.uid);
    }
  }, []);

  const loadSchedule = async (userId) => {
    const userSchedule = await getSchedule(userId);
    const loadedSchedule = userSchedule || {
      auto_save: 30,
      subjects: [],
      schedule: [],
    };
    setSchedule(loadedSchedule);
    setAutoSaveInterval(loadedSchedule.auto_save || 30);
  };

  const handleSaveChanges = () => {
    if (authUser && schedule) {
      saveSchedule(authUser.uid, schedule)
        .then(() => console.log("Збереження виконано вручну"))
        .catch((err) => console.error("Помилка збереження:", err));
      setIsUnsavedChanges(false);
    }
  };

  const handleDataChange = () => {
    setIsUnsavedChanges(true); // Встановлюємо прапор змін
  };

  const handleAutoSaveIntervalChange = (value) => {
    const newInterval = Math.max(30, value); // Мінімум 30 секунд
    setAutoSaveInterval(newInterval); // Оновлюємо локальний стан
    setSchedule((prev) => ({
      ...prev,
      auto_save: newInterval, // Оновлюємо поле auto_save
    }));
    setIsUnsavedChanges(true); // Встановлюємо прапор незбережених змін
  };

  const handleAutoSaveComplete = () => {
    setIsUnsavedChanges(false); // Скидаємо прапор після автозбереження
  };

  return (
    <div>
      {authUser && schedule ? (
        <>
          <h2>Розклад користувача: {authUser.email}</h2>

          <div>
            <label>Автозбереження кожні (секунд): </label>
            <input
              type="number"
              min="30"
              value={autoSaveInterval}
              onChange={(e) =>
                handleAutoSaveIntervalChange(Number(e.target.value))
              }
            />
            <button onClick={handleSaveChanges}>Зберегти зараз</button>
            <ResetDB/>
          </div>

          <SubjectsManager
            subjects={schedule.subjects}
            setSubjects={(subjects) => {
              setSchedule((prev) => ({ ...prev, subjects }));
              handleDataChange(); // Зміни в предметах
            }}
            onAddSubject={(newSubject) => {
              setSchedule((prev) => ({
                ...prev,
                subjects: [...prev.subjects, { ...newSubject, id: Date.now() }],
              }));
              handleDataChange(); // Додано новий предмет
            }}
          />

          <ScheduleManager
            schedule={schedule}
            setSchedule={(updatedSchedule) => {
              setSchedule(updatedSchedule);
              handleDataChange(); // Зміни в розкладі
            }}
            subjects={schedule.subjects}
          />

          <AutoSaveManager
            authUser={authUser}
            schedule={schedule}
            saveSchedule={saveSchedule}
            isUnsavedChanges={isUnsavedChanges}
            onAutoSaveComplete={handleAutoSaveComplete} // Передаємо callback
            autoSaveInterval={autoSaveInterval}
          />
        </>
      ) : (
        <p>Завантаження...</p>
      )}
    </div>
  );
}
