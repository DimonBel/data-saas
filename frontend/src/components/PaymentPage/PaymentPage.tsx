"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Form, Input, Button, Space, message } from 'antd';
import { useSession } from 'next-auth/react';
import { createPayment } from '@/services/paymentService';
import { calculateTotalCost } from '@/services/costService';

const { Content } = Layout;
const { Title, Text } = Typography;

interface PaymentFormData {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  amount: number;
}

const PaymentPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const rows = 100; // Replace with actual data for rows
    const column = "Phone"; // Replace with actual data for column

    const calculatedAmount = calculateTotalCost(rows, column);
    form.setFieldsValue({ amount: calculatedAmount });
  }, [form]);

  const onFinish = async (values: PaymentFormData) => {
    try {
      setLoading(true);
      await createPayment({
        cardNumber: values.cardNumber,
        expirationDate: values.expirationDate,
        cvv: values.cvv,
        amount: values.amount,
        userId: session?.user?.id,
      });
      message.success('Payment successful!');
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
      <Content style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
        <Card style={{ background: '#2b2b2b', border: 'none', width: '100%' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={3} style={{ color: 'white', textAlign: 'center' }}>
              Make a Payment
            </Title>
            <Form form={form} onFinish={onFinish} layout="vertical" style={{ width: '100%' }}>
              <Form.Item
                name="cardNumber"
                label={<Text style={{ color: 'white' }}>Card Number</Text>}
                rules={[{ required: true, message: 'Please enter your card number' }]}
              >
                <Input placeholder="XXXX XXXX XXXX XXXX" style={{ color: 'Black' }} />
              </Form.Item>
              <Form.Item
                name="expirationDate"
                label={<Text style={{ color: 'white' }}>Expiration Date</Text>}
                rules={[{ required: true, message: 'Please enter your card expiration date' }]}
              >
                <Input placeholder="MM/YY" style={{ color: 'Black' }} />
              </Form.Item>
              <Form.Item
                name="cvv"
                label={<Text style={{ color: 'white' }}>CVV</Text>}
                rules={[{ required: true, message: 'Please enter your card CVV' }]}
              >
                <Input placeholder="XXX" style={{ color: 'Black' }} />
              </Form.Item>
              <Form.Item
                name="amount"
                label={<Text style={{ color: 'white' }}>Amount</Text>}
                rules={[{ required: true, message: 'Amount is required' }]}
              >
                <Input type="number" placeholder="0.00" style={{ color: 'white' }} disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                  Pay
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
