import { Table, Skeleton } from 'antd';

import { JUVENTUS } from '@/graphql/query';
import { useQuery } from '@apollo/client';

const PlayerList = () => {
  let { loading, error, data } = useQuery(JUVENTUS);

  if (loading) {
    return(
      <Skeleton active />
    );
  }

  if (error) return <p>Error !</p>;

  console.info('Juventus Players :', data);

  let size = Object.keys(data.juventuses).length;
  console.log("Length of Data :", size);
  
  let dataArray: any[] = [];

  for (let index = 0; index < size; index++) {
    dataArray.push({
      key: index,
      name: data.juventuses[index].name,
      number: data.juventuses[index].number,
      age: data.juventuses[index].age,
      country: data.juventuses[index].country,
      appearences: data.juventuses[index].appearences,
      goals: data.juventuses[index].goals,
      minutesPlayed: data.juventuses[index].minutesPlayed,
      position: data.juventuses[index].position,
    })
  }

  console.info("Data Array : ", dataArray);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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

  return (
    <Table dataSource={dataArray} columns={columns} />
  );
};

export default PlayerList;
