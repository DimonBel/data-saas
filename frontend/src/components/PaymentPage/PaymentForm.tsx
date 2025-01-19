// components/PaymentPage/PaymentForm.tsx
import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Form, Button, Input, Row, Col, message } from 'antd';
import styles from './PaymentPage.module.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

interface PaymentFormProps {
  amount: number;
}



const PaymentForm: React.FC<PaymentFormProps> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const packageName = searchParams.get('name');

  const onFinish = async () => {
    try {
      setLoading(true);

      // Call the backend to create a Stripe payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const result = await response.json();

      if (result.clientSecret) {
        if (stripe && elements) {
          const cardElement = elements.getElement(CardNumberElement);
          if (!cardElement) throw new Error("Card element not found");

          const paymentResult = await stripe.confirmCardPayment(result.clientSecret, {
            payment_method: {
              card: cardElement,
            },
          });

          if (paymentResult.error) {
            message.error(`Payment failed: ${paymentResult.error.message}`);
          } else if (paymentResult.paymentIntent?.status === 'succeeded') {
            message.success('Payment successful!');

            // Update credits after successful payment
            if (session?.user?.email) {
              const creditResponse = await fetch(`http://localhost:1337/api/credits/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: session.user.email,
                  packageName: packageName,  // Send package name to identify
                }),
              });

              if (creditResponse.ok) {
                const creditResult = await creditResponse.json();
                message.success(`Credits updated! New balance: ${creditResult.newCredits}`);
                router.push('/upload');
              } else {
                message.error('Failed to update credits');
              }
            } else {
              message.error('User not authenticated');
            }
          }
        } else {
          message.error("Stripe or elements not loaded");
        }
      } else {
        message.error('Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      message.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className={styles.paymentForm}
      initialValues={{ amount }}
    >
      <Form.Item
        label={<span style={{ color: 'white' }}>Card Number</span>}
        name="cardNumber"
        rules={[{ required: true, message: 'Please enter your card number' }]}
      >
        <CardNumberElement className={styles.cardInput} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={<span style={{ color: 'white' }}>Expiry Date</span>} name="expiryDate">
            <CardExpiryElement className={styles.cardInput} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={<span style={{ color: 'white' }}>CVC</span>} name="cvc">
            <CardCvcElement className={styles.cardInput} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label={<span style={{ color: 'white' }}>Amount</span>} name="amount">
        <Input prefix="$" value={amount} readOnly className={styles.amountInput} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} className={styles.payButton}>
          Pay Now
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PaymentForm;
