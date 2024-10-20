// src/App.js
import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Config from './components/Config';
import './App.css';
import {WebSocketProvider} from './contexts/WebSocketContext';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <WebSocketProvider>
            <Router>
                <div className="app">
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                    <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/config" element={<Config/>}/>
                        </Routes>
                    </div>
                </div>
            </Router>
        </WebSocketProvider>
    );
}

export default App;
