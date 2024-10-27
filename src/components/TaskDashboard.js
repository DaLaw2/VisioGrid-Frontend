import React, { useContext, useState, useCallback } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@mui/material';
import { TaskContext } from '../contexts/TaskContext';
import InfoIcon from '@mui/icons-material/Info';
import {urls} from "../AppConfig";

// 辅助函数：将驼峰式或 PascalCase 字符串转换为带空格的字符串
const formatStatus = (status) => {
    return status.replace(/([A-Z])/g, ' $1').trim();
};

const TaskDashboard = () => {
    const { processingTasks, successTasks, failedTasks, loading } = useContext(TaskContext);
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [open, setOpen] = useState(false);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleOpen = (task) => {
        setSelectedTask(task);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTask(null);
    };

    const handleDownload = (uuid) => {
        window.open(urls.downloadTask(uuid), '_blank');
    };

    const renderTable = useCallback((tasks) => (
        <TableContainer component={Paper}>
            <Table aria-label="tasks table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">UUID</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Success</TableCell>
                        <TableCell align="center">Failed</TableCell>
                        <TableCell align="center">Unprocessed</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.uuid}>
                            <TableCell align="center">{task.uuid}</TableCell>
                            <TableCell align="center">{formatStatus(task.status)}</TableCell>
                            <TableCell align="center">{task.success}</TableCell>
                            <TableCell align="center">{task.failed}</TableCell>
                            <TableCell align="center">{task.unprocessed}</TableCell>
                            <TableCell align="center">
                                <IconButton color="primary" onClick={() => handleOpen(task)}>
                                    <InfoIcon />
                                </IconButton>
                                {task.status === "Success" && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDownload(task.uuid)}
                                        sx={{ ml: 1 }}
                                    >
                                        Download
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ), []);

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Task Dashboard
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="task tabs" sx={{ mb: 3 }}>
                        <Tab label="Processing" />
                        <Tab label="Success" />
                        <Tab label="Failed" />
                    </Tabs>
                    <Box>
                        {tabIndex === 0 && renderTable(processingTasks)}
                        {tabIndex === 1 && renderTable(successTasks)}
                        {tabIndex === 2 && renderTable(failedTasks)}
                    </Box>
                </>
            )}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Subtask Errors</DialogTitle>
                <DialogContent dividers>
                    {selectedTask && selectedTask.result && selectedTask.result.length > 0 ? (
                        selectedTask.result.map((subtask, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">
                                    Subtask: {subtask.media_file_name}
                                </Typography>
                                {subtask.error && subtask.error.Err ? (
                                    <Alert severity="error">{subtask.error.Err}</Alert>
                                ) : (
                                    <Alert severity="success">No Errors</Alert>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Alert severity="info">No subtask errors available.</Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TaskDashboard;
