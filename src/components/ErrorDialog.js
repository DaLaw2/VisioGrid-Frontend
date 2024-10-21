import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ErrorDialog = ({error, resetErrorBoundary}) => {
    return (<Dialog
        open={Boolean(error)}
        onClose={resetErrorBoundary}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
    >
        <DialogTitle id="error-dialog-title">
            OOPS！
            <IconButton
                aria-label="Close"
                onClick={resetErrorBoundary}
                sx={{
                    position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon/>
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <DialogContentText id="error-dialog-description">
                {error ? error.toString() : 'Something wrong'}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={resetErrorBoundary} color="primary" type="button">
                Try Again
            </Button>
        </DialogActions>
    </Dialog>);
};

export default ErrorDialog;
