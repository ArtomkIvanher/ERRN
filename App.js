import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Переконайтеся, що ви імпортуєте auth правильно
import SignIn from "./components/pages/auth/SignIn";
import SignUp from "./components/pages/auth/SignUp";
import Home3 from "./components/pages/main/Home3/Home3"; // Додатковий головний екран

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Слухаємо зміни авторизації користувача
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Якщо користувач авторизований, зберігаємо його дані
      } else {
        setUser(null); // Якщо користувач не авторизований, очищаємо стан
      }
    });

    return unsubscribe; // Підписка очищається при розмонтуванні
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Якщо користувач авторизований, показуємо Home3
          <Stack.Screen
            name="Home3"
            component={Home3}
            options={{ title: "Home3" }}
          />
        ) : (
          // Якщо користувач не авторизований, показуємо екрани входу та реєстрації
          <>
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ title: "Sign In" }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ title: "Sign Up" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
