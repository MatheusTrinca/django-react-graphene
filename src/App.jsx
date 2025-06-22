import {
  Box,
  Container,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
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
import {
  useAddTodo,
  useDeleteTodo,
  useEditTodo,
  useGetTodos,
} from './hooks/useTodos';
import { useGetUserData } from './hooks/useUser';

function App() {
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  // QUERY
  const { loading, error, data } = useGetTodos();
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useGetUserData();

  console.log('userData', userData);

  // MUTATIONS
  const [createTodo] = useAddTodo();
  const [updateTodo] = useEditTodo();
  const [deleteTodo] = useDeleteTodo();

  const addTodo = () => {
    createTodo({ variables: { title }, onCompleted: () => setTitle('') });
  };

  const editTodo = () => {
    updateTodo({
      variables: { id: editingId, title },
      onCompleted: () => {
        setEditingId(null);
        setTitle('');
      },
    });
  };

  const onDeleteTodo = id => {
    deleteTodo({ variables: { id } });
  };

  const handleEditTodo = todo => {
    setTitle(todo.title);
    setEditingId(+todo.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading || userLoading) {
    return <p>Loading...</p>;
  }

  if (error || userError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Container>
      <Typography variant="h3" align="center" mb={2}>
        Welcome to Todo App {userData?.user?.username}
        {userData?.user?.username && (
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            onClick={logout}
            color="error"
          >
            Logout
          </Button>
        )}
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
          onClick={editingId ? editTodo : addTodo}
        >
          {editingId ? 'Update' : 'Add'}
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

export default App;
