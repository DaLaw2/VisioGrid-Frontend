let httpProtocol = "http";
let websocketProtocol = "ws";
const hostname = "140.130.34.68"
const port = 8080
export const urls = {
    getConfig: `${httpProtocol}://${hostname}:${port}/config/get`,
    updateConfig: `${httpProtocol}://${hostname}:${port}/config/update`,
    agentList: `${httpProtocol}://${hostname}:${port}/monitor/get/agent_list`,
    systemInformation: `${httpProtocol}://${hostname}:${port}/monitor/get/information/system`,
    agentInformation: (uuid) => `${httpProtocol}://${hostname}:${port}/monitor/get/information/${uuid}`,
    systemPerformance: `${httpProtocol}://${hostname}:${port}/monitor/get/performance/system`,
    agentPerformance: (uuid) => `${httpProtocol}://${hostname}:${port}/monitor/get/performance/${uuid}`,
    systemLog: `${httpProtocol}://${hostname}:${port}/log/system_log`,
    systemLogSince: (since) => `${httpProtocol}://${hostname}:${port}/log/system_log/since/${since}`,
    agentLog: (uuid) => `${httpProtocol}://${hostname}:${port}/log/${uuid}`,
    agentLogSince: (uuid, since) => `${httpProtocol}://${hostname}:${port}/log/${uuid}/since/${since}`,
}

export const websocketUrl = {
    systemPerformance: `${websocketProtocol}://${hostname}:${port}/monitor/websocket/performance/system`,
    agentPerformance: (uuid) => `${websocketProtocol}://${hostname}:${port}/monitor/websocket/performance/${uuid}`,
}

export const AGENT_LIST_REFRESH_INTERVAL = 60000;
export const LOG_REFRESH_INTERVAL = 60000;
