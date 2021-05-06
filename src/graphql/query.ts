import { gql } from '@apollo/client';

// USER Query to get current user info
export const USER = gql`
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

// JUVENTUS query to get all data in Juventus collection-type
export const JUVENTUS = gql`
  query getJuventusPlayers {
    juventuses {
      id
      name
      number
      age
      country
      appearences
      goals
      minutesPlayed
      position
    }
  }
`;
