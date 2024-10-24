import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {urls, LOG_REFRESH_INTERVAL} from '../AppConfig';
import {useErrorBoundary} from 'react-error-boundary';

export const AgentLogContext = createContext(null);

export const AgentLogProvider = ({children}) => {
    const {showBoundary} = useErrorBoundary();
    const [agentLogs, setAgentLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    function formatDate(date) {
        function pad(number) {
            return number < 10 ? '0' + number : number;
        }

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
    }

    const fetchAgentList = async () => {
        try {
            const response = await axios.get(urls.agentList);
            return response.data;
        } catch (err) {
            showBoundary(new Error("获取代理列表时出错"));
            return [];
        }
    };

    const fetchInitialAgentLogs = async () => {
        setLoading(true);
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
            showBoundary(new Error("获取代理日志时出错"));
        } finally {
            setLoading(false);
        }
    };

    const fetchUpdatedAgentLogs = async () => {
        try {
            const since = formatDate(lastUpdate);
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
            showBoundary(new Error("更新代理日志时出错"));
        }
    };

    useEffect(() => {
        fetchInitialAgentLogs();

        const interval = setInterval(() => {
            fetchUpdatedAgentLogs();
        }, LOG_REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return (
        <AgentLogContext.Provider value={{agentLogs, loading}}>
            {children}
        </AgentLogContext.Provider>
    );
};
