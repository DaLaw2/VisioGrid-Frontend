import React, {useContext, useEffect, useRef, useState} from 'react';
import Ansi from 'ansi-to-react';
import {FixedSizeList as List} from 'react-window';
import '../styles/LogComponent.css';
import {LogContext} from '../contexts/LogContext';

const LogComponent = ({logType, identifier}) => {
    const {agentLogs, systemLogs, loading} = useContext(LogContext);
    const [searchTerm, setSearchTerm] = useState('');
    const listRef = useRef(null);

    const isLoading = logType === 'agent' ? loading.agent : loading.system;

    let logs = [];
    if (logType === 'agent' && identifier) {
        logs = agentLogs[identifier] || [];
    } else if (logType === 'system') {
        logs = systemLogs;
    }

    const filteredLogs = logs.filter(log => log.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        if (listRef.current && filteredLogs.length > 0) {
            listRef.current.scrollToItem(filteredLogs.length - 1, 'end');
        }
    }, [filteredLogs]);

    if (isLoading) {
        return <div className="log-loader">Loading Log</div>;
    }

    return (<div className="log-container">
        <input
            type="text"
            placeholder="Search something..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="log-search-input"
        />
        {filteredLogs.length === 0 ? (<p className="no-logs">There is no matching log data yet.</p>) : (
            <div className="log-scroll">
                <List
                    ref={listRef}
                    height={300}
                    itemCount={filteredLogs.length}
                    itemSize={30}
                    width={'100%'}
                >
                    {({index}) => {
                        const log = filteredLogs[index];
                        return (<div
                            className={`log-item ${index === filteredLogs.length - 1 ? 'latest-log' : ''} log-item`}>
                            <span className="log-content">
                                <Ansi>{log}</Ansi>
                            </span>
                        </div>);
                    }}
                </List>
            </div>)}
    </div>);
};

export default LogComponent;
