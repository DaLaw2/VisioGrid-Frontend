import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (<Router>
        <div className="app">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                </Routes>
            </div>
        </div>
    </Router>);
}

export default App;
