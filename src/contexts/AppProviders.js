import React from 'react';
import {AgentProvider} from "./AgentContext";
import {ConfigProvider} from './ConfigContext';
import {LogProvider} from "./LogContext";
import {ManagementProvider} from "./ManagementContext";

const AppProviders = ({children}) => {
    return (<ConfigProvider>
        <ManagementProvider>
            <AgentProvider>
                <LogProvider>
                    {children}
                </LogProvider>
            </AgentProvider>
        </ManagementProvider>
    </ConfigProvider>);
};

export default AppProviders;
