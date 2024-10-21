import {websocketUrl} from "../core/AppConfig";
import React, {createContext, useEffect, useRef, useState} from 'react';

export const PerformanceContext = createContext(null);

export const PerformanceProvider = ({children}) => {
    const ws = useRef(null);
    const hasConnected = useRef(false);
    const [performanceInfo, setPerformanceInfo] = useState(null);

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
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []);

    return (
        <PerformanceContext.Provider value={{performanceInfo}}>
            {children}
        </PerformanceContext.Provider>
    );
};
