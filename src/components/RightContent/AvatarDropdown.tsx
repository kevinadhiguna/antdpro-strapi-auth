import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';

// Import GraphQL ME Query
import { ME } from '@/graphql/query'; // <- Do not forget to import inside brackets {}

// Import useQuery hook from Apollo Client
import { useQuery } from '@apollo/client';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * Log out and save the current url
 */
const loginOut = async () => {
  await outLogin();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        localStorage.clear() // <- logout functionality : remove all items in local storage including JWT
        return;
      }
      history.push(`/account/${key}`);
    },
    [initialState, setInitialState],
  );

  // Rename 'loading' to 'loadingSpin' to avoid confusion with useQuery hook's 'loading' property
  const loadingSpin = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loadingSpin;
  }

  const { currentUser } = initialState;

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          Personal Center
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          Settings
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        Log out
      </Menu.Item>
    </Menu>
  );

  // Get user ID from local storage
  const id = localStorage.getItem('id');

  let { loading: MeQueryLoading, error: MeQueryError, data: MeQueryData } = useQuery(ME, {
    variables: {
      id,
    },
  });

  if (MeQueryLoading) return loadingSpin;
  if (MeQueryError) console.error('An Apollo client network occured :', MeQueryError);

  // Get username from local storage
  const username = localStorage.getItem('username');

  // == No longer used, please use the logic below to return username and profile picture of user ==
  // if (!currentUser || !currentUser.name) {
  //   return loadingSpin;
  // }

  // == Return loadingSpin component only if either username or Profile Picture URL is false ==
  if (!username || !MeQueryData.user.profpic.url) {
    return loadingSpin;
  }

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={MeQueryData.user.profpic.url} alt="avatar" />
        <span className={`${styles.name} anticon`}>{username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
