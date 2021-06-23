import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProField from '@ant-design/pro-field';
import { ProFormRadio } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';

import { Result, Avatar } from 'antd';
import Skeleton from '@ant-design/pro-skeleton';

import { JUVENTUS } from '@/graphql/query';
import { UPDATEJUVENTUS } from '@/graphql/mutation';
import { useMutation, useQuery } from '@apollo/client';

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

// type PlayerDataType = {
//   name?: string;
//   avatar?: string;
//   number?: number;
//   age?: number;
//   country?: string;
//   appearences?: number;
//   goals?: number;
//   minutesPlayed?: number;
//   position?: string;
// };

const EditPlayers: React.FC = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  let { loading: juventusLoading, error: juventusError, data: juventusData } = useQuery(JUVENTUS);

  if (juventusLoading) {
    return <Skeleton type="list" />;
  }

  if (juventusError) {
    return (
      <Result
        status="error"
        title="Something went wrong..."
        subTitle="Please check your network or try again later"
      />
    );
  }

  let size = Object.keys(juventusData.juventuses).length;

  const playerData: DataSourceType[] = [];

  for (let i = 0; i < size; i++) {
    playerData.push({
      key: i,
      name: juventusData.juventuses[i].name,
      avatar: juventusData.juventuses[i].profpic?.url,
      number: juventusData.juventuses[i].number,
      age: juventusData.juventuses[i].age,
      country: juventusData.juventuses[i].country,
      appearences: juventusData.juventuses[i].appearences,
      goals: juventusData.juventuses[i].goals,
      minutesPlayed: juventusData.juventuses[i].minutesPlayed,
      position: juventusData.juventuses[i].position,
    });
  }

  // const [updateJuventus] = useMutation(UPDATEJUVENTUS);

  // const handleUpdate = async (values: PlayerDataType) => {
  // 	console.log(values.name);
  // 	await updateJuventus({
  // 		variables: {
  // 			input: {
  // 				id: "",
  // 			},
  // 			data: {
  // 				name: values.name,
  // 				number: values.number,
  // 				age: values.age,
  // 				country: values.country,
  // 				appearences: values.appearences,
  // 				goals: values.goals,
  // 				minutesPlayed: values.minutesPlayed,
  // 				position: values.position,
  // 			}
  // 		}
  // 	});
  // }

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
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
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
          onSave: async (values) => {
            // await handleUpdate(values as PlayerDataType);
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
