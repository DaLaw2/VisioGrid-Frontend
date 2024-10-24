import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ErrorBoundary} from "react-error-boundary";
import './App.css';
import AppProviders from "./contexts/AppProviders";
import AgentsList from "./components/AgentList";
import AgentDashboard from "./components/AgentDashboard";
import Config from './components/Config';
import Dashboard from './components/Dashboard';
import ErrorDialog from "./components/ErrorDialog";
import Sidebar from './components/Sidebar';
import TestErrorHanding from "./test/TestErrorHanding";

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (<ErrorBoundary FallbackComponent={ErrorDialog}>
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
