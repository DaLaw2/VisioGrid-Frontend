import React, {createContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useErrorBoundary} from 'react-error-boundary';
import {urls, websocketUrl} from "../AppConfig";

export const ManagementContext = createContext(null);

export const ManagementProvider = ({children}) => {
    const {showBoundary} = useErrorBoundary();

    const ws = useRef(null);
    const hasConnected = useRef(false);

    const [loading, setLoading] = useState(true);
    const [systemInfo, setSystemInfo] = useState(null);
    const [performanceInfo, setPerformanceInfo] = useState(null);

    const fetchSystemInformation = async () => {
        try {
            const response = await axios.get(urls.systemInformation);
            setSystemInfo(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showBoundary(new Error("Error fetching system information"));
        }
    };

    useEffect(() => {
        fetchSystemInformation();
    }, []);

    useEffect(() => {
        if (hasConnected.current) 
            return;
        hasConnected.current = true;

        ws.current = new WebSocket(websocketUrl.systemPerformance);

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setPerformanceInfo(data);
            } catch (error) {
                showBoundary(new Error(`Error while websocket connection: ${error}`));
            }
        };

        ws.current.onerror = (error) => {
            showBoundary(new Error(`Error while websocket connection: ${error}`));
        };
    }, []);

    return (<ManagementContext.Provider value={{systemInfo, performanceInfo, loading}}>
        {children}
    </ManagementContext.Provider>);
};
