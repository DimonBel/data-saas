import React, { useEffect, useState } from 'react';
import { Layout, Card, Avatar, Typography, List, Button, Space, message } from 'antd';
import { UserOutlined, DownloadOutlined } from '@ant-design/icons';
import { fetchDatasets, getFileUrl, Dataset } from '@/services/historyService';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const fetchedDatasets = await fetchDatasets();
        setDatasets(fetchedDatasets);
      } catch (error) {
        message.error('Failed to load datasets');
      } finally {
        setLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) {
    return (
      <Layout style={{ background: '#1e1e1e', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={() => signIn()}>Sign in</Button>
      </Layout>
    );
  }

  const user = {
    name: session?.user?.name || 'Anonymous',
    email: session?.user?.email || 'No email available',
  };

  return (
    <Layout style={{ background: '#1e1e1e', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
        <Card style={{ background: '#2b2b2b', border: 'none', width: '100%' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space align="center" style={{ display: 'flex', justifyContent: 'start', width: '100%', marginLeft: '30px' }}>
              <Avatar size={64} icon={<UserOutlined />} />
              <Space direction="vertical" style={{ textAlign: 'left', marginLeft: '30px' }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>{user.name}</Title>
                <Text style={{ color: '#bfbfbf' }}>{user.email}</Text>
              </Space>
            </Space>

            <Card
              style={{ width: '100%', background: '#363636', border: 'none' }}
              title={<Text strong style={{ color: 'white', fontSize: '18px' }}>Upload History</Text>}
            >
              <List
                loading={loading}
                dataSource={datasets}
                renderItem={(item) => (
                  <List.Item style={{ borderBottom: '1px solid #424242' }}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f0c040' }} />}
                      title={<Text style={{ color: 'white' }}>{item.attributes.name}</Text>}
                      description={
                        <Space direction="vertical">
                          <Text style={{ color: '#bfbfbf' }}>Uploaded: {formatDate(item.attributes.createdAt)}</Text>
                          <Space>
                            <Button
                              icon={<DownloadOutlined />}
                              size="small"
                              onClick={() => item.attributes.originalFile && window.open(getFileUrl(item.attributes.originalFile)!)}
                              disabled={!item.attributes.originalFile}
                              style={{ color: 'white' }}
                            >
                              Original
                            </Button>
                            <Button
                              icon={<DownloadOutlined />}
                              size="small"
                              onClick={() => item.attributes.enrichedFile && window.open(getFileUrl(item.attributes.enrichedFile)!)}
                              disabled={!item.attributes.enrichedFile}
                              style={{ color: 'white' }}
                            >
                              Enriched
                            </Button>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
