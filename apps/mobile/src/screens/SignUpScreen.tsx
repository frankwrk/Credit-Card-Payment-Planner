import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { colors, spacing } from "../theme";
import type { RootStackParamList } from "../navigation/types";

type SignUpNav = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export function SignUpScreen() {
  const navigation = useNavigation<SignUpNav>();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      await signUp.create({ emailAddress, password, username });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const message = err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message;
        setError(message ?? "Unable to sign up. Check your details.");
      } else {
        setError("Unable to sign up. Check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        return;
      }

      if ("missingFields" in attempt && Array.isArray(attempt.missingFields)) {
        setError(
          `Verification needs additional info: ${attempt.missingFields.join(", ")}`
        );
        return;
      }

      setError(`Verification needs additional steps (${attempt.status}).`);
    } catch (err) {
      setError("Verification failed. Check the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {pendingVerification ? "Verify your email" : "Create account"}
      </Text>
      {pendingVerification ? (
        <>
          <Field
            label="Verification code"
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            label={loading ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            disabled={loading}
          />
        </>
      ) : (
        <>
          <Field
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Pick a username"
          />
          <Field
            label="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create password"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            label={loading ? "Creating..." : "Continue"}
            onPress={handleSignUp}
            disabled={loading}
          />
          <View style={styles.footer}>
            <Text style={styles.muted}>Already have an account?</Text>
            <View style={styles.footerButton}>
              <Button
                label="Sign in"
                variant="secondary"
                onPress={() => navigation.navigate("SignIn")}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  footer: {
    marginTop: spacing.lg,
  },
  footerButton: {
    marginTop: spacing.sm,
  },
  muted: {
    color: colors.muted,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
});
