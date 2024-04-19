'use client';

import { Box, Button, Card, CardActions, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Input, TextField, Typography } from '../../(components)/mui';
import { useAuthContext } from "@/src/context/AuthContext";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import firebase_app from '@/src/firebase/config';


export default function EditItem({ item }) {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const router = useRouter();

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

  // upload file
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    console.log(data);

    const newItemTitle = data.get('itemTitle');
    const newPrice = parseInt(data.get('price'));
    const newDesc = data.get('description');
    const newImageFile = data.get('image');

    // if input is missing (excluding image file)
    if (newItemTitle === "" || 
        newPrice === "" ||
        newDesc === "") {
      setLoading(false);
      setErrMsg('Missing input field');
      return;
    }

    // if input is valid continue
    const db = getFirestore(firebase_app);
    const docRef = doc(db, "items", item.itemId);

    if (newItemTitle === item.itemTitle &&
        newPrice === item.price &&
        newDesc === item.desc && 
        newImageFile.size === 0) {
      setErrMsg("No changes have been made");
      setLoading(false);
      return;
    }

    if (newItemTitle !== item.itemTitle) {
      await updateDoc(docRef, { itemTitle: newItemTitle });
    }
    if (newPrice !== item.price) {
      await updateDoc(docRef, { price: newPrice});
    }
    if (newDesc !== item.desc) {
      await updateDoc(docRef, { desc: newDesc });
    }
    
    //now process images if new upload is being made
    if (newImageFile.size !== 0) {
      const storage = getStorage();
      const imageRef = ref(storage, `images/${item.itemId}.jpg`);
      
      //delete existing image
      deleteObject(imageRef).then(() => {
        console.log('success');
      }).catch((error) => {
        console.log(error);
      });

      const uploadFile = async () => {
        const snapshot = await uploadBytes(imageRef, newImageFile);
        console.log('Uploaded a file!');
        const newImageUrl = await getDownloadURL(snapshot.ref);
        console.log("newImageUrl " + newImageUrl);
        return newImageUrl;
      }
      const newImageUrl = await uploadFile();
      await updateDoc(docRef, { imageUrl: newImageUrl });
    }
    setLoading(false);
    router.refresh();
    return setOpenUpdateDialog(true);
  }

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const closeUpdateDialog = () => {
    handleClose();
    setOpenUpdateDialog(false);
    return;
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPreview(undefined);
    setSelectedImage(undefined);
    setErrMsg('');
    setLoading(false);
    setOpen(false);
  }

  if (user === null) {
    return;
  } else if (item.uid === user.uid) {
    return(
      <Grid
        margin={2}
      >
        <Button 
          variant="outlined" 
          onClick={handleOpen}
          sx={{
            minWidth: 150,
          }}
        >
          Edit details
        </Button>
        <Dialog open={open}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <DialogTitle>Edit details</DialogTitle>
            <DialogContent>
              <TextField
                name="itemTitle" 
                margin="normal"
                required
                label="Item Title"
                type="text"
                defaultValue={item.itemTitle}
                fullWidth
                autoFocus
              />
              <TextField
                name="price"
                margin="normal"
                required
                defaultValue={item.price}
                fullWidth
                label="Price ($)"
                type="number"
                inputProps={{ 'data-testid': 'price' }}
              />
              <TextField
                name="description"
                margin="normal"
                label="Item description"
                fullWidth
                defaultValue={item.desc}
                required
                rows={4}
                multiline
                type="text"
              />
              <Typography>Choose images to replace (PNG, JPG)</Typography>
              <Card>
                <CardMedia>
                <Image
                  src={preview}
                  width={0}
                  height={0}
                  style={{ width: 'auto', height: 'auto', maxWidth: 400, maxHeight: 400}}
                  alt="If no file is selected, the image will stay the same"
                />
                </CardMedia>
                <CardActions>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImage}
                    accept=".jpg,.jpeg,.png"
                    data-testid="upload"
                  />
                </CardActions>
              </Card>
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
            Your item details have been updated!
          </DialogTitle>
          <DialogActions>
            <Button onClick={closeUpdateDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  } else {
    return;
  }
}
