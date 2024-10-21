import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import React from 'react';

const InfoDialog = ({open, handleClose, title, message}) => {
    return (<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="info-dialog-title"
        aria-describedby="info-dialog-description"
    >
        <DialogTitle id="info-dialog-title">{title || '提示'}</DialogTitle>
        <DialogContent>
            <DialogContentText id="info-dialog-description">
                {message || 'Something wrong'}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Confirm
            </Button>
        </DialogActions>
    </Dialog>);
};

export default InfoDialog;
