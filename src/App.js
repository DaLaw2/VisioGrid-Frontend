import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Config from './components/Config';
import './App.css';
import {ErrorBoundary} from "react-error-boundary";
import {PerformanceProvider} from './contexts/PerformanceContext';
import TestErrorHanding from "./test/TestErrorHanding";
import ErrorDialog from "./components/ErrorDialog";
import {Fallback} from "./function/Fallback";

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (<ErrorBoundary FallbackComponent={ErrorDialog} fallback={Fallback}>
        <PerformanceProvider>
            <Router>
                <div className="app">
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                    <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/config" element={<Config/>}/>
                            <Route path="error" element={<TestErrorHanding/>}/>
                        </Routes>
                    </div>
                </div>
            </Router>
        </PerformanceProvider>
    </ErrorBoundary>);
}

export default App;
