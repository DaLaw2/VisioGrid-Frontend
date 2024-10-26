import React, {createContext, useEffect, useState} from 'react';
import {useErrorBoundary} from "react-error-boundary"
import {urls} from "../AppConfig"

export const TaskContext = createContext();

export const TaskProvider = ({children}) => {
    const {showBoundary} = useErrorBoundary();
    const [processingTasks, setProcessingTasks] = useState([]);
    const [successTasks, setSuccessTasks] = useState([]);
    const [failedTasks, setFailedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const [processingRes, successRes, failedRes] = await Promise.all([fetch(urls.processingTasks), fetch(urls.successTasks), fetch(urls.failedTasks)]);

            if (!processingRes.ok || !successRes.ok || !failedRes.ok) {
                showBoundary(new Error("Failed to fetch tasks"))
            }

            const [processingData, successData, failedData] = await Promise.all([processingRes.json(), successRes.json(), failedRes.json()]);

            setProcessingTasks(processingData);
            setSuccessTasks(successData);
            setFailedTasks(failedData);
        } catch (err) {
            showBoundary(err)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 10000); // 每5秒刷新一次
        return () => clearInterval(interval);
    }, []);

    return (<TaskContext.Provider
        value={{
            processingTasks, successTasks, failedTasks, loading, refreshTasks: fetchTasks,
        }}
    >
        {children}
    </TaskContext.Provider>);
};
