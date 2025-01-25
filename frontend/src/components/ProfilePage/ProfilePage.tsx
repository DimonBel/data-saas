import React, { useEffect, useState } from 'react';
import { Layout, Card, Avatar, Typography, List, Button, Space, message } from 'antd';
import { UserOutlined, DownloadOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { getMediaLibraryFiles, getFileUrl } from '@/services/mediaService'; 

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const fetchedFiles = await getMediaLibraryFiles();
        const fileNames = fetchedFiles.map((file: any) => ({
          id: file.id,
          name: file.name,
        }));
        setFiles(fileNames);
      } catch (error) {
        message.error('Failed to load files');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const handleDownload = async (fileId: number) => {
    try {
      const fileUrl = await getFileUrl(fileId.toString());
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = `http://localhost:1337${fileUrl}`;
        link.download = '';
        link.click();
      } else {
        message.error('Failed to get file URL');
      }
    } catch (error) {
      message.error('Failed to open file');
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
              title={<Text strong style={{ color: 'white', fontSize: '18px' }}>Media Library</Text>}
            >
              <List
                loading={loading}
                dataSource={files}
                renderItem={(item) => (
                  <List.Item style={{ borderBottom: '1px solid #424242' }}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f0c040' }} />}
                      title={<Text style={{ color: 'white' }}>{item.name}</Text>}
                      description={
                        <Space direction="vertical">
                          <Space>
                            <Button
                              icon={<DownloadOutlined />}
                              size="small"
                              onClick={() => handleDownload(item.id)}
                              disabled={!item.id}
                              style={{ color: 'grey', backgroundColor: 'black' }}
                            >
                              Download
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