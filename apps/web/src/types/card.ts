export interface PaymentRecommendation {
  amount: number;
  date: string;
  explanation: string;
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  balance: number;
  creditLimit: number;
  minimumPayment: number;
  apr: number;
  dueDate: string;
  statementCloseDate: string;
  currentUtilization: number;
  projectedUtilization: number;
  paymentBeforeStatement?: PaymentRecommendation;
  paymentByDueDate: PaymentRecommendation;
  excludeFromOptimization: boolean;
  editedFields: {
    apr?: boolean;
    dueDate?: boolean;
    statementCloseDate?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    minimumPayment?: boolean;
  };
}
