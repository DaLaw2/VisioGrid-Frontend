import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useErrorBoundary} from 'react-error-boundary';
import {urls, LOG_REFRESH_INTERVAL} from '../AppConfig';

export const ManagementLogContext = createContext(null);

export const ManagementLogProvider = ({children}) => {
    const {showBoundary} = useErrorBoundary();
    const [systemLogs, setSystemLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    function formatDate(date) {
        function pad(number) {
            return number < 10 ? '0' + number : number;
        }

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
    }

    const fetchInitialSystemLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(urls.systemLog);
            setSystemLogs(response.data);
            setLastUpdate(new Date());
        } catch (err) {
            showBoundary(new Error("获取系统日志时出错"));
        } finally {
            setLoading(false);
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
            showBoundary(new Error("更新系统日志时出错"));
        }
    };

    useEffect(() => {
        fetchInitialSystemLogs();

        const interval = setInterval(() => {
            fetchUpdatedSystemLogs();
        }, LOG_REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return (
        <ManagementLogContext.Provider value={{systemLogs, loading}}>
            {children}
        </ManagementLogContext.Provider>
    );
};
