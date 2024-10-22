import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {urls} from '../AppConfig';

export const LogContext = createContext();

export const LogProvider = ({children}) => {
    const [systemLogs, setSystemLogs] = useState([]);
    const [agentLogs, setAgentLogs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSystemLog = async () => {
        setLoading(true);
        try {
            const response = await axios.get(urls.systemLog);
            setSystemLogs(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSystemLogSince = async (since) => {
        setLoading(true);
        try {
            const response = await axios.get(urls.systemLogSince(since));
            setSystemLogs(prevLogs => [...prevLogs, ...response.data]); // 将新日志追加到现有日志中
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAgentLog = async (uuid) => {
        setLoading(true);
        try {
            const response = await axios.get(urls.agentLog(uuid));
            setAgentLogs(prevAgentLogs => ({
                ...prevAgentLogs, [uuid]: response.data,
            }));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAgentLogSince = async (uuid, since) => {
        setLoading(true);
        try {
            const response = await axios.get(urls.agentLogSince(uuid, since));
            setAgentLogs(prevAgentLogs => ({
                ...prevAgentLogs, [uuid]: [...(prevAgentLogs[uuid] || []), ...response.data],
            }));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSystemLog();
            agentLogs && Object.keys(agentLogs).forEach(uuid => fetchAgentLog(uuid));
        }, 60000);

        return () => clearInterval(interval);
    }, [agentLogs]);

    return (<LogContext.Provider
        value={{
            systemLogs,
            agentLogs,
            loading,
            error,
            fetchSystemLog,
            fetchSystemLogSince,
            fetchAgentLog,
            fetchAgentLogSince,
        }}
    >
        {children}
    </LogContext.Provider>);
};
