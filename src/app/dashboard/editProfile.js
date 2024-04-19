'use client';

import { Box, Button, Card, CardActions, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Input, TextField, Typography } from '../(components)/mui';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

import { doc, updateDoc, getFirestore, collection, query, where, getDocs} from "firebase/firestore";
import firebase_app from '@/src/firebase/config';
import passwordUpdate from "@/src/firebase/auth/passwordUpdate";
import emailUpdate from "@/src/firebase/auth/emailUpdate";
import { getAuth } from 'firebase/auth';

export default function EditProfile({ user }) {
  const auth = getAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const router = useRouter();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  // upload file
  const handleSubmit = async(event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    
    const newUsername = data.get('username');
    const newEmail = data.get('email');
    const newPassword = data.get('password');
    const confirmNewPassword = data.get('confirmPassword');

    // if input is missing
    if (newUsername === "" || 
        newEmail === "" ||
        newPassword === "" ||
        confirmNewPassword === "") {
      setLoading(false);
      setErrMsg('Missing input field');
      return;
    }

    // if input is valid continue
    const db = getFirestore(firebase_app);
    const docRef = doc(db, "users", user.uid);

    if (newUsername === `${user.username}` &&
        newEmail === user.email &&
        newPassword === `${user.password}` && 
        confirmNewPassword == `${user.password}`) {
      setErrMsg("No changes have been made");
      setLoading(false);
      return;
    }

    //check if password and confirm password are the same
    if (newPassword !== confirmNewPassword) {
        setLoading(false);
        setErrMsg("Password does not match");
        return;
      }
    console.log('updated');

    if (newUsername !== user.username) {
      await updateDoc(docRef, { username: newUsername });
    }

    if (newEmail !== user.email) {
      console.log('diff email');
      const { result, error } = await emailUpdate(auth.currentUser, newEmail);
        if (error) {
          console.log('error');
          setErrMsg(error.toString());
          setLoading(false);
      } else {
          await updateDoc(docRef, { email: newEmail});
      }
      console.log(-2);
    }

    if (newPassword !== user.password) {
        console.log('diff password');
        const { result2, error2 } = await passwordUpdate(auth.currentUser, newPassword);
        if (error2) {
            console.log('error2');
            setErrMsg(error2.toString());
            setLoading(false);
        } else {
            await updateDoc(docRef, { password: newPassword });
        }
      console.log(-3);
    }
    console.log('passed here!');
    router.refresh();
    setLoading(false);
    return setOpenUpdateDialog(true);
  }

  const closeUpdateDialog = () => {
    handleClose();
    setOpenUpdateDialog(false);
    return;
  }

  const handleClose = () => {
    console.log('pressed');
    setErrMsg('');
    setLoading(false);
    setOpen(false);
  }


  if (user === null) {
    return;
  } else {
    return(
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Edit profile
        </Button>
        <Dialog open={open}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <DialogTitle>Edit profile</DialogTitle>
            <DialogContent>
              <TextField
                name="username" 
                margin="normal"
                required
                label="Username"
                type="text"
                defaultValue={user.username}
                fullWidth
                autoFocus
                helperText='This is how others can see you.'
              />
              <TextField
                name="email"
                margin="normal"
                required
                defaultValue={user.email}
                fullWidth
                label="Email"
                type="text"
              />
              <TextField
                name="password"
                margin="normal"
                label="Password"
                fullWidth
                defaultValue={user.password}
                required
                type="password"
                helperText='Atleast 6 characters'
                inputProps={{ 'data-testid': 'passwordField' }}
              />

            <TextField
                name="confirmPassword"
                margin="normal"
                required
                fullWidth
                defaultValue={user.password}
                label="Confirm Password"
                type="password"
                inputProps={{ 'data-testid': 'confirmPasswordField' }}
            />
              <Typography
                color='red'
              >
                {errMsg}
            </Typography>
            </DialogContent>
            <DialogActions>
              {loading ? 
              <CircularProgress />
              : null}
              <Button
                type="submit"
                disabled={loading}
              >
                Update
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Box>
        </Dialog>
        <Dialog open={openUpdateDialog}>
          <DialogTitle>
            Your profile has been updated!
          </DialogTitle>
          <DialogActions>
            <Button onClick={closeUpdateDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </>

    );
  } 
}
