'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from "next/link";

import registerUser from "@/src/firebase/auth/register";
import addData from "@/src/firebase/firestore/addData";

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
    
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    // check if input is not missing
    if (username === "" || 
        email === "" ||
        password === "" ||
        confirmPassword === "") {
      setLoading(false);
      setErrMsg("Missing input field");
      return;
    }

    //check if password and confirm password are the same
    if (password !== confirmPassword) {
      setLoading(false);
      setErrMsg("Password does not match");
      return;
    }

    const { result, error } = await registerUser(data.get('email'), data.get('password'));
    if (error) {
      setErrMsg(error.toString());
      setLoading(false);
      return;
    }
    // else successful
    console.log("Successfully registered an account");
    console.log(password);
    // add user info to database
    let userData = result.user;
    
    await addData("users", userData.uid, {
        username: username,
        email: userData.email,
        uid: userData.uid,
        password: password,
        avgRating: 0,
        numRatedUsers: 0, 
    });
    return router.push("/");
  }

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid item>
        <Typography component="h1" variant="h5" align="center">
          Register an account
        </Typography>
      </Grid>
      <Grid item>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            name="username" 
            margin="normal"
            required
            fullWidth
            label="Username"
            type="username"
            autoFocus
            helperText='This is how others can see you.'
          />
          <TextField
            name="email" 
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
          />
          <TextField
            name="password"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            helperText='Atleast 6 characters'
            inputProps={{ 'data-testid': 'passwordField' }}
          />
          <TextField
            name="confirmPassword"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            inputProps={{ 'data-testid': 'confirmPasswordField' }}
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
                Register
              </Button>
            </Grid>
            <Grid item>
              {loading ?
              <CircularProgress />
              : null}
            </Grid>
          </Grid>
        </Box>
        <Typography>Already have an account? <Link href="/login">Login</Link></Typography>
      </Grid>
    </Grid>
  );
}
