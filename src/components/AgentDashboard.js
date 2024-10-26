import React, {useContext} from 'react';
import {ClipLoader} from 'react-spinners';
import {Pie} from 'react-chartjs-2';
import {useParams} from 'react-router-dom';
import {ArcElement, Chart, Legend, Title, Tooltip} from 'chart.js';
import '../styles/Dashboard.css';
import {AgentContext} from '../contexts/AgentContext';
import LogComponent from "./LogComponent";

Chart.register(ArcElement, Title, Tooltip, Legend);

function AgentDashboard() {
    const {uuid} = useParams();
    const {agentPerformance, agentInformation} = useContext(AgentContext);

    const performanceInfo = agentPerformance[uuid];
    const systemInfo = agentInformation[uuid];

    if (!systemInfo || !performanceInfo) {
        return (<div className="loader-container">
            <ClipLoader color="#3498db" loading={true} size={80}/>
        </div>);
    }

    const getPieData = (used, total, resourceName, isPercentage = false) => ({
        labels: [`Used ${resourceName}`, `Free ${resourceName}`], datasets: [{
            data: isPercentage ? [used, 100 - used] : [used, (total - used).toFixed(2)],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1,
        },],
    });

    const pieChartOptions = {
        responsive: true, plugins: {
            legend: {
                display: true, position: 'top', onClick: () => {
                },
            }, title: {display: false, text: ''}, tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: ${value}${context.dataset.data.length === 2 ? label.includes('RAM') || label.includes('VRAM') ? ' GB' : '%' : ''}`;
                    },
                },
            },
        }, onClick: null,
    };

    const cpuUsage = parseFloat(performanceInfo.cpu.toFixed(2));
    const gpuUsage = parseFloat(performanceInfo.gpu.toFixed(2));
    const ramInGB = (performanceInfo.ram / (1024 ** 3)).toFixed(2);
    const vramInGB = (performanceInfo.vram / (1024 ** 3)).toFixed(2);
    const totalRamInGB = (systemInfo.ram / (1024 ** 3)).toFixed(2);
    const totalVramInGB = (systemInfo.vram / (1024 ** 3)).toFixed(2);

    const cpuData = getPieData(cpuUsage, 100, 'CPU (%)', true);
    const gpuData = getPieData(gpuUsage, 100, 'GPU (%)', true);
    const ramData = getPieData(ramInGB, totalRamInGB, 'RAM (GB)');
    const vramData = getPieData(vramInGB, totalVramInGB, 'VRAM (GB)');

    const renderAgentLogItem = (log) => (<>
        <span className="log-timestamp">{log.timestamp}:</span>
        <span className="log-message">{log.message}</span>
    </>);

    return (<div className="dashboard">
        <h1 className="system-info-h1">Agent Information</h1>
        <div className="system-info">
            <ul>
                <li><strong>Host:</strong> {systemInfo.host_name}</li>
                <li><strong>OS:</strong> {systemInfo.os_name}</li>
                <li><strong>CPU:</strong> {systemInfo.cpu}</li>
                <li><strong>GPU:</strong> {systemInfo.gpu}</li>
                <li><strong>RAM:</strong> {totalRamInGB} GB</li>
                <li><strong>VRAM:</strong> {totalVramInGB} GB</li>
            </ul>
        </div>
        <h1>Agent Load</h1>
        <div className="chart-container">
            <div className="chart">
                <h2>CPU Usage</h2>
                <Pie data={cpuData} options={pieChartOptions}/>
            </div>
            <div className="chart">
                <h2>GPU Usage</h2>
                <Pie data={gpuData} options={pieChartOptions}/>
            </div>
            <div className="chart">
                <h2>RAM Usage</h2>
                <Pie data={ramData} options={pieChartOptions}/>
            </div>
            <div className="chart">
                <h2>VRAM Usage</h2>
                <Pie data={vramData} options={pieChartOptions}/>
            </div>
        </div>
        <h1>Agent Log</h1>
        <LogComponent logType="agent" identifier={uuid}/>
    </div>);
}

export default AgentDashboard;
