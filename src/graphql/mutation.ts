import { gql } from '@apollo/client';

// Login mutation
export const LOGIN = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        username
        email
        confirmed
        blocked
        role {
          id
          name
          description
          type
        }
      }
    }
  }
`;

// Create a new record
export const CREATEJUVENTUS = gql`
	mutation CreateJuventus($input: createJuventusInput) {
		createJuventus(input: $input) {
			juventus {
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
	}
`;

// Update a record
export const UPDATEJUVENTUS = gql`
	mutation UpdateJuventus($input: updateJuventusInput) {
		updateJuventus(input: $input) {
			juventus {
				id
				name
				number
				age
				country
				appearences
				goals
				minutesPlayed
				minutesPlayed
				position
				profpic {
					name
				}
			}
		}
	}  
`;
