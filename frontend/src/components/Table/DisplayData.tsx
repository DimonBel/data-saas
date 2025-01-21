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
import UserService from "@/services/user.service";
import { useSession } from "next-auth/react";
import { useCredits } from "../../app/context/CreditsContext";


const { Title } = Typography;
////------ SAve process 

import axios from "axios";

const DisplayData: React.FC = () => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const { updateCredits, fetchCredits } = useCredits();


  const router = useRouter();

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
    if (!data || data.length === 0) {
      console.error("No data available to save.");
      return;
    }

    // Маппинг данных для первого запроса (Phones)
    const mappedPhones = data.map((item) => {
      let carrierInfo = 1; // Default to 1 (Moldcell or Unknown Carrier)
      if (item.CarrierInfo === "Orange") carrierInfo = 2;

      let phoneType = 1; // Default to 1 (Mobile or Unknown)
      if (item.PhoneType === "fixed_line_or_mobile") phoneType = 2;

      return {
        carrier_info: carrierInfo,
        phone_type: phoneType,
        CountryInfo: item.CountryInfo || "Unknown",
      };
    });

    // Маппинг данных для второго запроса (Linkedins)
    const truncate = (text: string, maxLength: number) =>
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    const mappedLinkedins = data.map((item) => ({
      About: truncate(item.About || "No Data Available", 500), // Обрезать текст до 500 символов
      Skills: truncate(item.Skills || "No Data Available", 300),
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
      // Выполнение первого запроса (Phones)
      const phoneResponses = await Promise.all(
        mappedPhones.map(async (entry) => {
          const response = await axios.post("http://localhost:1337/api/phones", {
            data: {
              carier_info: entry.carrier_info,
              phone_type: entry.phone_type,
              CountryInfo: entry.CountryInfo,
            },
          });
          return response.data.id; // Возвращаем id
        })
      );

      // Выполнение второго запроса (Linkedins)
      const linkedinResponses = await Promise.all(
        mappedLinkedins.map(async (entry) => {
          try {
            const response = await axios.post("http://localhost:1337/api/linkedins", {
              data: entry,
            });
            console.log("Successful LinkedIn entry:", response.data);
            return response.data.id;
          } catch (error) {
            console.error("Error in LinkedIn POST request:", {
              entry,
              serverError: error.response?.data || error.message,
            });
            throw error; // Прекращаем выполнение, чтобы устранить ошибку
          }
        })
      );


      // Выполнение запроса на /enriches
      const enrichPayload = {
        data: {
          linkedins: [1], // IDs LinkedIn
          phones: [1],      // IDs Phones
          users_permissions_users: [3], // Placeholder для пользователей
        },
      };


      console.log({
        linkedins: [linkedinResponses], // ID успешного создания LinkedIn
        phones: [phoneResponses],       // ID телефона, // ID пользователя
      });

      console.log("Sending data to /enriches:", enrichPayload);

      const enrichResponse = await axios.post("http://localhost:1337/api/enriches?populate=*", enrichPayload);

      console.log("POST request to /enriches successful:", enrichResponse.data);
      message.success("Data saved successfully to all endpoints!");
    } catch (error) {
      console.error("Error sending POST requests:", error.response?.data || error.message);
      message.error("Failed to save data.");
    }
  };


  console.log(data)
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
  };
  
  
  
  
  
  

  return (
    <div>
      {enrichmentColumns.length > 0 ? (
        <Card className="selection-card" bordered={false}>
          <Radio.Group onChange={handleColumnChange} value={selectedColumn}>
            <Row justify="center" gutter={[24, 24]}>
              {enrichmentColumns.map(col => (
                <Col key={col.dataIndex}>
                  <Radio value={col.dataIndex} style={{color: "white"}}>{col.title}</Radio>
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
          <Title level={5} style={{color: 'white'}}>Total Cost: {totalCost} credits</Title>
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
            backgroundColor: selectedColumn ? "#BFAFF2" : "#4e4e4e",
            borderColor: selectedColumn ? "#BFAFF2" : "#4e4e4e",
            color: "#fff",
            marginLeft: "10px"
          }}
        >
          Save
        </Button>


      </div>
    </div>
  );
};

export default DisplayData;
