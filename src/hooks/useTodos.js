import { useQuery, useMutation } from '@apollo/client';
import { GET_TODOS, ADD_TODO, EDIT_TODO, DELETE_TODO } from '../queries/todos';

// 1. Hook para queries
export function useGetTodos() {
  return useQuery(GET_TODOS);
}

// 2. Hooks para mutations
export function useAddTodo() {
  return useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    awaitRefetchQueries: true,
  });
}

export function useEditTodo() {
  return useMutation(EDIT_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    awaitRefetchQueries: true,
  });
}

export function useDeleteTodo() {
  return useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    awaitRefetchQueries: true,
  });
}
