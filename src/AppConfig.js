let httpProtocol = "http";
let websocketProtocol = "ws";
// const hostname = "127.0.0.1"
// const port = 8080
// const host = `${hostname}:${port}`
const host = window.location.host;
export const urls = {
    getConfig: `${httpProtocol}://${host}/config/get`,
    updateConfig: `${httpProtocol}://${host}/config/update`,
    agentList: `${httpProtocol}://${host}/monitor/get/agent_list`,
    systemInformation: `${httpProtocol}://${host}/monitor/get/information/system`,
    agentInformation: (uuid) => `${httpProtocol}://${host}/monitor/get/information/${uuid}`,
    systemPerformance: `${httpProtocol}://${host}/monitor/get/performance/system`,
    agentPerformance: (uuid) => `${httpProtocol}://${host}/monitor/get/performance/${uuid}`,
    systemLog: `${httpProtocol}://${host}/log/system_log`,
    systemLogSince: (since) => `${httpProtocol}://${host}/log/system_log/since/${since}`,
    agentLog: (uuid) => `${httpProtocol}://${host}/log/${uuid}`,
    agentLogSince: (uuid, since) => `${httpProtocol}://${host}/log/${uuid}/since/${since}`,
    inferenceRequest: `${httpProtocol}://${host}/inference/request`,
    processingTasks: `${httpProtocol}://${host}/task/processing_tasks`,
    successTasks: `${httpProtocol}://${host}/task/success_tasks`,
    failedTasks: `${httpProtocol}://${host}/task/failed_tasks`,
    downloadTask: (uuid) =>  `${httpProtocol}://${host}/task/download/${uuid}`,
}

export const websocketUrl = {
    systemPerformance: `${websocketProtocol}://${host}/monitor/websocket/performance/system`,
    agentPerformance: (uuid) => `${websocketProtocol}://${host}/monitor/websocket/performance/${uuid}`,
}

export const REFRESH_INTERVAL = 60000;
