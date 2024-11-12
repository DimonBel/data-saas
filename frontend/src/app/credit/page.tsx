// pages/credit-packages.tsx

import React from 'react';
import CreditPackages from '../../components/CreditPackages/CreditPackages';
import AppLayout from '../../components/MainPage/AppLayout';

const CreditPackagesPage: React.FC = () => {
  return (
    <AppLayout>
      <CreditPackages />
    </AppLayout>
  );
};

export default CreditPackagesPage;
