import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Переконайтеся, що ви імпортуєте auth правильно
import SignIn from "./components/pages/auth/SignIn";
import SignUp from "./components/pages/auth/SignUp";
import HomeScreen from "./components/pages/main/Home/HomeScreen"; // Головна сторінка
import AuthDetails from "./components/pages/auth/AuthDetails"; // Екран авторизації

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Слухаємо зміни авторизації користувача
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);  // Якщо користувач авторизований, зберігаємо його дані
      } else {
        setUser(null);  // Якщо користувач не авторизований, очищаємо стан
      }
    });

    return unsubscribe;  // Підписка очищається при розмонтуванні
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "SignIn"}>
        {/* Екран входу */}
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ title: "Sign In" }}
        />

        {/* Екран реєстрації */}
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Sign Up" }}
        />

        {/* Головна сторінка */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />

        {/* Екран деталей авторизації */}
        <Stack.Screen
          name="AuthDetails"
          component={AuthDetails}
          options={{ title: "User Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
