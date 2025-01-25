import { ColumnItem } from "../types/data"; // Ensure this import is correct
import { Tooltip } from "antd";
import React from "react";

export const createColumn = (key: string, title: string, width = 250): ColumnItem => ({
    title: title,
    dataIndex: key,
    key,
    width,
    render: (text: string) => {
        const truncatedText = text && text.length > 200 ? `${text.substring(0, 200)}...` : text;
        return (
            <Tooltip placement="topLeft" title={text} >
                <div style={{ maxWidth: `${width}px`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {truncatedText}
                </div>
            </Tooltip>
        );
    },
});

export const getColumns = (data: any[]): ColumnItem[] => {
    if (!data || data.length === 0) {
        return [];
    }
    return Object.keys(data).map((key) =>
        createColumn(key, key, key === "Name" || key === "Email" || key === "Phone" ? 200 : 250)
    );
};
