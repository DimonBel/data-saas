export const getMediaLibraryFiles = async () => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;

  try {
    const response = await fetch('http://localhost:1337/api/upload/files', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch media files');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching media files:', error);
    return [];
  }
};

export const getFileUrl = async (fileId: string) => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN; 
  try {
    const response = await fetch(`http://localhost:1337/api/upload/files/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    const fileData = await response.json();
    return fileData?.url || '';
  } catch (error) {
    console.error('Error fetching file:', error);
    return '';
  }
};