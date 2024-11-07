// app/packages/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Spin } from "antd";
import AppLayout from "@/components/MainPage/AppLayout";
import { getCreditPackages } from "@/services/packageService";

const { Title, Paragraph } = Typography;

interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: number;
}

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await getCreditPackages();
        setPackages(data);
      } catch (error) {
        console.error("Failed to load packages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-10 px-6 text-center">
        <Title className="text-white mb-6">Purchase Credit Packages</Title>
        <Paragraph className="text-gray-400 mb-8">
          Choose from a variety of credit packages to enhance your data enrichment experience.
        </Paragraph>
        {loading ? (
          <Spin size="large" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                title={pkg.name}
                bordered={false}
                className="bg-gray-800 text-white shadow-lg"
                headStyle={{ color: "#BFAFF2" }}
                bodyStyle={{ color: "#e5e7eb" }}
                style={{ borderColor: "#D6B0FF" }}
              >
                <Paragraph>Credits: {pkg.credits}</Paragraph>
                <Paragraph>Price: ${pkg.price.toFixed(2)}</Paragraph>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#D6B0FF",
                    borderColor: "#D6B0FF",
                    color: "black",
                  }}
                  onClick={() => handlePurchase(pkg.id)}
                >
                  Buy Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const handlePurchase = (packageId: number) => {
  // Placeholder function for initiating the purchase
  console.log(`Purchasing package ID: ${packageId}`);
};

export default PackagesPage;
