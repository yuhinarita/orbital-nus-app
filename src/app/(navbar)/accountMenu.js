import React from 'react';
import { useRouter } from 'next/navigation';
import logoutUser from '@/src/firebase/auth/logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import HomeIcon from '@mui/icons-material/Home';
import { Typography, Menu, Button, MenuItem } from '@mui/material';
import { useAuthContext } from '@/src/context/AuthContext';

export default function AccountMenu () {
  const { user } = useAuthContext();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const listItem = () => {
    return router.push('/dashboard/list');
  }

  const gotoDashboard = () => {
    return router.push(`/dashboard?u=${user.uid}`);
  };
  
  const logoutAction = async() => {
    const { result, error } = await logoutUser();
    if (error) {
        return console.log(error);  
    }
    console.log(result);
    return router.replace("/");
}

  return (
    <div>
      <Button
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          backgroundColor:'#f5d042',
          height: 1,
          boxShadow: 0,
          borderRadius: 0,
        }}
      >
        <AccountCircleIcon fontSize='large'/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={gotoDashboard}>
          <HomeIcon sx={{marginRight: 1,}} />
          <Typography>
            My Account
          </Typography>
        </MenuItem>
        <MenuItem onClick={listItem}>
          <LibraryAddIcon sx={{marginRight: 1,}} />
          <Typography>
            List Item
          </Typography>
        </MenuItem>
        <MenuItem onClick={logoutAction}>
          <LogoutIcon sx={{marginRight: 1,}} />
          <Typography>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}