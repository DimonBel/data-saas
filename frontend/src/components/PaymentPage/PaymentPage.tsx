// components/PaymentPage/PaymentPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Use next/navigation for app directory
import { Layout, Card, Typography, Form, Input, Button, Space, message, Row, Col } from 'antd';
import { useSession, signIn } from 'next-auth/react';
import { createPayment } from '@/services/paymentService';
import {
  CreditCardOutlined,
  CalendarOutlined,
  LockOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

interface PaymentFormData {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  amount: number;
}

const PaymentPage: React.FC = () => {
  const searchParams = useSearchParams(); // Get the search params (query parameters)
  const amount = searchParams.get('amount'); // Retrieve 'amount' from query parameters
  const name = searchParams.get('name'); // Retrieve 'name' from query parameters
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (amount) {
      form.setFieldsValue({ amount });
    }
  }, [amount, form]);

const onFinish = async (values: PaymentFormData) => {
  try {
    setLoading(true);

    // Call the create-payment-intent API to get the clientSecret
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: values.amount }),
    });

    const result = await response.json();

    if (result.clientSecret) {
      // Proceed with payment confirmation on the client
      // (Assuming you have Stripe.js integration set up in your frontend)

      message.success('Payment intent created successfully!');
      // Continue payment with clientSecret and Stripe.js
    } else {
      message.error('Failed to create payment intent');
    }
  } catch (error) {
    message.error('Failed to process payment. Please try again.');
  } finally {
    setLoading(false);
  }
};


  if (status === 'loading') return <p>Loading...</p>;
  if (!session) {
    return (
      <Layout style={{ background: '#1e1e1e', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => signIn()}>Sign in</Button>
      </Layout>
    );
  }

  return (
    <Layout style={{ background: '#1e1e1e', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <Card style={{ background: '#2b2b2b', border: 'none', width: '100%', borderRadius: '8px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={3} style={{ color: 'white', textAlign: 'center' }}>
              Make a Payment for {name || "Selected Package"}
            </Title>
            <Form form={form} onFinish={onFinish} layout="vertical" style={{ width: '100%' }}>
              <Form.Item
                name="cardNumber"
                rules={[{ required: true, message: 'Please enter your card number' }]}
              >
                <Input placeholder="Card Number" prefix={<CreditCardOutlined />} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="expirationDate"
                    rules={[{ required: true, message: 'Please enter card expiration date' }]}
                  >
                    <Input placeholder="MM/YY" prefix={<CalendarOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="cvv"
                    rules={[{ required: true, message: 'Please enter your card CVV' }]}
                  >
                    <Input placeholder="CVV" prefix={<LockOutlined />} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="amount" rules={[{ required: true, message: 'Amount is required' }]}>
                <Input prefix={<DollarOutlined />} placeholder="0.00" disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', borderRadius: '4px' }}>
                  Pay Now
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default PaymentPage;
