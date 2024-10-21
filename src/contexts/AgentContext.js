import React, {createContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {urls, websocketUrl, AGENT_LIST_REFRESH_INTERVAL} from '../AppConfig';

export const AgentContext = createContext(null);

export const AgentProvider = ({children}) => {
    const [agentList, setAgentList] = useState([]);
    const wsRefs = useRef({});
    const [agentPerformanceMap, setAgentPerformanceMap] = useState({});
    const [agentInformationMap, setAgentInformationMap] = useState({});

    const fetchAgentList = async () => {
        try {
            const response = await axios.get(urls.agentList);
            setAgentList(response.data);
        } catch (error) {
            console.error('Error fetching agent list:', error);
        }
    };

    const fetchAgentInformation = async (uuid) => {
        try {
            const response = await axios.get(urls.agentInformation(uuid));
            setAgentInformationMap((prevInfoMap) => ({
                ...prevInfoMap, [uuid]: response.data,
            }));
        } catch (error) {
            console.error(`Error fetching information for agent ${uuid}:`, error);
        }
    };

    const setupAgentWebSocket = (uuid) => {
        if (wsRefs.current[uuid]) return;

        const ws = new WebSocket(websocketUrl.agentPerformance(uuid));

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setAgentPerformanceMap((prevPerfMap) => ({
                    ...prevPerfMap, [uuid]: data,
                }));
            } catch (error) {
                console.error(`Error parsing WebSocket message for agent ${uuid}:`, error);
            }
        };

        ws.onerror = (error) => {
            console.error(`WebSocket error for agent ${uuid}:`, error);
        };

        ws.onclose = () => {
            console.log(`WebSocket connection closed for agent ${uuid}`);
        };

        wsRefs.current[uuid] = ws;
    };

    const closeAgentWebSocket = (uuid) => {
        if (wsRefs.current[uuid]) {
            wsRefs.current[uuid].close();
            delete wsRefs.current[uuid];
        }
    };

    useEffect(() => {
        fetchAgentList();

        const intervalId = setInterval(() => {
            fetchAgentList();
        }, AGENT_LIST_REFRESH_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        agentList.forEach((uuid) => {
            fetchAgentInformation(uuid);
            setupAgentWebSocket(uuid);
        });

        return () => {
            agentList.forEach((uuid) => {
                closeAgentWebSocket(uuid);
            });
        };
    }, [agentList]);

    return (<AgentContext.Provider value={{
        agentList, agentPerformanceMap, agentInformationMap
    }}>
        {children}
    </AgentContext.Provider>);
};
