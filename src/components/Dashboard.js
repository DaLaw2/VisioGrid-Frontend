import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Pie} from 'react-chartjs-2';
import {ArcElement, Chart, Legend, Title, Tooltip} from 'chart.js';
import {ClipLoader} from 'react-spinners';
import './Dashboard.css';

Chart.register(ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [systemInfo, setSystemInfo] = useState(null);
    const [performanceInfo, setPerformanceInfo] = useState(null);

    const fetchSystemInformation = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/monitor/get/information/system');
            setSystemInfo(response.data);
        } catch (error) {
            console.error('Error fetching system information:', error);
        }
    };

    useEffect(() => {
        fetchSystemInformation();

        const ws = new WebSocket('ws://127.0.0.1:8080/monitor/websocket/performance/system');

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setPerformanceInfo(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // 清除 WebSocket 連接
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    if (!systemInfo || !performanceInfo) {
        return (<div className="loader-container">
            <ClipLoader color="#3498db" loading={true} size={80}/>
        </div>);
    }


    const cpuUsage = parseFloat(performanceInfo.cpu.toFixed(2));
    const gpuUsage = parseFloat(performanceInfo.gpu.toFixed(2));
    const ramInGB = (performanceInfo.ram / (1024 ** 3)).toFixed(2);
    const vramInGB = (performanceInfo.vram / (1024 ** 3)).toFixed(2);
    const totalRamInGB = (systemInfo.ram / (1024 ** 3)).toFixed(2);
    const totalVramInGB = (systemInfo.vram / (1024 ** 3)).toFixed(2);

    const pieChartOptions = {
        responsive: true, plugins: {
            legend: {
                display: true, position: 'top', onClick: () => {
                }
            }, title: {display: false, text: ''}, tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: ${value}${context.dataset.data.length === 2 ? (label.includes('RAM') || label.includes('VRAM') ? ' GB' : '%') : ''}`;
                    }
                }
            },
        }, onClick: null,
    };

    const getPieData = (used, total, resourceName, isPercentage = false) => ({
        labels: [`Used ${resourceName}`, `Free ${resourceName}`], datasets: [{
            data: isPercentage ? [used, 100 - used] : [used, (total - used).toFixed(2)],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1,
        },],
    });

    const cpuData = getPieData(cpuUsage, 100, 'CPU (%)', true);
    const gpuData = getPieData(gpuUsage, 100, 'GPU (%)', true);
    const ramData = getPieData(ramInGB, totalRamInGB, 'RAM (GB)');
    const vramData = getPieData(vramInGB, totalVramInGB, 'VRAM (GB)');

    return (<div className="dashboard">
        <h1>Management Information</h1>
        <div className="system-info">
            <ul>
                <li><strong>Host:</strong> {systemInfo.host_name}</li>
                <li><strong>OS:</strong> {systemInfo.os_name}</li>
                <li><strong>CPU:</strong> {systemInfo.cpu} ({systemInfo.cores} cores)</li>
                <li><strong>GPU:</strong> {systemInfo.gpu}</li>
                <li><strong>RAM:</strong> {totalRamInGB} GB</li>
                <li><strong>VRAM:</strong> {totalVramInGB} GB</li>
            </ul>
        </div>
        <h1>Management Load</h1>
        <div className="chart-container">
            <div className="chart">
                <h2>CPU Usage</h2>
                <Pie
                    data={cpuData}
                    options={{
                        ...pieChartOptions, plugins: {
                            ...pieChartOptions.plugins, title: {display: false, text: 'CPU Usage'}
                        }
                    }}
                />
            </div>
            <div className="chart">
                <h2>GPU Usage</h2>
                <Pie
                    data={gpuData}
                    options={{
                        ...pieChartOptions, plugins: {
                            ...pieChartOptions.plugins, title: {display: false, text: 'GPU Usage'}
                        }
                    }}
                />
            </div>
            <div className="chart">
                <h2>RAM Usage</h2>
                <Pie
                    data={ramData}
                    options={{
                        ...pieChartOptions, plugins: {
                            ...pieChartOptions.plugins, title: {display: false, text: 'RAM Usage'}
                        }
                    }}
                />
            </div>
            <div className="chart">
                <h2>VRAM Usage</h2>
                <Pie
                    data={vramData}
                    options={{
                        ...pieChartOptions, plugins: {
                            ...pieChartOptions.plugins, title: {display: false, text: 'VRAM Usage'}
                        }
                    }}
                />
            </div>
        </div>
    </div>);
};

export default Dashboard;