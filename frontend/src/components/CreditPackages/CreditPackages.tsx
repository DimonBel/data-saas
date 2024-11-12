// components/CreditPackages/CreditPackages.tsx
"use client";
import React from 'react';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import {
  CheckCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface CreditPackage {
  name: string;
  credits: number;
  price: number;
  benefits: string[];
}

const packages: CreditPackage[] = [
  {
    name: 'Basic Package',
    credits: 100,
    price: 10,
    benefits: ['Access to basic features', 'Email support'],
  },
  {
    name: 'Standard Package',
    credits: 500,
    price: 15,
    benefits: ['Everything in Basic', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Premium Package',
    credits: 1000,
    price: 20,
    benefits: [
      'Everything in Standard',
      'Personal account manager',
      'Custom solutions',
    ],
  },
];

const CreditPackages: React.FC = () => {
  const handlePurchase = (pkg: CreditPackage) => {
    // Handle the purchase logic here
    console.log(`Purchasing ${pkg.name}`);
  };

  return (
    <div
      style={{
        padding: '24px',
        background: '#1e1e1e',
        minHeight: '100vh',
      }}
    >
      <Title level={2} style={{ color: 'white', textAlign: 'center' }}>
        Available Credit Packages
      </Title>
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '40px' }}>
        {packages.map((pkg) => (
          <Col xs={24} sm={12} md={8} key={pkg.name}>
            <Card
              style={{
                background: '#2b2b2b',
                color: 'white',
                textAlign: 'center',
                borderRadius: '8px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
              hoverable
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: '100%', flexGrow: 1 }}
              >
                <ThunderboltOutlined
                  style={{ fontSize: '48px', color: '#f0c040' }}
                />
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  {pkg.name}
                </Title>
                <Text style={{ color: '#bfbfbf', fontSize: '16px' }}>
                  {pkg.credits} credits for ${pkg.price}
                </Text>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {pkg.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      style={{ color: '#bfbfbf', marginBottom: '8px' }}
                    >
                      <CheckCircleOutlined
                        style={{ color: '#52c41a', marginRight: '8px' }}
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
                {/* Spacer to push the button to the bottom */}
                <div style={{ flexGrow: 1 }} />
                <Button
                  type="primary"
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    marginTop: 'auto' ,
                  }}
                  onClick={() => handlePurchase(pkg)}
                >
                  Purchase
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CreditPackages;
