'use client';

import React from "react";
import loginUser from "@/src/firebase/auth/login";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from "next/link";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function Page() {
  const router = useRouter();
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    // check if input is not missing
    if (email === "" ||
        password === "") {
      setLoading(false);
      setErrMsg("Missing input field");
      return;
    }

    const { result, error } = await loginUser(data.get('email'), data.get('password'));
    if (error) {
        setErrMsg('Wrong email or password!');
        setLoading(false);
        return console.log(error);
    }
    // else successful
    console.log("Login successful");
    return router.push("/");
  }

  return (
    <Box
    >
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid item>
        <Typography component="h1" variant="h5" align="center">
          Login
        </Typography>
      </Grid>
      <Grid item>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            name="email" 
            margin="normal"
            required
            label="Email Address"
            type="email"
            fullWidth
            autoFocus
            inputProps={{ 'data-testid': 'emailField' }}
          />
          <TextField
            name="password"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            inputProps={{ 'data-testid': 'passwordField' }}
          />
          <Typography
            color='red'
          >
            {errMsg}
          </Typography>
          <Grid
            container
            width={0.5}
          >
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                Login
              </Button>
            </Grid>
            <Grid item>
              {loading ?
              <CircularProgress />
              : null}
            </Grid>
          </Grid>
        </Box>
        <Typography>Don&#39;t have an account? <Link href="/register">Register here</Link></Typography>
      </Grid>
    </Grid>
    </Box>
  );
}
