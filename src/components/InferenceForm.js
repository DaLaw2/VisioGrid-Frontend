// InferenceForm.jsx
import React, { useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Collapse,
    TextField,
    Checkbox,
    Grid,
    Alert,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import {urls} from "../AppConfig"

const defaultValues = {
    Predict: {
        imgsz: 640,
        batch: 16,
        conf: 0.25,
    },
    Track: {
        imgsz: 640,
        batch: 1,
        conf: 0.1,
    },
};

const InferenceForm = () => {
    const [modelType, setModelType] = useState('Ultralytics');
    const [detectMode, setDetectMode] = useState('Predict');
    const [imgsz, setImgsz] = useState(defaultValues['Predict'].imgsz);
    const [batch, setBatch] = useState(defaultValues['Predict'].batch);
    const [conf, setConf] = useState(defaultValues['Predict'].conf);
    const [imgszDefault, setImgszDefault] = useState(true);
    const [batchDefault, setBatchDefault] = useState(true);
    const [confDefault, setConfDefault] = useState(true);
    const [modelFile, setModelFile] = useState(null);
    const [mediaFile, setMediaFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState('success');

    const handleDetectModeChange = (e) => {
        const mode = e.target.value;
        setDetectMode(mode);
        setImgsz(defaultValues[mode].imgsz);
        setBatch(defaultValues[mode].batch);
        setConf(defaultValues[mode].conf);
        setImgszDefault(true);
        setBatchDefault(true);
        setConfDefault(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const inferenceArgument = JSON.stringify({
            model_type: modelType,
            detect_mode: detectMode,
            imgsz: imgszDefault ? defaultValues[detectMode].imgsz : imgsz,
            batch: batchDefault ? defaultValues[detectMode].batch : batch,
            conf: confDefault ? defaultValues[detectMode].conf : conf,
        });
        const formData = new FormData();
        formData.append('inferenceArgument', inferenceArgument);
        if (modelFile) {
            formData.append('modelFile', modelFile, modelFile.name);
        }
        if (mediaFile) {
            formData.append('mediaFile', mediaFile, mediaFile.name);
        }
        try {
            const response = await fetch(urls.inferenceRequest, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                setAlertSeverity('success');
                setAlertMessage('File uploaded successfully!');
                setTimeout(() => setAlertMessage(null), 3000);
            } else {
                const errorMessage = await response.text();
                setAlertSeverity('error');
                setAlertMessage('Upload failed: ' + errorMessage);
            }
        } catch (error) {
            setAlertSeverity('error');
            setAlertMessage('An error occurred: ' + error.message);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="div" align="center" gutterBottom>
                        Inference
                    </Typography>

                    {alertMessage && (
                        <Alert
                            severity={alertSeverity}
                            onClose={() => setAlertMessage(null)}
                            sx={{ mb: 2 }}
                        >
                            {alertMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Select Model Type</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="modelType"
                                        name="modelType"
                                        value={modelType}
                                        onChange={(e) => setModelType(e.target.value)}
                                    >
                                        <FormControlLabel
                                            value="Ultralytics"
                                            control={<Radio />}
                                            label="Ultralytics"
                                        />
                                        <FormControlLabel
                                            value="YOLOv4"
                                            control={<Radio />}
                                            label="YOLOv4"
                                        />
                                        <FormControlLabel
                                            value="YOLOv7"
                                            control={<Radio />}
                                            label="YOLOv7"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Select Detection Mode</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="detectMode"
                                        name="detectMode"
                                        value={detectMode}
                                        onChange={handleDetectModeChange}
                                    >
                                        <FormControlLabel
                                            value="Predict"
                                            control={<Radio />}
                                            label="Predict"
                                        />
                                        <FormControlLabel
                                            value="Track"
                                            control={<Radio />}
                                            label="Track"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <Button
                            variant="contained"
                            onClick={() => setOpen(!open)}
                            endIcon={open ? <ExpandLess /> : <ExpandMore />}
                            sx={{ mb: 3 }}
                        >
                            Advanced Settings
                        </Button>
                        <Collapse in={open}>
                            <Card sx={{ mb: 3, p: 2 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={imgszDefault}
                                                    onChange={(e) => {
                                                        setImgszDefault(e.target.checked);
                                                        if (e.target.checked) {
                                                            setImgsz(defaultValues[detectMode].imgsz);
                                                        } else {
                                                            setImgsz('');
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Default"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            label="Image Size (imgsz)"
                                            type="number"
                                            fullWidth
                                            value={imgsz}
                                            onChange={(e) => setImgsz(e.target.value)}
                                            disabled={imgszDefault}
                                            inputProps={{ min: 1 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={batchDefault}
                                                    onChange={(e) => {
                                                        setBatchDefault(e.target.checked);
                                                        if (e.target.checked) {
                                                            setBatch(defaultValues[detectMode].batch);
                                                        } else {
                                                            setBatch('');
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Default"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            label="Batch Size (batch)"
                                            type="number"
                                            fullWidth
                                            value={batch}
                                            onChange={(e) => setBatch(e.target.value)}
                                            disabled={batchDefault}
                                            inputProps={{ min: 1 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={confDefault}
                                                    onChange={(e) => {
                                                        setConfDefault(e.target.checked);
                                                        if (e.target.checked) {
                                                            setConf(defaultValues[detectMode].conf);
                                                        } else {
                                                            setConf('');
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Default"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            label="Confidence Threshold (conf)"
                                            type="number"
                                            fullWidth
                                            value={conf}
                                            onChange={(e) => setConf(e.target.value)}
                                            disabled={confDefault}
                                            inputProps={{ min: 0, max: 1, step: 0.01 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Collapse>

                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Upload Files
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Button variant="outlined" component="label" fullWidth>
                                            Upload Model File
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => setModelFile(e.target.files[0])}
                                                required
                                            />
                                        </Button>
                                        {modelFile && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Selected File: {modelFile.name}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="outlined" component="label" fullWidth>
                                            Upload Media File
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => setMediaFile(e.target.files[0])}
                                                required
                                            />
                                        </Button>
                                        {mediaFile && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Selected File: {mediaFile.name}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Grid container spacing={2} justifyContent="space-between">
                            <Grid item>
                                <Button variant="outlined" onClick={() => window.history.back()}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" type="submit">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default InferenceForm;
