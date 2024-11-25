// src/services/paymentService.ts
import axios from 'axios';

interface CreatePaymentParams {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  amount: number;
  userId: string | null;
}

export const createPayment = async (params: CreatePaymentParams) => {
  try {
    // Call your backend API to process the payment
    await axios.post('/api/payment', params);
  } catch (error) {
    throw error;
  }
};