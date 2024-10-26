import React, {createContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useErrorBoundary} from "react-error-boundary";
import {urls, websocketUrl, REFRESH_INTERVAL} from '../AppConfig';

export const AgentContext = createContext(null);

export const AgentProvider = ({children}) => {
    const {showBoundary} = useErrorBoundary();
    const wsRefs = useRef({});
    const agentInformationRefs = useRef({});
    const [agentList, setAgentList] = useState([]);
    const [agentPerformance, setAgentPerformance] = useState([]);

    const fetchAgentList = async () => {
        try {
            const response = await axios.get(urls.agentList);
            setAgentList(response.data);
        } catch (error) {
            showBoundary(new Error("Error fetching agent list"));
        }
    };

    const fetchAgentInformation = async (uuid) => {
        if (agentInformationRefs.current[uuid])
            return;
        try {
            const response = await axios.get(urls.agentInformation(uuid));
            agentInformationRefs.current[uuid] = response.data;
        } catch (error) {
            showBoundary(new Error("Error fetching agent information"));
        }
    };

    const setupAgentWebSocket = (uuid) => {
        if (wsRefs.current[uuid])
            return;

        const ws = new WebSocket(websocketUrl.agentPerformance(uuid));

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setAgentPerformance((prevPerfMap) => ({
                    ...prevPerfMap, [uuid]: data,
                }));
            } catch (error) {
                showBoundary(new Error(`Error while websocket connection: ${error}`));
            }
        };

        ws.onerror = (error) => {
            showBoundary(new Error(`Error while websocket connection: ${error}`));
        };

        wsRefs.current[uuid] = ws;
    };

    const removeAgent = (uuid) => {
        wsRefs.current[uuid].close();
        delete wsRefs.current[uuid];
        delete agentInformationRefs.current[uuid];
    };

    useEffect(() => {
        fetchAgentList();
        const intervalId = setInterval(fetchAgentList, REFRESH_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const previousAgentList = Object.keys(wsRefs.current);

        const newAgents = agentList.filter(uuid => !previousAgentList.includes(uuid));

        const removedAgents = previousAgentList.filter(uuid => !agentList.includes(uuid));

        newAgents.forEach(uuid => {
            fetchAgentInformation(uuid);
            setupAgentWebSocket(uuid);
        });

        removedAgents.forEach(uuid => {
            removeAgent(uuid);
        });
    }, [agentList]);

    return (
        <AgentContext.Provider value={{
            agentList,
            agentPerformance,
            agentInformation: agentInformationRefs.current
        }}>
            {children}
        </AgentContext.Provider>
    );
};
