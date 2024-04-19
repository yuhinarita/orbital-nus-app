'use client';
import React from "react";
import { useRouter } from 'next/navigation';

import Grid from "@mui/material/Grid";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useAuthContext } from "@/src/context/AuthContext";
import ListUserItems from "../(components)/listUserItems";
import { getFirestore, collection, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import firebase_app from '../../firebase/config';
import EditProfile from './editProfile'
import RatingStars from "../(components)/ratingStars";

export default async function ClientComponent({ user, items }) {
  const router = useRouter();

  React.useEffect(() => {
    if (user == null) router.push("/")
  }, [user, router])

  if (user === null) {
    return;
  } else {
    return(
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid item
        marginLeft='5vw'
        marginRight='5vw'
      >
        <Typography fontSize={32} align="left">
          My Profile
        </Typography>
        {user === null ? null
        : 
        <Card>
          <CardContent
            margin={0}
            padding={0}
          >
            <Grid
              sx={{ 
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <AccountCircleIcon fontSize="large" />
              <Typography fontSize={24} >
                {user.username === null
                ? ''
                : ` ${user.username}`}
              </Typography>
            </Grid>
            <Typography>
              Email: {user.email}
            </Typography>
          </CardContent>
          <CardActions>
            <EditProfile user={user} />
          </CardActions>
        </Card>}
      </Grid>
      <Grid item
        marginLeft='5vw'
        marginRight='5vw'
      >
        <Typography fontSize={32}>
          My Listings
        </Typography>
        <Card
          sx={{
            boxShadow: 10,
          }}
        >
        {user === null ? ""
        : <ListUserItems items={items} />}
        </Card>
      </Grid>
    </Grid>
    );
  }  
}
