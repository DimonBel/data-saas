'use client';

import React from 'react';
import { Row, Col, Typography, Button, Image, notification } from 'antd';
import Link from "next/link";
import { useSession, signIn } from 'next-auth/react';

const { Title, Paragraph } = Typography;

const MainPageContent = () => {
  const { data: session } = useSession();

  const handleEnrichClick = () => {
    if (!session) {
      notification.warning({
        message: 'Sign In Required',
        description: 'Please sign in to access the dataset enrichment feature.',
        placement: 'top',
      });
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: '70vh',
        background: '#1a1a1a',
        color: 'white',
        display: 'flex',
        padding: '0 20px',
        width: '70%',
        maxWidth: '1200px',
      }}
    >
      <Col xs={24} md={16} lg={12} style={{ textAlign: 'center' }}>
        <Title
          level={1}
          style={{
            color: 'white',
            fontSize: '42px',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}
        >
          SaaS Dataset Enrichment
        </Title>
        <Paragraph style={{ color: '#a0a0a0', fontSize: '16px', marginBottom: '24px' }}>
          Upload datasets related to organizations or people, match columns within the dataset, and enrich the data using AI-driven prompts.
        </Paragraph>
        {session ? (
          <>
            <Link href="/upload">
              <Button
                type="primary"
                size="large"
                style={{
                  background: '#f0c040',
                  borderColor: '#f0c040',
                  color: 'black',
                  padding: '8px 32px'
                }}
              >
                Enrich
              </Button>
            </Link>
            <Link href="/credit">
              <Button
                type="primary"
                size="large"
                style={{
                  background: '#f0c040',
                  borderColor: '#f0c040',
                  color: 'black',
                  padding: '8px 32px',
                  marginLeft: '16px'
                }}
              >
                Buy Credits
              </Button>
            </Link>
          </>
        ) : (
          <Button
            type="primary"
            size="large"
            style={{
              background: '#f0c040',
              borderColor: '#f0c040',
              color: 'black',
              padding: '8px 32px'
            }}
            onClick={handleEnrichClick}
          >
            Enrich
          </Button>
        )}
      </Col>

      <Col xs={24} md={16} lg={12} style={{ textAlign: 'center', marginTop: '32px' }}>
        <Image
          src="/data.jpg"
          alt="Data illustration"
          preview={false}
          style={{
            borderRadius: '8px',
            maxHeight: '300px',
            maxWidth: '100%',
            objectFit: 'cover'
          }}
        />
      </Col>
    </Row>
  );
};

export default MainPageContent;