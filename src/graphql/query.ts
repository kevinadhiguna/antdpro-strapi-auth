import { gql } from '@apollo/client';

// Me Query to get current user info
export const ME = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      createdAt
      updatedAt
      username
      email
      provider
      confirmed
      blocked
      role {
        name
      }    
      profpic {
        name
        alternativeText
        url
        previewUrl
        provider
      }
    }
  }
`;
