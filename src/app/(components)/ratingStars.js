import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { Box, Grid, Typography } from '@mui/material';

export default function RatingStars({ avgRating }) {
  if (avgRating < 1 || 5 < avgRating) {
    return;
  } else {
    // rounded to nearest 0.5
    const numStars = Math.round(2*avgRating)/2;
    // compute whole number
    const wholeNum = Math.floor(numStars);
    // is there a half star?
    const half = numStars - wholeNum > 0;
    
    const arr = new Array(wholeNum).fill(0);
    
    return(
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Grid item>
        {
          arr.map(x => {
            return(
              <StarIcon key={x} />           
            );
          })
        }
        </Grid>
        <Grid item>
        {
          half ? <StarHalfIcon /> : null
        }
        </Grid>
      </Grid>
    );
  }
}