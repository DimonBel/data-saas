"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  Radio,
  Row,
  Col,
  Button,
  Card,
  message,
  Spin,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { fetchData } from "@/services/fetchDataService";
import { calculateTotalCost } from "@/services/costService";
import UserService from "@/services/user.service";
import { getColumns } from "@/utils/columns";
import { handleEnrichment } from "@/utils/enrichment";
import { useCredits } from "../../app/context/CreditsContext";

import "@/style/DisplayData.css";

import axios from "axios";

const { Title } = Typography;

type TogetherData = { name: string; value: string }; // Example structure
type DataItem = {
  id: number;
  name: string;
  value: string;
  CarrierInfo?: string;
  PhoneType?: string;
  CountryInfo?: string;
  About?: string;
  Skills?: string;
  Certifications?: string;
  Projects?: string;
  Honors?: string;
  Experience?: string;
  Education?: string;
  Company?: string;
  CompanyIndustry?: string;
  Location?: string;
};

type ColumnItem = {
  title: string;
  dataIndex: string;
  key: string;
};

const DisplayData: React.FC = () => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [totalCost, setTotalCost] = useState<number>(0);

  const { data: session } = useSession();
  const { updateCredits, fetchCredits } = useCredits();

  const router = useRouter();

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsFetchingData(true);
      try {
        const fetchedData: DataItem[] = await fetchData();
        setData(fetchedData);
        setColumns(getColumns(fetchedData));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchDataAsync();
  }, []);

  useEffect(() => {
    if (selectedColumn) {
      const newCost = calculateTotalCost(data.length, selectedColumn);
      setTotalCost(newCost);
    } else {
      setTotalCost(0);
    }
  }, [selectedColumn, data]);

  const enrichmentColumns = columns.filter(
    (col) => col.dataIndex === "Phone" || col.dataIndex === "LinkedIn"
  );

  const handleColumnChange = (e: any) => {
    setSelectedColumn(e.target.value);
  };

  const handleSaveClick = async () => {
    if (!data || data.length === 0) {
      message.error("No data available to save.");
      return;
    }

    const mappedPhones = data.map((item) => ({
      carrier_info: item.CarrierInfo === "Orange" ? 2 : 1,
      phone_type: item.PhoneType === "fixed_line_or_mobile" ? 2 : 1,
      CountryInfo: item.CountryInfo || "Unknown",
    }));

    const mappedLinkedins = data.map((item) => ({
      About: item.About || "No Data Available",
      Skills: item.Skills || "No Data Available",
      Certification: item.Certifications || "No Data Available",
      Projects: item.Projects || "No Data Available",
      Honors: item.Honors || "No Data Available",
      Experience: item.Experience || "No Data Available",
      Education: item.Education || "No Data Available",
      Company: item.Company || "No Data Available",
      Industry: item.CompanyIndustry || "No Data Available",
      Location: item.Location || "No Data Available",
    }));

    try {
      const phoneResponses = await Promise.allSettled(
        mappedPhones.map((entry) =>
          axios.post("http://localhost:1337/api/phones", { data: entry })
        )
      );

      const linkedinResponses = await Promise.allSettled(
        mappedLinkedins.map((entry) =>
          axios.post("http://localhost:1337/api/linkedins", { data: entry })
        )
      );

      const successfulPhones = phoneResponses.filter(
        (res) => res.status === "fulfilled"
      );
      const successfulLinkedins = linkedinResponses.filter(
        (res) => res.status === "fulfilled"
      );

      if (successfulPhones.length === 0 || successfulLinkedins.length === 0) {
        message.error("Some entries failed to save. Please check the logs.");
      } else {
        message.success("Data saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Failed to save data.");
    }
  };

  const handleEnrichClick = async () => {
    if (!selectedColumn) {
      message.error("Please select a column to enrich.");
      return;
    }

    setIsLoading(true);

    try {
      if (!session || !session.user?.email) {
        message.error("User email not found. Please log in.");
        setIsLoading(false);
        return;
      }

      const userEmail = session.user.email;
      const userCredits = await UserService.getUserCreditsByEmail(userEmail);

      if (userCredits === null) {
        message.error("Failed to retrieve user credits.");
        setIsLoading(false);
        return;
      }

      if (userCredits < totalCost) {
        message.error(
          `Insufficient credits. You have ${userCredits} credits, but need ${totalCost}.`
        );
        setIsLoading(false);
        return;
      }

      const enrichedData = await handleEnrichment(data, selectedColumn);

      setData(enrichedData);
      setColumns(getColumns(enrichedData));

      const updatedCredits = userCredits - totalCost;
      const userId = await UserService.getUserIdByEmail(userEmail);

      if (!userId) {
        message.error("Failed to retrieve user ID.");
        setIsLoading(false);
        return;
      }

      const updateCreditsResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users/${userId}`,
        {
          credits: updatedCredits,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (updateCreditsResponse.status === 200) {
        message.success("Data enrichment completed successfully!");
        updateCredits(updatedCredits);
      } else {
        message.error("Failed to update user credits.");
      }
    } catch (error) {
      console.error("Error during enrichment process:", error);
      message.error("An error occurred during enrichment.");
    } finally {
      setIsLoading(false);
      setSelectedColumn(null);
    }
  };

  return (
    <div>
      {isFetchingData ? (
        <div className="loading-container">
          <Spin size="large" />
          <Title level={4} style={{ marginTop: "20px" }}>
            Loading data...
          </Title>
        </div>
      ) : (
        <>
          {enrichmentColumns.length > 0 ? (
            <Card className="selection-card" bordered={false}>
              <Radio.Group onChange={handleColumnChange} value={selectedColumn}>
                <Row justify="center" gutter={[24, 24]}>
                  {enrichmentColumns.map((col) => (
                    <Col key={col.dataIndex}>
                      <Radio value={col.dataIndex}>{col.title}</Radio>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            </Card>
          ) : (
            <div className="no-data">No enrichable columns available.</div>
          )}

          {data.length > 0 ? (
            <Card className="table-card" bordered={false}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="id"
                scroll={{ y: 250, x: "max-content" }}
              />
            </Card>
          ) : (
            <div className="no-data">No data available to display.</div>
          )}

          {selectedColumn && (
            <div className="total-cost">
              <Title level={5}>Total Cost: {totalCost} credits</Title>
            </div>
          )}

          <div className="button-container">
            <Button
              type="primary"
              onClick={handleEnrichClick}
              icon={<CheckOutlined />}
              loading={isLoading}
              disabled={!selectedColumn}
            >
              {isLoading ? "Enriching..." : "Enrich"}
            </Button>

            <Button
              type="primary"
              onClick={handleSaveClick}
              style={{ marginLeft: "10px" }}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayData;
