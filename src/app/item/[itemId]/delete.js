import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import firebase_app from '@/src/firebase/config';
import { Box, Button, Card, CardActions, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Input, TextField, Typography } from '../../(components)/mui';
import { useAuthContext } from "@/src/context/AuthContext";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Delete({ item }) {
    const { user } = useAuthContext();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const router = useRouter();

    const closeUpdateDialog = () => {
        handleClose();
        setOpenUpdateDialog(false);
        return router.push(`/dashboard?u=${user.uid}`);
    }
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg('');
        setLoading(false);
        setOpen(false);
    }

    const deleteItem = async() => {
        const db = getFirestore(firebase_app);
        await deleteDoc(doc(db, "items", item.itemId));
        setOpenUpdateDialog(true);
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
                  color='error'
                  sx={{
                    minWidth: 150,
                  }}
                >
                  Delete item
                </Button>
                <Dialog open = {open}>
                <DialogTitle>
                    Are you sure you want to delete this item?
                </DialogTitle>
                <DialogActions>
                    {loading ? 
                    <CircularProgress />
                    : null}
                    <Button disabled={loading} onClick={deleteItem} color='error'>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </DialogActions>
                </Dialog>
                <Dialog open={openUpdateDialog}>
                    <DialogTitle>
                        This item has been removed!
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
