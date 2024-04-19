'use client'

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

import { useAuthContext } from "@/src/context/AuthContext";
import { addDataWithAutoGenId } from "@/src/firebase/firestore/addData";
import { setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";

import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogTitle } from "@mui/material";

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [open, setOpen] = useState(false);

  // image preview functions
  const [selectedImage, setSelectedImage] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (!selectedImage) {
        setPreview(undefined);
        return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    // free memory whenever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImage])

  const handleImage = e => {
    if (!e.target.files || e.target.files.length == 0) {
      setSelectedImage(undefined);
      return;
    }
    setSelectedImage(e.target.files[0]);
  }

  React.useEffect(() => {
      if (user == null) router.push("/")
  }, [user, router])

  // upload file
  const handleSubmit = async(event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    console.log(data);

    const itemTitle = data.get('itemTitle');
    const price = data.get('price');
    const desc = data.get('description');
    const imageFile = data.get('image');

    // if input is missing
    if (itemTitle === "" || 
        price === "" ||
        desc === "" ||
        imageFile.size === 0) {
      setLoading(false);
      setErrMsg('Missing input field');
      return;
    }

    // if input is valid continue

    const newItemRef = addDataWithAutoGenId("items");
    const storage = getStorage();
    const imageRef = ref(storage, `images/${newItemRef.id}.jpg`);

    const uploadFile = async () => {
      const snapshot = await uploadBytes(imageRef, data.get('image'));
      console.log('Uploaded a file!');
      const imageUrl = await getDownloadURL(snapshot.ref);
      return imageUrl;
    }
    const imageUrl = await uploadFile();

    await setDoc(newItemRef, {
      itemId: newItemRef.id,
      itemTitle: data.get('itemTitle'),
      price: parseInt(data.get('price')),
      desc: data.get('description'),
      dateInMilliseconds: Date.now(),
      date: new Date().toISOString(),
      uid: user.uid,
      imageUrl: imageUrl
    });
    setLoading(false);
    return handleOpen();
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPreview(undefined);
    setSelectedImage(undefined);
    setErrMsg('');
    setOpen(false);
    return router.push(`/dashboard?u=${user.uid}`)
  }

  return( 
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid item>
        <Typography component="h1" variant="h5" align="center">
          List your item!
        </Typography>
      </Grid>
      <Grid item>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            name="itemTitle" 
            margin="normal"
            required
            label="Item Title"
            type="text"
            fullWidth
            autoFocus
          />
          <TextField
            name="price"
            margin="normal"
            required
            fullWidth
            label="Price ($)"
            type="number"
            inputProps={{ 'data-testid': 'price'}}
          />
          <TextField
            name="description"
            margin="normal"
            label="Item description"
            fullWidth
            required
            rows={4}
            multiline
            type="text"
          />
          <Typography>Choose images to upload (PNG, JPG)</Typography>
          <Card>
            <CardMedia>
            <Image
              src={preview}
              width={0}
              height={0}
              style={{ width: 'auto', height: 'auto', maxWidth: 400, maxHeight: 400}}
              alt="No image selected"
            />
            </CardMedia>
            <CardActions>
              <input
                id="image"
                name="image"
                required
                type="file"
                onChange={handleImage}
                accept=".jpg,.jpeg,.png"
                data-testid="upload"
              />
            </CardActions>
          </Card>

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
                Submit
              </Button>
            </Grid>
            <Grid item>
              {loading ? 
              <CircularProgress />
              : null}
            </Grid>
          </Grid>
        </Box>
        <Grid item>
          <Typography
            color='red'
          >
            {errMsg}
          </Typography>
        </Grid>
      </Grid>
      <Dialog open={open}>
        <DialogTitle>
          Your item has been listed!
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
