'use client';

import { Button, Card, CardContent, CardMedia, Grid, Typography } from "../../(components)/mui";
import EditItem from "./editItem";
import LoadingEffect from "../../(components)/loadingEffect";
import Chat from "./chat"
import Delete from "./delete"
import UserInfo from "./userInfo";

export default function ClientComponent({ item, seller }) {
  return (
    <>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 10,
          marginTop: 2,
          marginLeft: '5vw',
          marginRight: '5vw',
        }}
      >
        {item === null ? 
        <LoadingEffect isLoading />
        :
        <>
        <Grid item
          padding={2}
          alignSelf={'center'}
          height={'60vh'}
        >
          <CardMedia 
            component="img"
            width={0}
            height={0}
            image={item.imageUrl}
            sx={{
              width: 'auto',
              height: '60vh',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        </Grid>
        <Grid
          item
          sx={{ 
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Grid item
            width="60vw"
            margin={4}
          >
            <Typography
              sx={{
                fontSize: 28,
              }}
            >
              {item.itemTitle}
            </Typography>
            <Typography
              sx={{
                fontSize: 32,
                color: '#3d3d3d',
              }}
            >
              ${item.price}
            </Typography>
            <Card
              sx={{
                mt: 2,
              }}
            >
              <CardContent>
                <Typography
                sx={{
                  fontSize: 18,
                  color: '#3d3d3d',
                }}
              >
                {item.desc}
              </Typography>
              </CardContent>
            </Card>
            <EditItem item={item} />
            <Delete item={item}/>
          </Grid>
          <Grid item
            sx={{
              margin: 2,
              width: '35vw',
            }}
          >
            <UserInfo seller={seller} />
            <Chat item={item}/>
          </Grid>
        </Grid>
        </>}
      </Grid>
    </>
  );
}