import React from 'react';
import {AgentProvider} from "./AgentContext";
import {ConfigProvider} from './ConfigContext';
import {ManagementProvider} from "./ManagementContext";
import {ManagementLogProvider} from "./ManagementLogContext";
import {AgentLogProvider} from "./AgentLogContext";

const AppProviders = ({children}) => {
    return (<ConfigProvider>
        <ManagementProvider>
            <AgentProvider>
                <ManagementLogProvider>
                    <AgentLogProvider>
                        {children}
                    </AgentLogProvider>
                </ManagementLogProvider>
            </AgentProvider>
        </ManagementProvider>
    </ConfigProvider>);
};

export default AppProviders;
