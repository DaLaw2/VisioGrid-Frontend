import React, {useContext, useState} from 'react';
import {
    Alert,
    Box,
    CircularProgress,
    Container,
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
import {TaskContext} from '../contexts/TaskContext';

const TaskDashboard = () => {
    const {processingTasks, successTasks, failedTasks, loading} = useContext(TaskContext);
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const renderTable = (tasks) => (
        <TableContainer component={Paper}>
            <Table aria-label="tasks table">
                <TableHead>
                    <TableRow>
                        <TableCell>UUID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Model File</TableCell>
                        <TableCell>Media File</TableCell>
                        <TableCell>Success</TableCell>
                        <TableCell>Failed</TableCell>
                        <TableCell>Unprocessed</TableCell>
                        <TableCell>Error</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.uuid}>
                            <TableCell>{task.uuid}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>{task.model_file_name}</TableCell>
                            <TableCell>{task.media_file_name}</TableCell>
                            <TableCell>{task.success}</TableCell>
                            <TableCell>{task.failed}</TableCell>
                            <TableCell>{task.unprocessed}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Container maxWidth="lg" sx={{mt: 5}}>
            <Typography variant="h4" gutterBottom>
                Task Dashboard
            </Typography>
            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="task tabs" sx={{mb: 3}}>
                        <Tab label="Processing"/>
                        <Tab label="Success"/>
                        <Tab label="Failed"/>
                    </Tabs>
                    <Box>
                        {tabIndex === 0 && renderTable(processingTasks)}
                        {tabIndex === 1 && renderTable(successTasks)}
                        {tabIndex === 2 && renderTable(failedTasks)}
                    </Box>
                </>
            )}
        </Container>
    );
};

export default TaskDashboard;
