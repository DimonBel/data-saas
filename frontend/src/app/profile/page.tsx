"use client"
import type { NextPage } from 'next';
import ProfilePage from '../../components/ProfilePage/ProfilePage';
import AppLayout from '../../components/MainPage/AppLayout';

const Profile: NextPage = () => {
  const user = {
    name: 'Name Surname',
    email: 'gmaillala@gmail.com'
  };

  return (
    <AppLayout>
      <ProfilePage />
    </AppLayout>
  );
};

export default Profile;