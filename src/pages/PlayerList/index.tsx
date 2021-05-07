import { Table, Result, Avatar } from 'antd';
import Skeleton from '@ant-design/pro-skeleton';

import { JUVENTUS } from '@/graphql/query';
import { useQuery } from '@apollo/client';

export type TableListItem = {
  key: number;
  name: string;
  avatar: string;
  number: number;
  age: number;
  country: string;
  appearences: number;
  goals: number;
  minutesPlayed: number;
  position: string;
};

const PlayerList = () => {
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

  let dataArray: TableListItem[] = [];

  for (let index = 0; index < size; index++) {
    dataArray.push({
      key: index,
      name: data.juventuses[index].name,
      avatar: data.juventuses[index].profpic.url,
      number: data.juventuses[index].number,
      age: data.juventuses[index].age,
      country: data.juventuses[index].country,
      appearences: data.juventuses[index].appearences,
      goals: data.juventuses[index].goals,
      minutesPlayed: data.juventuses[index].minutesPlayed,
      position: data.juventuses[index].position,
    });
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      width: 150,
      render: (record: any) => (
        // Log 'record' to console to see what is inside for debugging purpose
        <Avatar size="small" shape="circle" src={record} alt="juventus player" />
      ),
    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
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
    },
    {
      title: 'Minutes Played',
      dataIndex: 'minutesPlayed',
      key: 'minutesPlayed',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
  ];

  return <Table dataSource={dataArray} columns={columns} />;
};

export default PlayerList;
