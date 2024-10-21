let httpProtocol = "http";
let websocketProtocol = "ws";
const hostname = "140.130.34.68"
const port = 8080
export const urls = {
    systemInformation: `${httpProtocol}://${hostname}:${port}/monitor/get/information/system`,
    agentInformation: (uuid) => `${httpProtocol}://${hostname}:${port}/monitor/get/information/${uuid}`,
    systemPerformance: `${httpProtocol}://${hostname}:${port}/monitor/get/performance/system`,
    agentPerformance: (uuid) => `${httpProtocol}://${hostname}:${port}/monitor/get/performance/${uuid}`,
    getConfig: `${httpProtocol}://${hostname}:${port}/config/get`,
    updateConfig: `${httpProtocol}://${hostname}:${port}/config/update`,
}

export const websocketUrl = {
    systemPerformance: `${websocketProtocol}://${hostname}:${port}/monitor/websocket/performance/system`,
    agentPerformance: (uuid) => `${websocketProtocol}://${hostname}:${port}/monitor/websocket/performance/${uuid}`,
}
