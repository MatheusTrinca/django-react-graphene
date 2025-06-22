import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query Todos {
    todos {
      id
      title
      date
    }
  }
`;

export const ADD_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      todo {
        id
        title
        date
      }
    }
  }
`;

export const EDIT_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String!) {
    updateTodo(id: $id, title: $title) {
      todo {
        id
        title
        date
      }
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      message
    }
  }
`;
