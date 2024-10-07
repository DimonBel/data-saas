
import React from 'react';
import { Table } from 'antd';

interface Props {
  columns: any[];
  data: any[];
}

const DataTable: React.FC<Props> = ({ columns, data }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      scroll={{ y: 250, x: 'max-content' }}
      bordered={false}
    />
  );
};

export default DataTable;
