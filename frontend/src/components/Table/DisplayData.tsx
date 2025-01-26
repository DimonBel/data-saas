"use client";

import React, { useState, useEffect } from "react";
import { Typography, Table, Radio, Row, Col, Button, Card, message, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { fetchData } from "@/services/fetchDataService";
import { calculateTotalCost } from "@/services/costService";
import "@/style/DisplayData.css";
import { DataItem, ColumnItem } from "@/types/data";
import { getColumns } from "@/utils/columns";
import { handleEnrichment } from "@/utils/enrichment";
import axios from "axios";

import UserService from "@/services/user.service";
import { useSession } from "next-auth/react";
import { useCredits } from "../../app/context/CreditsContext";

const { Title } = Typography;

const DisplayData: React.FC = () => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[]>([]); 
  const [columns, setColumns] = useState<ColumnItem[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const router = useRouter();

  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const { updateCredits, fetchCredits } = useCredits();

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        setColumns(getColumns(fetchedData));
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const enrichmentColumns = columns.filter(col => col.dataIndex === "Phone" || col.dataIndex === "LinkedIn");

  const handleColumnChange = (e: any) => {
    setSelectedColumn(e.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const fileContent = JSON.stringify(data, null, 2);
      const file = new Blob([fileContent], { type: "application/json" });
      const formData = new FormData();
      formData.append("files", file, "data.json");

      const response = await axios.post("http://localhost:1337/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, 
        },
      });

      if (response.status === 200) {
        message.success("File saved and uploaded to Strapi successfully!");
      } else {
        message.error("Failed to upload the file to Strapi.");
      }
    } catch (error) {
      console.error("Error saving the file:", error);
      message.error("An error occurred while saving the file.");
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

      // Fetch credits
      const userCredits = await UserService.getUserCreditsByEmail(userEmail);

      if (userCredits === null) {
        message.error("Failed to retrieve user credits.");
        setIsLoading(false);
        return;
      }

      if (userCredits < totalCost) {
        message.error(`Insufficient credits. You have ${userCredits} credits, but need ${totalCost}.`);
        setIsLoading(false);
        return;
      }

      const enrichedData = await handleEnrichment(data, selectedColumn);

      setData(enrichedData);
      setColumns(getColumns(enrichedData));

      // Deduct credits and update backend
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
            'Content-Type': 'application/json',
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


    const enrichedData = await handleEnrichment(data, selectedColumn);
    setData(enrichedData);
    setColumns(getColumns(enrichedData));
    setIsLoading(false);
    message.success("Data enrichment completed successfully!");
    setSelectedColumn(null);
  };

  return (
    <div>
      {enrichmentColumns.length > 0 ? (
        <Card className="selection-card" bordered={false}>
          <Radio.Group onChange={handleColumnChange} value={selectedColumn}>
            <Row justify="center" gutter={[24, 24]}>
              {enrichmentColumns.map(col => (
                <Col key={col.dataIndex}>
                  <Radio value={col.dataIndex}>{col.title}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Card>
      ) : (
        <div className="no-data">No enrichable columns available in the dataset.</div>
      )}

      {data.length > 0 ? (
        <Card className="table-card" bordered={false}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="id"
            scroll={{ y: 250, x: "max-content" }}
            bordered={false}
          />
        </Card>
      ) : (
        <div className="no-data">No data available to display.</div>
      )}

      {selectedColumn && (
        <div className="total-cost">
          <Title level={5}>Total Cost: ${totalCost.toFixed(2)}</Title>
        </div>
      )}

      <div className="button-container">
        <Button
          type="primary"
          onClick={handleEnrichClick}
          icon={<CheckOutlined />}
          loading={isLoading}
          disabled={!selectedColumn}
          style={{
            borderRadius: "10px",
            padding: "12px 40px",
            fontSize: "16px",
            backgroundColor: selectedColumn ? "#BFAFF2" : "#4e4e4e",
            borderColor: selectedColumn ? "#BFAFF2" : "#4e4e4e",
            color: "#fff",
          }}
        >
          {isLoading ? "Enriching..." : "Enrich"}
        </Button>

        <Button
          type="primary"
          onClick={handleSaveClick}
          style={{
            borderRadius: "10px",
            padding: "12px 40px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
            color: "#fff",
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default DisplayData;