'use client';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useRouter } from 'next/navigation';

import LoadingEffect from '../(components)/loadingEffect';
import { Box, Grid } from '@mui/material';


export default function ItemCard({ item }) {
  const router = useRouter();

  const gotoItemPage = () => {
    router.push(`/item/${item.itemId}`);
    return (<LoadingEffect />);
  } 

  const Style = {
    height: 140,
  };

  return (
    <Card
      sx={{
        padding: 0,
        margin: '0.5%',
        width: {
          xs: '49%',
          sm: '32%',
          md: '24%',
        },
      }}
    >
      <CardActionArea
        onClick={() => gotoItemPage()}
      >
        <Box
          height={200}
          sx={{backgroundColor: '#f5f5f5'}}
        >
          <CardMedia
            component="img"
            height='100%'
            image={item.imageUrl}
            sx={{objectFit: 'contain'}}
          />
        </Box>
        <CardContent>
          <Typography gutterBottom variant='body1'>
            <b>{item.itemTitle}</b>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            ${item.price}
          </Typography>          
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
