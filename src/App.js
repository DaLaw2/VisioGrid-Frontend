import './App.css';
import AppProviders from "./contexts/AppProviders";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Config from './components/Config';
import Dashboard from './components/Dashboard';
import ErrorDialog from "./components/ErrorDialog";
import {ErrorBoundary} from "react-error-boundary";
import React, {useState} from 'react';
import Sidebar from './components/Sidebar';
import TestErrorHanding from "./test/TestErrorHanding";
import AgentsList from "./components/AgentList";
import AgentDashboard from "./components/AgentDashboard";

function App() {
    const [resetKey, setResetKey] = React.useState(null)
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (<ErrorBoundary
        FallbackComponent={ErrorDialog}
        onReset={() => setResetKey(null)}
        resetKeys={[resetKey]}
    >
        <AppProviders>
            <Router>
                <div className="app">
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                    <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/config" element={<Config/>}/>
                            <Route path="/agents" element={<AgentsList />} />
                            <Route path="/agent/:uuid" element={<AgentDashboard />} />
                            <Route path="error" element={<TestErrorHanding/>}/>
                        </Routes>
                    </div>
                </div>
            </Router>
        </AppProviders>
    </ErrorBoundary>);
}

export default App;
