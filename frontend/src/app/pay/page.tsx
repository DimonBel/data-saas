// pages/payment.tsx
import type { NextPage } from 'next';
import PaymentPage from '../../components/PaymentPage/PaymentPage';
import AppLayout from '../../components/MainPage/AppLayout';

const Payment: NextPage = () => {
  return (
    <AppLayout>
      <PaymentPage />
    </AppLayout>
  );
};

export default Payment;