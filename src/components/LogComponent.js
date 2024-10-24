import React, {useContext, useEffect, useRef} from 'react';
import '../styles/LogComponent.css';

const LogComponent = ({LogContext}) => {
    const {logs, loading, error} = useContext(LogContext);
    const logEndRef = useRef(null);

    const scrollToBottom = () => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    if (loading) {
        return <div className="log-loader">加载日志中...</div>;
    }

    if (error) {
        return <div className="log-error">加载日志时出错: {error.message}</div>;
    }

    return (<div className="log-container">
        {logs.length === 0 ? (<p>暂无日志数据。</p>) : (<div className="log-scroll">
            <ul className="log-list">
                {logs}
            </ul>
            <div ref={logEndRef}/>
        </div>)}
    </div>);
};

export default LogComponent;
