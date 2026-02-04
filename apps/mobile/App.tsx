import "react-native-gesture-handler";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { CardsScreen } from "./src/screens/CardsScreen";
import { CardFormScreen } from "./src/screens/CardFormScreen";
import { PlanScreen } from "./src/screens/PlanScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { WhyPlanScreen } from "./src/screens/WhyPlanScreen";
import { SignInScreen } from "./src/screens/SignInScreen";
import { SignUpScreen } from "./src/screens/SignUpScreen";
import { colors, spacing } from "./src/theme";
import type { RootStackParamList, TabsParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabsParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: "Sign in" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: "Create account" }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CardForm"
        component={CardFormScreen}
        options={({ route }) => ({
          title: route.params?.cardId ? "Edit Card" : "Add Card",
        })}
      />
      <Stack.Screen name="WhyPlan" component={WhyPlanScreen} />
    </Stack.Navigator>
  );
}

function AppShell() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isSignedIn ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

export default function App() {
  const clerkPublishableKey =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.text} />
          <Text style={styles.missingKey}>
            Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <AppShell />
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  missingKey: {
    marginTop: spacing.md,
    color: colors.muted,
  },
});
