import React from "react";
import { Alert } from "react-native";
import { useClerk } from "@clerk/clerk-expo";
import { Button } from "./Button";

export function SignOutButton() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Sign out failed", "Please try again.");
    }
  };

  return <Button label="Sign out" variant="secondary" onPress={handleSignOut} />;
}
