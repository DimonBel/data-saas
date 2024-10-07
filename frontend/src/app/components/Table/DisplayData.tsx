"use client";

import React, { useState, useEffect } from "react";
import { Typography, Table, Radio, Row, Col, Button, Card, message, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { fetchData } from "@/app/services/fetchDataService";
import { calculateTotalCost } from "@/app/services/costService";
import "@/app/style/DisplayData.css";
import { DataItem, ColumnItem } from "@/app/types/data";
import { getColumns } from "@/app/utils/columns";
import { handleEnrichment } from "@/app/utils/enrichment";

const { Title } = Typography;

const DisplayData: React.FC = () => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(0);

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

  const handleEnrichClick = async () => {
    if (!selectedColumn) {
      message.error("Please select a column to enrich.");
      return;
    }
    setIsLoading(true);
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
      </div>
    </div>
  );
};

export default DisplayData;
