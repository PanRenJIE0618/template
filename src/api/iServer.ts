// @ts-ignore
import request from "../utils/request";

// 获取三维数据
export function getPipeline(obj:any) {
    return request({
        url: 'https://10.251.4.33:8002/iserver/services/data-pipe_3D/rest/data/featureResults.json?returnContent=true',
        method: 'post',
        data:obj
    });
}