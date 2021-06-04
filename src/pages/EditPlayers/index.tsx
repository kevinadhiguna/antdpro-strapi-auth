import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProField from '@ant-design/pro-field';
import { ProFormRadio } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';

import { Result, Avatar } from 'antd';
import Skeleton from '@ant-design/pro-skeleton';

import { JUVENTUS } from '@/graphql/query';
import { useQuery } from '@apollo/client';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  key: number;
  name?: string;
  avatar?: string;
  number?: number;
  age?: number;
  country?: string;
  appearences?: number;
  goals?: number;
  minutesPlayed?: number;
  position?: string;
};

const EditPlayers: React.FC = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  let { loading, error, data } = useQuery(JUVENTUS);

  if (loading) {
    return <Skeleton type="list" />;
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Something went wrong..."
        subTitle="Please check your network or try again later"
      />
    );
  }

  let size = Object.keys(data.juventuses).length;

  const playerData: DataSourceType[] = [];

  for (let i = 0; i < size; i++) {
    playerData.push({
      key: i,
      name: data.juventuses[i].name,
      avatar: data.juventuses[i].profpic.url,
      number: data.juventuses[i].number,
      age: data.juventuses[i].age,
      country: data.juventuses[i].country,
      appearences: data.juventuses[i].appearences,
      goals: data.juventuses[i].goals,
      minutesPlayed: data.juventuses[i].minutesPlayed,
      position: data.juventuses[i].position,
    });
  }

  // const columns: ProColumns<DataSourceType>[] = [
  //   {
  //     title: 'Event Name',
  //     dataIndex: 'title',
  //     formItemProps: (form, { rowIndex }) => {
  //       return {
  //         rules: rowIndex > 2 ? [{ required: true, message: 'This is required' }] : [],
  //       };
  //     },
  //     // Editing is not allowed on the second line
  //     editable: (text, record, index) => {
  //       return index !== 0;
  //     },
  //     width: '30%',
  //   },
  //   {
  //     title: 'Status',
  //     key: 'state',
  //     dataIndex: 'state',
  //     valueType: 'select',
  //     valueEnum: {
  //       all: { text: 'All', status: 'Default' },
  //       open: {
  //         text: 'Unsolved',
  //         status: 'Error',
  //       },
  //       closed: {
  //         text: 'Solved',
  //         status: 'Success',
  //       },
  //     },
  //   },
  //   {
  //     title: 'Description',
  //     dataIndex: 'decs',
  //     fieldProps: (from, { rowKey, rowIndex }) => {
  //       if (from.getFieldValue([rowKey || '', 'title']) === '不好玩') {
  //         return {
  //           disabled: true,
  //         };
  //       }
  //       if (rowIndex > 9) {
  //         return {
  //           disabled: true,
  //         };
  //       }
  //       return {};
  //     },
  //   },
  //   {
  //     title: 'Activity Time',
  //     dataIndex: 'created_at',
  //     valueType: 'date',
  //   },
  //   {
  //     title: 'Operation',
  //     valueType: 'option',
  //     width: 200,
  //     render: (text, record, _, action) => [
  //       <a
  //         key="editable"
  //         onClick={() => {
  //           action?.startEditable?.(record.key);
  //         }}
  //       >
  //         Edit
  //       </a>,
  //       <a
  //         key="delete"
  //         onClick={() => {
  //           setDataSource(dataSource.filter((item) => item.key !== record.key));
  //         }}
  //       >
  //         Delete
  //       </a>,
  //     ],
  //   },
  // ];

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (record: any) => (
        // Log 'record' to console to see what is inside for debugging purpose
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} // <- Adjust avatars' responsiveness
          shape="circle"
          src={record}
          alt="juventus player"
        />
      ),
    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      width: '10%',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: '13%',
    },
    {
      title: 'Appearence(s)',
      dataIndex: 'appearences',
      key: 'appearences',
    },
    {
      title: 'Goal(s)',
      dataIndex: 'goals',
      key: 'goals',
      width: '7%',
    },
    {
      title: 'Minutes Played',
      dataIndex: 'minutesPlayed',
      key: 'minutesPlayed',
      width: '8%',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: '10%',
    },
    {
      title: 'Operation',
      valueType: 'option',
      width: '12%',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.key);
          }}
        >
          Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.key !== record.key));
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="Editable Table"
        maxLength={5}
        // recordCreatorProps={
        //   position !== 'hidden'
        //     ? {
        //         position: position as 'top',
        //         record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
        //       }
        //     : false
        // }
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value),
            }}
            options={[
              {
                label: 'Add to the top',
                value: 'top',
              },
              {
                label: 'Add to the bottom',
                value: 'bottom',
              },
              {
                label: 'Hide',
                value: 'hidden',
              },
            ]}
          />,
        ]}
        columns={columns}
        request={async () => ({
          data: playerData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async () => {
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
        }}
      />
      <ProCard title="Tabular Data" headerBordered collapsible defaultCollapsed>
        <ProField
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};

export default EditPlayers;
