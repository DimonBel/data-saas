import React, { useState, useEffect } from "react";
import { Upload, Button, message, Form, Tag, Row, Col } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import FileService from "@/services/fileService";
import "@/style/FileUploader.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserService from "@/services/user.service";

const { Dragger } = Upload;

interface User {
  id?: string;
  name?: string;
  email: string;
  image?: string;
}

const FileUploader: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const router = useRouter();
  const columnSuggestions = [
    "email", "function", "country", "name", "surname",
    "phone", "language", "gender",
  ];
  const [user, setUser] = useState<User | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      setUser(session.user as User);
      getID();
    }
  }, [session]);

  const getID = async () => {
    const email = session?.user?.email;
    const userId = await UserService.getUserIdByEmail(email || "");
    setUserID(userId);
    return userId;
  }


  const handleFileParse = async (file: File) => {
    try {
      const { columns, data } = await FileService.parseFile(file);
      setColumns(columns);
      setParsedData(data);
      message.success("File parsed successfully");
    } catch {
      message.error("Failed to parse file");
    }
  };

  const uploadProps = {
    accept: ".csv,.xls,.xlsx",
    beforeUpload: (file: File) => {
      const isCSVorExcel =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "text/csv";

      if (!isCSVorExcel) {
        message.error("You can only upload CSV or Excel files!");
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      handleFileParse(file);
      return false; // Prevent automatic upload
    },
    fileList,
    multiple: false,
    onRemove: (file: any) => {
      setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    },
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file before submitting!");
      return;
    }

    setLoading(true);
    try {
      const uploadedFile = await FileService.uploadFileToStrapi(fileList[0]);
      const datasetName = fileList[0].name.split(".").slice(0, -1).join(".");
      const dataset = await FileService.createDataset({
        data: {
          filename: datasetName,
          columns,
          uploaded: new Date().toISOString(),
          file: uploadedFile[0].id,
          user: userID,
        },
      });

      await FileService.uploadRows(parsedData, dataset.data.id);
      message.success("File and metadata uploaded successfully");
      // router.push("/preview");
    } catch (error: any) {
      message.error(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2 style={{ color: "#e5e7eb" }}>Upload CSV or Excel File</h2>
      <Form layout="vertical">
        <Form.Item label={<span style={{ color: "#e5e7eb" }}>File</span>}>
          <Dragger {...uploadProps} style={{ backgroundColor: "#2d2d2d", borderColor: "#BFAFF2", color: "#BFAFF2" }}>
            <p className="ant-upload-drag-icon" style={{ color: "#BFAFF2" }}>
              <InboxOutlined style={{ color: "#BFAFF2" }} />
            </p>
            <p className="ant-upload-text" style={{ color: "#e5e7eb", marginBottom: "14px" }}>
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint" style={{ color: "#9a9a9a", marginBottom: "24px" }}>
              Support for a single upload. Please select a CSV or Excel file.
            </p>
            <div style={{ marginBottom: "14px", color: "#e5e7eb" }}>
              <p style={{ color: "#e5e7eb", marginBottom: "8px" }}>
                Upload a CSV file with this recommended layout:
              </p>
              <Row gutter={[8, 8]}>
                {columnSuggestions.map((col, index) => (
                  <Col key={index}>
                    <Tag color="geekblue" style={{ backgroundColor: "#BFAFF2", color: "#2d2d2d", fontWeight: "bold" }}>
                      {col}
                    </Tag>
                  </Col>
                ))}
              </Row>
              <p style={{ color: "#9a9a9a", marginTop: "8px" }}>
                All elements except these will be inserted as additional extra fields.
              </p>
            </div>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleUpload}
            loading={loading}
            disabled={fileList.length === 0}
            style={{
              backgroundColor: fileList.length === 0 ? "#4e4e4e" : "#BFAFF2",
              borderColor: fileList.length === 0 ? "#4e4e4e" : "#BFAFF2",
              color: fileList.length === 0 ? "#b1b1b1" : "#fff",
            }}
          >
            Upload
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FileUploader;