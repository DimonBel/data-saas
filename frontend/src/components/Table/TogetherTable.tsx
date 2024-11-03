"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Tooltip } from "antd";
import { fetchTogetherData, TogetherData } from "@/app/services/togetherService";
import { useRouter } from "next/navigation";
import styles from "@/app/style/TogetherTable.module.css";

const createColumn = (key: string, title: string, width: number = 250) => ({
  title: (
    <Tooltip title={title}>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          maxWidth: "120px",
        }}
      >
        {title}
      </span>
    </Tooltip>
  ),
  dataIndex: key,
  key,
  width,
  render: (text: string) => {
    const truncatedText = text && text.length > 200 ? `${text.substring(0, 200)}...` : text;
    return (
      <Tooltip placement="topLeft" title={text}>
        <div
          style={{
            maxWidth: `${width}px`,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {truncatedText}
        </div>
      </Tooltip>
    );
  },
});


const getColumns = (data: TogetherData[]) =>
  Object.keys(data[0] || {}).map((key: string) => {
    let columnWidth = 250;
    if (key === "Name" || key === "Email" || key === "Phone") {
      columnWidth = 200;
    }
    return createColumn(key, key, columnWidth);
  });

const TogetherTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<TogetherData[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTogetherData();
        setDataSource(data);
        setColumns(getColumns(data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleNextClick = () => {
    router.push("/enrich");
  };

  return (
    <div>
      <div className={styles.container}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ y: 250, x: 'max-content' }}
          bordered={false} // Remove table borders
          className={styles.table}
        />

      </div>
      <Button
        type="primary"
        onClick={handleNextClick}
        className={styles.nextButton}
        style={{ backgroundColor: "#BFAFF2" }}
      >
        Next
      </Button>
    </div>

  );
};

export default TogetherTable;
