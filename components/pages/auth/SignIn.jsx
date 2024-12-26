import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigation } from '@react-navigation/native'; // Додаємо навігацію

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation(); // ініціалізуємо навігацію

  function logIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setError("");
        setEmail("");
        setPassword("");
        // Після авторизації користувач переходить на головну сторінку
        navigation.replace("Home");
      })
      .catch((error) => {
        console.log(error);
        setError("SORRY, COULDN'T FIND YOUR ACCOUNT");
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in</Text>
      <TextInput
        style={styles.input}
        placeholder="Please enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Please enter your password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Button title="Login" onPress={logIn} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Кнопка для переходу до екрану реєстрації */}
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('SignUp')} // Перехід на екран реєстрації
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});
