import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase";

export default function AuthDetails() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      setAuthUser(user ? user : null);
    });

    return () => listen(); // Відписка при демонтуженні
  }, []);

  function userSignOut() {
    signOut(auth)
      .then(() => console.log("Sign out successful"))
      .catch((error) => console.log("Sign out error:", error));
  }

  return (
    <View style={styles.container}>
      {authUser ? (
        <View>
          <Text style={styles.text}>{`Signed in as ${authUser.email}`}</Text>
          <Button title="Sign Out" onPress={userSignOut} />
        </View>
      ) : (
        <Text style={styles.text}>Signed Out</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  text: { fontSize: 16, marginBottom: 10 },
});
