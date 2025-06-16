import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ListItemButton,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { loading, error, data } = useQuery(GET_TODOS);

  const [createTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTitle(''),
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [updateTodo] = useMutation(EDIT_TODO, {
    onCompleted: () => {
      setEditingId(null);
      setTitle('');
    },
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const addTodo = () => {
    createTodo({ variables: { title } });
  };

  const editTodo = () => {
    updateTodo({ variables: { id: editingId, title } });
  };

  const onDeleteTodo = id => {
    deleteTodo({ variables: { id } });
  };

  const handleEditTodo = todo => {
    setTitle(todo.title);
    setEditingId(+todo.id);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  console.log('DATA', data);

  return (
    <Container>
      <Typography variant="h3" align="center">
        Todo App
      </Typography>
      <Box style={{ maxWidth: '500px', margin: '0 auto', display: 'flex' }}>
        <TextField
          fullWidth
          label="Add Todo..."
          variant="outlined"
          id="outlined-basic"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!title}
          onClick={editTodo ? editTodo : addTodo}
        >
          {editTodo ? 'Update' : 'Add'}
        </Button>
      </Box>
      <Box component="div" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <List>
          {data.todos.map((todo, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <Box>
                  <IconButton>
                    <EditIcon
                      color="primary"
                      onClick={() => handleEditTodo(todo)}
                    />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon
                      color="error"
                      onClick={() => onDeleteTodo(+todo.id)}
                    />
                  </IconButton>
                </Box>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <Avatar style={{ backgroundColor: 'blue' }}>{i + 1}</Avatar>
                </ListItemIcon>
                <ListItemText primary={todo.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

const GET_TODOS = gql`
  query {
    todos {
      id
      title
      date
    }
  }
`;

const ADD_TODO = gql`
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

const EDIT_TODO = gql`
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

const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      message
    }
  }
`;

export default App;
