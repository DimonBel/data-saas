// components/PaymentPage/PaymentPage.tsx
"use client";

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Layout, Typography, Space } from 'antd';
import PaymentForm from './PaymentForm';
import { useSearchParams } from 'next/navigation'; // Use useSearchParams instead of useRouter
import styles from './PaymentPage.module.css';

const { Title } = Typography;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get('amount') || '15'); // Default to 15 if not set
  const name = searchParams.get('name') || "Selected Package";

  return (
    <Elements stripe={stripePromise}>
      <Layout className={styles.paymentLayout}>
        <Space direction="vertical" size="large" className={styles.paymentCard}>
          <Title level={3} style={{ color: 'white', textAlign: 'center' }}>
            Make a Payment for {name}
          </Title>
          <PaymentForm amount={amount} />
        </Space>
      </Layout>
    </Elements>
  );
};

export default PaymentPage;
