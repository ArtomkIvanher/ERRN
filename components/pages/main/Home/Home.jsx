import React, { useEffect, useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { signOut } from 'firebase/auth';
import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import { auth } from '../../../../firebase';
import { getSchedule, saveSchedule } from '../../../../firestore';
import Home2 from '../Home2/Home2';
import Home3 from '../Home3/Home3';
import AutoSaveManager from '../Home3/AutoSaveManager';

const Tab = createBottomTabNavigator();

export default function Home() {
  const [schedule, setSchedule] = useState(null); // Дані розкладу
  const [authUser, setAuthUser] = useState(null); // Авторизований користувач
  const [autoSaveInterval, setAutoSaveInterval] = useState(30); // Інтервал автозбереження
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false); // Чи є незбережені зміни
  const [refreshing, setRefreshing] = useState(false); // Стан оновлення
  const timerRef = useRef(null);

  // Завантаження користувача та даних
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAuthUser(user); // Зберігаємо користувача
      loadSchedule(user.uid); // Завантажуємо розклад для користувача
    }
  }, []);

  useEffect(() => {
    if (isUnsavedChanges) {
      timerRef.current = setInterval(() => handleSaveChanges(), autoSaveInterval * 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isUnsavedChanges, autoSaveInterval]);

  // Завантаження розкладу з Firebase
  const loadSchedule = async (userId) => {
    try {
      const userSchedule = await getSchedule(userId);
      const loadedSchedule = userSchedule || {
        auto_save: 30,
        subjects: [],
        schedule: [],
      };
      setSchedule(loadedSchedule); // Зберігаємо розклад
      setAutoSaveInterval(loadedSchedule.auto_save || 30); // Встановлюємо інтервал автозбереження
    } catch (error) {
      console.error('Помилка завантаження розкладу:', error);
    }
  };

  // Збереження розкладу
  const handleSaveChanges = async () => {
    if (authUser && schedule) {
      try {
        await saveSchedule(authUser.uid, schedule);
        console.log('Збереження виконано');
        setIsUnsavedChanges(false);
      } catch (error) {
        console.error('Помилка збереження:', error);
      }
    }
  };

  // Оновлення інтервалу автозбереження
  const handleAutoSaveIntervalChange = (interval) => {
    setAutoSaveInterval(interval);
    setSchedule((prevSchedule) => ({ ...prevSchedule, auto_save: interval }));
    setIsUnsavedChanges(true);
  };

  // Автозбереження
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
    timerRef.current = setInterval(() => {
      handleSaveChanges();
    }, autoSaveInterval * 1000);
  };

  const stopAutoSave = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Вихід із системи
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Вихід виконано успішно');
    } catch (error) {
      console.error('Помилка виходу:', error.message);
    }
  };

  const handleDataChange = (updatedSchedule) => {
    setSchedule(updatedSchedule);
    setIsUnsavedChanges(true); // Помітка для автозбереження
  };

  // Загальні пропси для дочірніх компонентів
  const commonProps = {
    schedule,
    authUser,
    autoSaveInterval,
    isUnsavedChanges,
    refreshing,
    setSchedule,
    handleSaveChanges,
    onSignOut: handleSignOut,
    onDataChange: handleDataChange, // Передаємо функцію
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Автозбереження кожні (секунд): </Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(autoSaveInterval)}
          onChangeText={(text) => handleAutoSaveIntervalChange(Number(text))}
        />
      </View>

      <Button title="Зберегти зараз" onPress={handleSaveChanges} />

      <AutoSaveManager
        authUser={authUser}
        schedule={schedule}
        saveSchedule={handleSaveChanges}
        onAutoSaveComplete={() => setIsUnsavedChanges(false)}
        isUnsavedChanges={isUnsavedChanges}
        autoSaveInterval={autoSaveInterval}
      />

      <Tab.Navigator>
        <Tab.Screen name="Home3_1">
          {() => <Home2 {...commonProps} title="Page 1" />}
        </Tab.Screen>
        <Tab.Screen name="Home3_2">
          {() => <Home3 {...commonProps} title="Page 2" />}
        </Tab.Screen>
        <Tab.Screen name="Home3_3">
          {() => <Home3 {...commonProps} title="Page 3" />}
        </Tab.Screen>
        <Tab.Screen name="Home3_4">
          {() => <Home3 {...commonProps} title="Page 4" />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
});
