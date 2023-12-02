import React, { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { Alert } from '@mui/material';


const extractFormData = (target) => {
  const data = new FormData(target);
  return {
    email: data.get('email'),
    password: data.get('password'),
  }
}

const validateFormData = (formData) => {
  return !formData.email || !formData.password;
}

export default function SignIn() {
  const { setToken, authenticated, setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = extractFormData(event.currentTarget)
    if (validateFormData(formData)) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const responseData = await response.json()
        localStorage.setItem('token', responseData.token);
        setToken(responseData.token);
        setAuthenticated(true);
        navigate('/tasks');
      } else {
        const responseData = await response.json();
        setError(responseData.message);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {authenticated ? <Navigate to="/tasks" /> : null}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {location.state?.message ? <Alert severity="success">{location.state?.message}</Alert> : null}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/register">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}