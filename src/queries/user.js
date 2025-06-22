import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const GET_USER_DATA = gql`
  query User {
    user {
      id
      username
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      user {
        id
        username
      }
    }
  }
`;
