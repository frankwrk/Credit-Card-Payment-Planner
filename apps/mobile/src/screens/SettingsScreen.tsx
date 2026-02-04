import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "@clerk/clerk-expo";
import { SignOutButton } from "../components/SignOutButton";
import { Section } from "../components/Section";
import { Button } from "../components/Button";
import { colors, spacing } from "../theme";

export function SettingsScreen() {
  const { getToken } = useAuth();

  const handleCopyToken = async () => {
    const token = await getToken();
    if (!token) {
      Alert.alert("Token unavailable", "Please sign in again and retry.");
      return;
    }
    await Clipboard.setStringAsync(token);
    Alert.alert("Token copied", "JWT copied to clipboard.");
  };

  return (
    <View style={styles.container}>
      <Section title="Account">
        <SignOutButton />
      </Section>
      <Section title="Debug">
        <Button label="Copy JWT" variant="secondary" onPress={handleCopyToken} />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});
