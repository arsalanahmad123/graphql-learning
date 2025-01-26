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
