// @ts-ignore
import axios, {AxiosRequestConfig} from 'axios';
// @ts-ignore
import {ElMessage, ElMessageBox} from 'element-plus';
//使用指定配置创建axios实例
const instance = axios.create({
    // 基础路径
    baseURL: '',
    // 请求超时时间
    timeout: 5000,
});
// @ts-ignore
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    // 请求头添加token
    return config;
}, (error: any) => {
    return Promise.reject(error);
});
// 响应拦截器
instance.interceptors.response.use((response: any) => {
    const status = response.data.status;
    if (!status || status === 200) {
        return response;
    }
    // 其他错误情况
    ElMessage.error(response.data.msg || '请求失败');
    return Promise.reject(response.data);
}, (error: any) => {
    return Promise.reject(error);
});
export default <T = any>(config: AxiosRequestConfig) => {
    return instance(config).then((res: any) => {
        return (res.data.data || res.data) as T;
    });
}
