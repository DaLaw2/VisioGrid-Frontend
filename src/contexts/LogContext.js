import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {urls, LOG_REFRESH_INTERVAL} from '../AppConfig';
import {useErrorBoundary} from 'react-error-boundary';

export const LogContext = createContext();

export const LogProvider = ({children}) => {
    const {showBoundary} = useErrorBoundary();

    const [systemLogs, setSystemLogs] = useState([]);
    const [agentLogs, setAgentLogs] = useState({});
    const [loading, setLoading] = useState({agent: true, system: true});
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const fetchInitialSystemLogs = async () => {
        setLoading(prev => ({...prev, system: true}));
        try {
            const response = await axios.get(urls.systemLog);
            setSystemLogs(response.data);
            setLastUpdate(new Date());
        } catch (err) {
            showBoundary(new Error("Error while fetch system log"));
        } finally {
            setLoading(prev => ({...prev, system: false}));
        }
    };

    const fetchAgentList = async () => {
        try {
            const response = await axios.get(urls.agentList);
            return response.data;
        } catch (err) {
            showBoundary(new Error("Error while fetch agent list"));
            return [];
        }
    };

    const fetchInitialAgentLogs = async () => {
        setLoading(prev => ({...prev, agent: true}));
        try {
            const agentList = await fetchAgentList();

            const logPromises = agentList.map(async (uuid) => {
                const response = await axios.get(urls.agentLog(uuid));
                return {uuid, logs: response.data};
            });

            const logs = await Promise.all(logPromises);
            const logsMap = logs.reduce((acc, {uuid, logs}) => {
                acc[uuid] = logs;
                return acc;
            }, {});

            setAgentLogs(logsMap);
            setLastUpdate(new Date());
        } catch (err) {
            showBoundary(new Error("Error while fetch agent log"));
        } finally {
            setLoading(prev => ({...prev, agent: false}));
        }
    };

    const fetchUpdatedSystemLogs = async () => {
        try {
            const since = lastUpdate.toISOString();
            const response = await axios.get(urls.systemLogSince(since));
            if (response.data && response.data.length > 0) {
                setSystemLogs(prevLogs => [...prevLogs, ...response.data]);
                setLastUpdate(new Date());
            }
        } catch (err) {
            showBoundary(new Error("Error while update system log"));
        }
    };

    const fetchUpdatedAgentLogs = async () => {
        try {
            const since = lastUpdate.toISOString();
            const agentList = await fetchAgentList();

            const logPromises = agentList.map(async (uuid) => {
                const response = await axios.get(urls.agentLogSince(uuid, since));
                return {uuid, logs: response.data};
            });

            const updatedLogs = await Promise.all(logPromises);
            setAgentLogs(prevAgentLogs => {
                const newAgentLogs = {...prevAgentLogs};
                updatedLogs.forEach(({uuid, logs}) => {
                    if (logs && logs.length > 0) {
                        newAgentLogs[uuid] = [...(newAgentLogs[uuid] || []), ...logs];
                    }
                });
                return newAgentLogs;
            });

            setLastUpdate(new Date());
        } catch (err) {
            showBoundary(new Error("Error while update agent log"));
        }
    };

    useEffect(() => {
        fetchInitialSystemLogs();
        fetchInitialAgentLogs();

        const interval = setInterval(() => {
            fetchUpdatedAgentLogs();
            fetchUpdatedSystemLogs();
        }, LOG_REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return (
        <LogContext.Provider value={{
            agentLogs,
            systemLogs,
            loading,
        }}>
            {children}
        </LogContext.Provider>
    );
};
