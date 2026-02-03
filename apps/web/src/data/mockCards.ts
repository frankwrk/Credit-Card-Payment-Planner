import { CreditCard } from '../types/card';

export const mockCards: CreditCard[] = [
  {
    id: '1',
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    balance: 3420,
    creditLimit: 10000,
    minimumPayment: 105,
    apr: 21.99,
    dueDate: '2026-02-15',
    statementCloseDate: '2026-02-05',
    currentUtilization: 34.2,
    projectedUtilization: 28.5,
    paymentBeforeStatement: {
      amount: 570,
      date: '2026-02-04',
      explanation: 'Reduces utilization below 30% before reporting'
    },
    paymentByDueDate: {
      amount: 105,
      date: '2026-02-15',
      explanation: 'Minimum payment to avoid late fees'
    },
    excludeFromOptimization: false,
    editedFields: {}
  },
  {
    id: '2',
    name: 'American Express Gold',
    issuer: 'American Express',
    balance: 1850,
    creditLimit: 15000,
    minimumPayment: 55,
    apr: 24.99,
    dueDate: '2026-02-20',
    statementCloseDate: '2026-02-10',
    currentUtilization: 12.3,
    projectedUtilization: 12.3,
    paymentByDueDate: {
      amount: 55,
      date: '2026-02-20',
      explanation: 'Minimum only — low utilization impact'
    },
    excludeFromOptimization: false,
    editedFields: {}
  },
  {
    id: '3',
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    balance: 4200,
    creditLimit: 8000,
    minimumPayment: 125,
    apr: 27.49,
    dueDate: '2026-02-12',
    statementCloseDate: '2026-02-01',
    currentUtilization: 52.5,
    projectedUtilization: 32.5,
    paymentBeforeStatement: {
      amount: 1600,
      date: '2026-01-31',
      explanation: 'High APR — prioritized after statement close'
    },
    paymentByDueDate: {
      amount: 125,
      date: '2026-02-12',
      explanation: 'Minimum to avoid late fees'
    },
    excludeFromOptimization: false,
    editedFields: {
      apr: true
    }
  },
  {
    id: '4',
    name: 'Capital One Quicksilver',
    issuer: 'Capital One',
    balance: 320,
    creditLimit: 5000,
    minimumPayment: 35,
    apr: 19.99,
    dueDate: '2026-02-18',
    statementCloseDate: '2026-02-08',
    currentUtilization: 6.4,
    projectedUtilization: 0,
    paymentByDueDate: {
      amount: 320,
      date: '2026-02-18',
      explanation: 'Smallest balance — snowball'
    },
    excludeFromOptimization: false,
    editedFields: {}
  }
];
