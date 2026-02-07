import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import NavigationBar from "../components/navigationbar";

export default function NavigationBarRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
