import { Box, Card, CardHeader, Grid, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RatingStars from "../../(components)/ratingStars";

export default function UserInfo({ seller }) {
  return(
    <> 
      <Card
        sx={{
          margin: 2,
          padding: 2,
        }}
      >
        <Typography
          fontSize={30}
          textAlign={'center'}
        >
          Seller
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}  
        >
          <AccountCircleIcon fontSize='large' />
          <Typography fontSize={24} >
            {seller.username}
          </Typography>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}  
        >
          <Grid item>
            <Typography fontSize={18} >
              {seller.numRatedUsers === 0 ? '' : `(${seller.numRatedUsers})` }
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}