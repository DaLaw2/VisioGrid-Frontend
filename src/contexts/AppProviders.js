import React from 'react';
import {AgentProvider} from "./AgentContext";
import {ConfigProvider} from './ConfigContext';
import {ManagementProvider} from "./ManagementContext";

const AppProviders = ({children}) => {
    return (<ConfigProvider>
        <ManagementProvider>
            <AgentProvider>
                {children}
            </AgentProvider>
        </ManagementProvider>
    </ConfigProvider>);
};

export default AppProviders;
