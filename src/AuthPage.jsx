import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useCreateUserMutation, useLoginMutation } from './hooks/useUser';

const AuthPage = () => {
  const [registerNow, setRegisterNow] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [tokenAuth, { loading, error }] = useLoginMutation();
  const [
    createUser,
    {
      loading: createUserLoading,
      error: createUserError,
      data: createUserData,
    },
  ] = useCreateUserMutation();

  const login = () => {
    tokenAuth({
      variables: {
        username,
        password,
      },
      onCompleted: data => {
        if (data?.tokenAuth?.token) {
          localStorage.setItem('token', data.tokenAuth.token);
          window.location.href = '/';
        } else {
          alert('Invalid username or password');
        }
      },
    });
  };

  const register = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    await createUser({
      variables: {
        username,
        password,
      },
    });

    login();
  };

  return (
    <Container>
      <Typography align="center" variant="h3" mb={2}>
        {registerNow ? 'Register Now' : 'Login Now'}
      </Typography>
      <Grid
        direction="column"
        container
        spacing={2}
        sx={{ maxWidth: '300px', margin: '0 auto' }}
      >
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            id="outlined-basic"
            variant="outlined"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            id="outlined-basic"
            variant="outlined"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Grid>
        {registerNow && (
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="password"
              id="outlined-basic"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </Grid>
        )}
        <Grid item xs={12} md={12} lg={12}>
          <Button
            onClick={registerNow ? register : login}
            fullWidth
            color="primary"
            variant="contained"
            disabled={
              !username ||
              !password ||
              (registerNow && !confirmPassword) ||
              loading
            }
          >
            {registerNow ? 'Register' : 'Login'}
          </Button>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Button
            onClick={() => setRegisterNow(!registerNow)}
            disabled={loading}
          >
            {registerNow
              ? 'Have an account? Login here!'
              : 'New Here? Register now!'}
          </Button>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          {error && <Typography color="error">{error.message}</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthPage;
