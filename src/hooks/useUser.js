import { useQuery, useMutation } from '@apollo/client';
import {
  CREATE_USER_MUTATION,
  GET_USER_DATA,
  LOGIN_MUTATION,
} from '../queries/user';

// 1. Hook para queries
export function useGetUserData() {
  return useQuery(GET_USER_DATA);
}

// 2. Hooks para mutations
export function useLoginMutation() {
  return useMutation(LOGIN_MUTATION);
}

export function useCreateUserMutation() {
  return useMutation(CREATE_USER_MUTATION, {
    awaitRefetchQueries: true,
  });
}
