import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigation } from '@react-navigation/native'; // Для навігації

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation(); // ініціалізація навігації

  function register() {
    if (password !== copyPassword) {
      setError("Passwords didn't match");
      return;
    }

    // Реєстрація користувача
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered:", userCredential.user);
        setError("");
        setEmail("");
        setPassword("");
        setCopyPassword("");

        // Автоматичний вхід користувача після реєстрації
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
            // Після авторизації користувач потрапляє на головну сторінку
            navigation.replace("Home");
          })
          .catch((error) => {
            console.log("Error logging in:", error);
            setError("Error logging in after registration");
          });
      })
      .catch((error) => {
        console.log("Registration error:", error);
        setError("Error creating account");
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Please enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Please enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Please re-enter your password"
        value={copyPassword}
        onChangeText={setCopyPassword}
        secureTextEntry
      />
      <Button title="Create" onPress={register} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: "red", marginTop: 10 },
});
