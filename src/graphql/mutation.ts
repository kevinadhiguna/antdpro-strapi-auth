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

// Update mutation
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
