// src/components/Sidebar.js
import React from 'react';
import {NavLink} from 'react-router-dom';
import {FaBars, FaCogs, FaHome} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({isOpen, toggleSidebar}) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                {isOpen && <h2>VisioGrid</h2>}
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <FaBars/>
                </button>
            </div>
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/" className="menu-item">
                        <FaHome className="menu-icon"/>
                        {isOpen && <span>Home</span>}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/config" className="menu-item">
                        <FaCogs className="menu-icon"/>
                        {isOpen && <span>Config</span>}
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
