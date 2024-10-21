// src/components/ErrorDialog.js
import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ErrorDialog = ({error, resetErrorBoundary}) => {
    return (
        <Dialog
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
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
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
                <Button onClick={resetErrorBoundary} color="primary">
                    Try again
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ErrorDialog.propTypes = {
    error: PropTypes.object,
    resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorDialog;
