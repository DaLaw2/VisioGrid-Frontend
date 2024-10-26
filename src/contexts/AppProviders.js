import React from 'react';
import {AgentProvider} from "./AgentContext";
import {ConfigProvider} from './ConfigContext';
import {LogProvider} from "./LogContext";
import {TaskProvider} from "./TaskContext";
import {ManagementProvider} from "./ManagementContext";

const AppProviders = ({children}) => {
    return (<ConfigProvider>
        <ManagementProvider>
            <AgentProvider>
                <LogProvider>
                    <TaskProvider>
                        {children}
                    </TaskProvider>
                </LogProvider>
            </AgentProvider>
        </ManagementProvider>
    </ConfigProvider>);
};

export default AppProviders;
