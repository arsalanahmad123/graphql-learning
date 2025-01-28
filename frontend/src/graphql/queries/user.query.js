import { gql } from '@apollo/client';

export const CURRENT_USER = gql`
    query GetCurrentUser {
        authUser {
            _id
            username
            name
            profilePicture 
        }
    }
`;

export const GET_USER_AND_TRANSACTIONS = gql`
        query GetUserAndTransactions($userID: ID!) {
            user(userID: $userID) {
                _id
                username
                name
                profilePicture
                transactions {
                    _id
                    amount
                    paymentType
                    category
                    location
                    date
                }
            }
        }
`