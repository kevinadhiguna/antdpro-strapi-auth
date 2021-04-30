import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { ResponseError } from 'umi-request';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

import appConfig from './appConfig.json';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import jwt_decode, { JwtPayload } from 'jwt-decode';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // const currentUser = await queryCurrentUser();
      // return currentUser;

      const userId = localStorage.getItem('id');

      if (userId == null) {
        return undefined;
      } else {
        let currentUser: API.CurrentUser = { userid: userId };
        return currentUser;
      }
    } catch (error) {
      console.info('Current User is undefined :', error);
      history.push(loginPath);
    }
    return undefined;
  };

  // If it is a login page, do not execute
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

/**
 * 异常处理程序
 const codeMessage = {
  200: 'The Server successfully retrieved the requested data.', // OK
  201: 'Successfully created new data.', // Created
  202: 'A request has been received.', // Accepted
  204: 'The data was deleted successfully.', // No Content
  400: 'An error occured in the sent request，the server did not create or modify data.', // Bad Request
  401: 'The user does not have permission（token, username, and password are wrong）.', // Unauthorized
  403: 'The user is authorized，but access is forbidden.', // Forbidden
  404: 'The sent request was for a record that did not exist，hence the server did not operate.', // Not Found
  405: 'The request method is not allowed.', // Method not Allowed
  406: 'The request format is not available.', // Not Acceptable
  410: 'The requested source is permanently deleted and will nolonger be available.', // Gone
  422: 'A validation error occured when creating an object.', // Unprocessable Entity
  500: 'An error occured in the server, please check the server', // Internal Server Error
  502: 'Gateway error.', // Bad Gateway
  503: 'The service is unavailable.', // Service Unavailable
  504: 'The gateway timed out', // Gateway Timeout
 };
 * @see https://beta-pro.ant.design/docs/request-cn
 */

export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    const { messages } = getIntl(getLocale());
    const { response } = error;

    if (response && response.status) {
      const { status, statusText, url } = response;
      const requestErrorMessage = messages['app.request.error'];
      const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
      const errorDescription = messages[`app.request.${status}`] || statusText;
      notification.error({
        message: errorMessage,
        description: errorDescription,
      });
    }

    if (!response) {
      notification.error({
        description: 'Cannot connect to the server, please check your network',
        message: 'Network Error',
      });
    }
    throw error;
  },
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // If you are not logged in, redirect to login screen
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }

      const jwt = localStorage.getItem('jwt');

      if (location.pathname === loginPath) {
        console.info('You are on Login screen');
      } else {
        if (jwt != null) {
          let decoded: JwtPayload;

          // Handle a token which is created intentionally (Invalid JWT)
          try {
            // Decode JWT
            decoded = jwt_decode<JwtPayload>(jwt);
          } catch (error) {
            console.error('Invalid token, please login');
            localStorage.removeItem('jwt');
            history.push(loginPath);
            return;
          }

          if (decoded!.exp != undefined) {
            // Get Current UTC Time
            const utcTime = Math.floor(Date.now() / 1000);

            if (utcTime < decoded!.exp) {
              // If token is not expired, stay in the current screen
              console.info('You are logged in');
            } else {
              console.error('Your token has expired, please login again');

              localStorage.removeItem('jwt');
              history.push(loginPath);
            }
          } else {
            console.info('You have not logged in, please login first !');

            history.push(loginPath);
          }
        }
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>openAPI documentation</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>Business component docs</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

// == This 'httpLink' does not allow to upload a file ==
// const httpLink = createHttpLink({
//   uri: appConfig.graphqlUri,
// });

// == Modified 'httpLink' so it is able to upload a file ==
const httpLink = createUploadLink({
  uri: appConfig.graphqlUri,
});

const authLink = setContext((_, { headers }) => {
  // Get JWT from localStorage if exists
  const token = localStorage.getItem('jwt');

  // return header to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink as any) as any,
  cache: new InMemoryCache(),
});

export function rootContainer(container: React.Component) {
  return <ApolloProvider client={client}>{container}</ApolloProvider>;
}
