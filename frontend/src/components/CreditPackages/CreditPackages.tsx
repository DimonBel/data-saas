// components/CreditPackages/CreditPackages.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CreditPackage {
  id: number;
  Name: string;
  Credits: number;
  Price: number;
  benefits?: string[];
}

const CreditPackages: React.FC = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<CreditPackage[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/credit-packages");
        const data = await response.json();
        const packagesData = data.data.map((item: any) => ({
          id: item.id,
          Name: item.attributes.Name,
          Credits: item.attributes.Credits,
          Price: item.attributes.Price,
          benefits: item.attributes.benefits || [],
        }));
        setPackages(packagesData);
      } catch (error) {
        console.error("Error fetching credit packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handlePurchase = (pkg: CreditPackage) => {
    router.push(`/pay?amount=${pkg.Price}&name=${pkg.Name}`);
  };

  return (
    <div style={{ padding: '24px', background: '#1e1e1e', minHeight: '100vh' }}>
      <Title level={2} style={{ color: 'white', textAlign: 'center' }}>
        Available Credit Packages
      </Title>
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '40px' }}>
        {packages.map((pkg) => (
          <Col xs={24} sm={12} md={8} key={pkg.id}>
            <Card
              style={{
                background: '#2b2b2b',
                color: 'white',
                textAlign: 'center',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '400px',
                border: '2px solid transparent',
                transition: 'border-color 0.3s ease',
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', flex: '1' }}
              hoverable
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#f0c040';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%', flexGrow: 1 }}>
                <ThunderboltOutlined style={{ fontSize: '48px', color: '#f0c040' }} />
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  {pkg.Name}
                </Title>
                <Text style={{ color: '#bfbfbf', fontSize: '16px', fontWeight: 'bold' }}>
                  {pkg.Credits} credits for ${pkg.Price}
                </Text>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
                  {pkg.benefits?.map((benefit, index) => (
                    <li key={index} style={{ color: '#bfbfbf', marginBottom: '8px' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Space>
              <Button
                type="primary"
                style={{ width: '100%', borderRadius: '4px', marginTop: 'auto' }}
                onClick={() => handlePurchase(pkg)}
              >
                Purchase
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CreditPackages;
