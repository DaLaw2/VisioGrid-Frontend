import React, { useContext } from 'react';
import { AgentContext } from '../contexts/AgentContext';
import { Link } from 'react-router-dom';
import '../styles/AgentsList.css';

const AgentsList = () => {
    const { agentList, agentInformationMap } = useContext(AgentContext);

    if (agentList.length === 0) {
        return <div className="loading">Loading agents...</div>;
    }

    return (
        <div className="agents-list">
            <h1>Agents</h1>
            <ul>
                {agentList.map((uuid) => {
                    const info = agentInformationMap[uuid] || {};
                    return (
                        <li key={uuid} className="agent-item">
                            <Link to={`/agent/${uuid}`} className="agent-link">
                                <h2>{info.host_name || 'Unknown Host'}</h2>
                                <p><strong>UUID:</strong> {uuid}</p>
                                <p><strong>OS:</strong> {info.os_name || 'Unknown OS'}</p>
                                <p><strong>CPU:</strong> {info.cpu || 'Unknown CPU'}</p>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AgentsList;
