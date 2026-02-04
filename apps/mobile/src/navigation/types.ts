export type TabsParamList = {
  Plan: undefined;
  Cards: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Tabs: undefined;
  CardForm: { cardId?: string } | undefined;
  WhyPlan: undefined;
};
