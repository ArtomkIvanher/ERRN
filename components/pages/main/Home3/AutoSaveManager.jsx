import React, { useEffect, useRef, useState } from "react";

export default function AutoSaveManager({
  authUser,
  schedule,
  saveSchedule,
  onAutoSaveComplete, // Callback для завершення автозбереження
  isUnsavedChanges,
  autoSaveInterval,
}) {
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(autoSaveInterval); // Зворотний відлік до автозбереження
  const [isSaving, setIsSaving] = useState(false); // Прапор, щоб уникнути повторного збереження

  useEffect(() => {
    if (isUnsavedChanges) {
      startAutoSave();
    } else {
      stopAutoSave();
    }
    return () => stopAutoSave();
  }, [isUnsavedChanges, autoSaveInterval]);

  const startAutoSave = () => {
    stopAutoSave(); // Зупиняємо попередній таймер
    setTimeLeft(autoSaveInterval); // Скидаємо таймер

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) return prevTime - 1;
        saveChanges(); // Викликаємо збереження
        return autoSaveInterval;
      });
    }, 1000);
  };

  const saveChanges = () => {
    if (authUser && schedule && !isSaving) {
      setIsSaving(true); // Встановлюємо прапор, щоб уникнути повторного збереження

      saveSchedule(authUser.uid, schedule)
        .then(() => {
          console.log("Автозбереження виконано");
          if (onAutoSaveComplete) {
            setTimeout(onAutoSaveComplete, 0); // Викликаємо callback у наступному циклі подій
          }
        })
        .catch((err) => console.error("Помилка автозбереження:", err))
        .finally(() => {
          setIsSaving(false); // Скидаємо прапор після завершення збереження
        });
    }
  };

  const stopAutoSave = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div>
      {isUnsavedChanges ? (
        <p>Час до автозбереження: {timeLeft} сек.</p>
      ) : (
        <p>Всі зміни збережені.</p>
      )}
    </div>
  );
}
