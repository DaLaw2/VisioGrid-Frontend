import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import {urls} from '../AppConfig';
import {useErrorBoundary} from 'react-error-boundary';

export const ConfigContext = createContext();

export const ConfigProvider = ({children}) => {
    const {showBoundary} = useErrorBoundary();
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({
        split_mode: 'frame',
        segment_duration_secs: '',
        internal_timestamp: '',
        agent_listen_port: '',
        http_server_bind_port: '',
        dedicated_port_range_start: '',
        dedicated_port_range_end: '',
        refresh_interval: '',
        polling_interval: '',
        bind_retry_duration: '',
        agent_idle_duration: '',
        control_channel_timeout: '',
        data_channel_timeout: '',
        file_transfer_timeout: '',
    });

    const loadCurrentConfig = async () => {
        try {
            let response = await axios.get(urls.getConfig);
            if (response.status === 200) {
                let fetchedConfig = response.data;
                setConfig({
                    split_mode: fetchedConfig.split_mode.mode,
                    segment_duration_secs: fetchedConfig.split_mode.segment_duration_secs || '',
                    internal_timestamp: fetchedConfig.internal_timestamp,
                    agent_listen_port: fetchedConfig.agent_listen_port,
                    http_server_bind_port: fetchedConfig.http_server_bind_port,
                    dedicated_port_range_start: fetchedConfig.dedicated_port_range[0],
                    dedicated_port_range_end: fetchedConfig.dedicated_port_range[1],
                    refresh_interval: fetchedConfig.refresh_interval,
                    polling_interval: fetchedConfig.polling_interval,
                    bind_retry_duration: fetchedConfig.bind_retry_duration,
                    agent_idle_duration: fetchedConfig.agent_idle_duration,
                    control_channel_timeout: fetchedConfig.control_channel_timeout,
                    data_channel_timeout: fetchedConfig.data_channel_timeout,
                    file_transfer_timeout: fetchedConfig.file_transfer_timeout,
                });
                setLoading(false);
            } else {
                setLoading(false);
                showBoundary(new Error('Failed to fetch current config: ' + response.statusText));
            }
        } catch (error) {
            setLoading(false);
            showBoundary(error);
        }
    };

    useEffect(() => {
        loadCurrentConfig();
    }, []);

    const updateConfig = async (preparedConfig) => {
        try {
            let response = await axios.post(urls.updateConfig, preparedConfig);
            if (response.status === 200) {
                setLoading(true);
                await loadCurrentConfig();
            } else {
                showBoundary(new Error('Failed to update config: ' + response.data));
            }
        } catch (error) {
            showBoundary(error);
        }
    };

    return (<ConfigContext.Provider value={{config, setConfig, loading, updateConfig}}>
        {children}
    </ConfigContext.Provider>);
};
