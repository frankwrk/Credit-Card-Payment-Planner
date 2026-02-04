import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { colors, spacing } from "../theme";
import type { RootStackParamList } from "../navigation/types";

type SignInNav = NativeStackNavigationProp<RootStackParamList, "SignIn">;

export function SignInScreen() {
  const navigation = useNavigation<SignInNav>();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [verificationType, setVerificationType] = React.useState<
    "first" | "second" | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        return;
      }

      if (signInAttempt.status === "needs_first_factor") {
        const emailFactor = signInAttempt.supportedFirstFactors?.find(
          (factor) => factor.strategy === "email_code"
        );
        if (emailFactor && "emailAddressId" in emailFactor) {
          await signInAttempt.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailFactor.emailAddressId,
          });
          setVerificationType("first");
          setPendingVerification(true);
          return;
        }
      }

      if (signInAttempt.status === "needs_second_factor") {
        const emailFactor = signInAttempt.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code"
        );
        if (emailFactor) {
          await signInAttempt.prepareSecondFactor({ strategy: "email_code" });
          setVerificationType("second");
          setPendingVerification(true);
          return;
        }
      }

      setError("Sign in requires additional steps not supported yet.");
    } catch (err) {
      setError("Unable to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !signIn || !verificationType) return;
    setLoading(true);
    setError(null);

    try {
      const result =
        verificationType === "first"
          ? await signIn.attemptFirstFactor({
              strategy: "email_code",
              code,
            })
          : await signIn.attemptSecondFactor({
              strategy: "email_code",
              code,
            });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setPendingVerification(false);
        setVerificationType(null);
      } else {
        setError("Verification requires additional steps.");
      }
    } catch (err) {
      setError("Verification failed. Check the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {pendingVerification ? "Verify your email" : "Sign in"}
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
            label="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            label={loading ? "Signing in..." : "Continue"}
            onPress={handleSignIn}
            disabled={loading}
          />
          <View style={styles.footer}>
            <Text style={styles.muted}>New here?</Text>
            <View style={styles.footerButton}>
              <Button
                label="Create account"
                variant="secondary"
                onPress={() => navigation.navigate("SignUp")}
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
