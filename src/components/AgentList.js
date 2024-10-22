import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Computer, DeveloperBoard, Memory, Settings} from '@mui/icons-material';
import {Card, CardActionArea, CardContent, Grid, Typography} from '@mui/material';
import '../styles/AgentsList.css';
import {AgentContext} from '../contexts/AgentContext';

const AgentsList = () => {
    const {agentList, agentInformationMap: agentInformation} = useContext(AgentContext);

    if (agentList.length === 0) {
        return (<Typography variant="h4" align="center" gutterBottom>
            No Agent Found
        </Typography>);
    }

    return (<div className="agents-list">
        <Typography variant="h4" align="center" gutterBottom>
            Agent List
        </Typography>
        <Grid container spacing={3}>
            {agentList.map((uuid) => {
                const info = agentInformation[uuid] || {};
                return (<Grid item xs={12} sm={6} md={4} key={uuid}>
                    <Card>
                        <CardActionArea component={Link} to={`/agent/${uuid}`}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {info.host_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <Settings fontSize="small" style={{verticalAlign: 'middle'}}/>{' '}
                                    <strong>UUID：</strong> {uuid}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <Computer fontSize="small" style={{verticalAlign: 'middle'}}/>{' '}
                                    <strong>OS：</strong> {info.os_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <Memory fontSize="small" style={{verticalAlign: 'middle'}}/>{' '}
                                    <strong>CPU：</strong> {info.cpu}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <DeveloperBoard fontSize="small" style={{verticalAlign: 'middle'}}/>{' '}
                                    <strong>GPU：</strong> {info.gpu}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>);
            })}
        </Grid>
    </div>);
};

export default AgentsList;
