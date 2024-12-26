import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase";
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigation.replace("SignIn");  // Після виходу користувача, замінимо екран на екран входу
      })
      .catch((error) => console.log("Error signing out:", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are signed in!</Text>
      <Button title="Sign Out" onPress={logOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
