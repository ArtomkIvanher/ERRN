import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AutoSaveManager({
  authUser,
  schedule,
  saveSchedule,
  onAutoSaveComplete,
  isUnsavedChanges,
  autoSaveInterval,
}) {
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(autoSaveInterval);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isUnsavedChanges) {
      startAutoSave();
    } else {
      stopAutoSave();
    }
    return () => stopAutoSave();
  }, [isUnsavedChanges, autoSaveInterval]);

  const startAutoSave = () => {
    stopAutoSave();
    setTimeLeft(autoSaveInterval);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) return prevTime - 1;
        saveChanges();
        return autoSaveInterval;
      });
    }, 1000);
  };

  const saveChanges = () => {
    if (authUser && schedule && !isSaving) {
      setIsSaving(true);

      saveSchedule(authUser.uid, schedule)
        .then(() => {
          console.log("Автозбереження виконано");
          if (onAutoSaveComplete) {
            setTimeout(onAutoSaveComplete, 0);
          }
        })
        .catch((err) => console.error("Помилка автозбереження:", err))
        .finally(() => {
          setIsSaving(false);
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
    <View style={styles.container}>
      {isUnsavedChanges ? (
        <Text>Час до автозбереження: {timeLeft} сек.</Text>
      ) : (
        <Text>Всі зміни збережені.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
