import React from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/src/context/AuthContext';
import './navbar.css';
import AccountMenu from './accountMenu';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HomeIcon from '@mui/icons-material/Home';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Link from 'next/link';

export default function NavBar() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [ isLoggedIn, setIsLoggedIn ] = React.useState(false);

  React.useEffect(() => {
    if (user == null) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [user])

  const handleState = () => {
    if (isLoggedIn) {
      return (<AccountMenu/>);
    } else {
      return (
        <Box>
          <ButtonGroup 
            variant="outlined" 
            aria-label="outlined primary button group"
            sx={{
              borderRadius: 0,
              boxShadow: 0,
              height: 1,
            }}
          >
            <Link href="/register">
              <Button 
                startIcon={<AppRegistrationIcon />}
                sx={{
                  color: 'text.primary',
                  backgroundColor:'#f5d042',
                  borderRadius: 0,
                  height: 1,
                }}
              >
                Register
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                startIcon={<LoginIcon />}
                sx={{
                  color: 'text.primary',
                  backgroundColor:'#f5d042',
                  borderRadius: 0,
                  height: 1,
                }}
              >
                Login
              </Button>
            </Link>
          </ButtonGroup>
        </Box>
      )
    }
  }

  return(
    <Box
      backgroundColor='#36454f'
    >
      <Box
        id='navbar'
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: 1,
            minHeight: '8vh',
            height: 50, 
          }}
        >
          <Box
            sx={{
              flexGrow: 1
            }}
          >
            <Link href="/">
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                sx={{
                  color: 'text.primary',
                  backgroundColor:'#f5d042',
                  height: 1,
                  width: '250px',
                  borderRadius: 0,
                  boxShadow: 0,
                }}
              > 
                NUSMarketPlace
              </Button>
            </Link>
          </Box>
          {handleState()}
        </Box>
      </Box>
    </Box>

  );
}