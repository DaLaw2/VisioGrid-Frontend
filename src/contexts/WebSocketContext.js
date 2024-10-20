import React, {createContext, useEffect, useRef, useState} from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children}) => {
    const [performanceInfo, setPerformanceInfo] = useState(null);
    const ws = useRef(null);
    const hasConnected = useRef(false);

    useEffect(() => {
        if (hasConnected.current)
            return;
        hasConnected.current = true;

        ws.current = new WebSocket('ws://127.0.0.1:8080/monitor/websocket/performance/system');

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

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
        <WebSocketContext.Provider value={{performanceInfo}}>
            {children}
        </WebSocketContext.Provider>
    );
};
