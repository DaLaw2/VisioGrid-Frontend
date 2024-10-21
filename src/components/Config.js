import {urls} from "../core/AppConfig";
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

function Config() {
    const [config, setConfig] = useState({
        split_mode: 'frame',
        segment_duration_secs: '',
        internal_timestamp: '',
        agent_listen_port: '',
        http_server_bind_port: '',
        dedicated_port_range_start: '',
        dedicated_port_range_end: '',
        refresh_interval: '',
        polling_interval: '',
        bind_retry_duration: '',
        agent_idle_duration: '',
        control_channel_timeout: '',
        data_channel_timeout: '',
        file_transfer_timeout: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCurrentConfig = async () => {
            try {
                let response = await axios.get(urls.getConfig);
                if (response.status === 200) {
                    let fetchedConfig = response.data;
                    setConfig({
                        split_mode: fetchedConfig.split_mode.mode,
                        segment_duration_secs: fetchedConfig.split_mode.segment_duration_secs || '',
                        internal_timestamp: fetchedConfig.internal_timestamp,
                        agent_listen_port: fetchedConfig.agent_listen_port,
                        http_server_bind_port: fetchedConfig.http_server_bind_port,
                        dedicated_port_range_start: fetchedConfig.dedicated_port_range[0],
                        dedicated_port_range_end: fetchedConfig.dedicated_port_range[1],
                        refresh_interval: fetchedConfig.refresh_interval,
                        polling_interval: fetchedConfig.polling_interval,
                        bind_retry_duration: fetchedConfig.bind_retry_duration,
                        agent_idle_duration: fetchedConfig.agent_idle_duration,
                        control_channel_timeout: fetchedConfig.control_channel_timeout,
                        data_channel_timeout: fetchedConfig.data_channel_timeout,
                        file_transfer_timeout: fetchedConfig.file_transfer_timeout,
                    });
                    setLoading(false);
                } else {
                    console.error('Failed to fetch current config:', response.statusText);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };
        loadCurrentConfig();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setConfig((prevConfig) => ({
            ...prevConfig,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const preparedConfig = {
            split_mode: config.split_mode === 'time' ? {
                mode: 'time',
                segment_duration_secs: parseInt(config.segment_duration_secs)
            } : {
                mode: 'frame'
            },
            internal_timestamp: parseInt(config.internal_timestamp),
            agent_listen_port: parseInt(config.agent_listen_port),
            http_server_bind_port: parseInt(config.http_server_bind_port),
            dedicated_port_range: [
                parseInt(config.dedicated_port_range_start),
                parseInt(config.dedicated_port_range_end),
            ],
            refresh_interval: parseInt(config.refresh_interval),
            polling_interval: parseInt(config.polling_interval),
            bind_retry_duration: parseInt(config.bind_retry_duration),
            agent_idle_duration: parseInt(config.agent_idle_duration),
            control_channel_timeout: parseInt(config.control_channel_timeout),
            data_channel_timeout: parseInt(config.data_channel_timeout),
            file_transfer_timeout: parseInt(config.file_transfer_timeout),
        };

        try {
            let response = await axios.post(urls.updateConfig, preparedConfig);
            if (response.status === 200) {
                alert('Config updated successfully.');
                setLoading(true);
                const loadCurrentConfig = async () => {
                    try {
                        let response = await axios.get(urls.getConfig);
                        if (response.status === 200) {
                            let fetchedConfig = response.data;
                            setConfig({
                                split_mode: fetchedConfig.split_mode.mode,
                                segment_duration_secs: fetchedConfig.split_mode.segment_duration_secs || '',
                                internal_timestamp: fetchedConfig.internal_timestamp,
                                agent_listen_port: fetchedConfig.agent_listen_port,
                                http_server_bind_port: fetchedConfig.http_server_bind_port,
                                dedicated_port_range_start: fetchedConfig.dedicated_port_range[0],
                                dedicated_port_range_end: fetchedConfig.dedicated_port_range[1],
                                refresh_interval: fetchedConfig.refresh_interval,
                                polling_interval: fetchedConfig.polling_interval,
                                bind_retry_duration: fetchedConfig.bind_retry_duration,
                                agent_idle_duration: fetchedConfig.agent_idle_duration,
                                control_channel_timeout: fetchedConfig.control_channel_timeout,
                                data_channel_timeout: fetchedConfig.data_channel_timeout,
                                file_transfer_timeout: fetchedConfig.file_transfer_timeout,
                            });
                            setLoading(false);
                        } else {
                            console.error('Failed to fetch current config:', response.statusText);
                            setLoading(false);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        setLoading(false);
                    }
                };
                loadCurrentConfig();
            } else {
                alert('Failed to update config: ' + response.data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error: ' + error);
        }
    };

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20%'}}>
                <CircularProgress/>
            </div>
        );
    }

    return (
        <Container maxWidth="md" sx={{mt: 4, mb: 4}}>
            <Typography variant="h4" align="center" gutterBottom>
                Configuration
            </Typography>
            <form onSubmit={handleSubmit}>
                <Card variant="outlined" sx={{padding: 3, mb: 3}}>
                    <CardContent>
                        <Stack spacing={3}>
                            <FormControl fullWidth>
                                <InputLabel id="split_mode_label">Split Mode</InputLabel>
                                <Select
                                    labelId="split_mode_label"
                                    id="split_mode"
                                    name="split_mode"
                                    value={config.split_mode}
                                    label="Split Mode"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="frame">Frame</MenuItem>
                                    <MenuItem value="time">Time</MenuItem>
                                </Select>
                            </FormControl>

                            {config.split_mode === 'time' && (
                                <TextField
                                    required
                                    type="number"
                                    id="segment_duration_secs"
                                    name="segment_duration_secs"
                                    label="Segment Duration (seconds)"
                                    fullWidth
                                    value={config.segment_duration_secs}
                                    onChange={handleChange}
                                    inputProps={{min: 1}}
                                />
                            )}

                            <TextField
                                required
                                type="number"
                                id="internal_timestamp"
                                name="internal_timestamp"
                                label="Internal Timestamp (ms)"
                                fullWidth
                                value={config.internal_timestamp}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 60000}}
                            />

                            <TextField
                                required
                                type="number"
                                id="agent_listen_port"
                                name="agent_listen_port"
                                label="Agent Listen Port"
                                fullWidth
                                value={config.agent_listen_port}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 65535}}
                            />

                            <TextField
                                required
                                type="number"
                                id="http_server_bind_port"
                                name="http_server_bind_port"
                                label="HTTP Server Bind Port"
                                fullWidth
                                value={config.http_server_bind_port}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 65535}}
                            />

                            <Box>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        required
                                        type="number"
                                        id="dedicated_port_range_start"
                                        name="dedicated_port_range_start"
                                        label="Dedicated Port Range Start"
                                        fullWidth
                                        value={config.dedicated_port_range_start}
                                        onChange={handleChange}
                                        inputProps={{min: 1, max: 65535}}
                                    />
                                    <Typography variant="h6" align="center" sx={{mt: 1}}>
                                        ~
                                    </Typography>
                                    <TextField
                                        required
                                        type="number"
                                        id="dedicated_port_range_end"
                                        name="dedicated_port_range_end"
                                        label="Dedicated Port Range End"
                                        fullWidth
                                        value={config.dedicated_port_range_end}
                                        onChange={handleChange}
                                        inputProps={{min: 1, max: 65535}}
                                    />
                                </Stack>
                            </Box>

                            <TextField
                                required
                                type="number"
                                id="refresh_interval"
                                name="refresh_interval"
                                label="Refresh Interval (s)"
                                fullWidth
                                value={config.refresh_interval}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 3600}}
                            />

                            <TextField
                                required
                                type="number"
                                id="polling_interval"
                                name="polling_interval"
                                label="Polling Interval (ms)"
                                fullWidth
                                value={config.polling_interval}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 60000}}
                            />

                            <TextField
                                required
                                type="number"
                                id="bind_retry_duration"
                                name="bind_retry_duration"
                                label="Bind Retry Duration (s)"
                                fullWidth
                                value={config.bind_retry_duration}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 3600}}
                            />

                            <TextField
                                required
                                type="number"
                                id="agent_idle_duration"
                                name="agent_idle_duration"
                                label="Agent Idle Duration (s)"
                                fullWidth
                                value={config.agent_idle_duration}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 3600}}
                            />

                            <TextField
                                required
                                type="number"
                                id="control_channel_timeout"
                                name="control_channel_timeout"
                                label="Control Channel Timeout (s)"
                                fullWidth
                                value={config.control_channel_timeout}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 3600}}
                            />

                            <TextField
                                required
                                type="number"
                                id="data_channel_timeout"
                                name="data_channel_timeout"
                                label="Data Channel Timeout (s)"
                                fullWidth
                                value={config.data_channel_timeout}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 3600}}
                            />

                            <TextField
                                required
                                type="number"
                                id="file_transfer_timeout"
                                name="file_transfer_timeout"
                                label="File Transfer Timeout (s)"
                                fullWidth
                                value={config.file_transfer_timeout}
                                onChange={handleChange}
                                inputProps={{min: 1, max: 3600}}
                            />
                        </Stack>
                    </CardContent>
                </Card>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{padding: 1.5, fontSize: '1rem'}}
                >
                    Submit
                </Button>
            </form>
            <Typography variant="body2" color="textSecondary" align="center" sx={{mt: 2}}>
                Some settings will take effect after restarting the system.
            </Typography>
        </Container>
    );
}

export default Config;
