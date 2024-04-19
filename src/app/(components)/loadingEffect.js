'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingEffect({ isLoading }) {
  return (
    <>
    {isLoading ?
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      minHeight="100vh"
    >
      <Grid item xs={12}>
        <CircularProgress 
          size="10vh"
        />
      </Grid>
    </Grid>
    : null
    }
    </>
  );
}