import axios from 'axios';
import {Message, Loading} from 'element-ui';
import router from '../router';
import tools from './tools';
import qs from 'qs';

let loadingInstance = null;

/**
 * 设置环境变量
 * @param evn
 */
axios.defaults.baseURL = '/api';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000;
const setEvn = (evn) => {
    axios.defaults.baseURL = evn && evn.baseURL ? evn.baseURL : '/api';
    axios.defaults.crossDomain = evn && evn.crossDomain ? evn.crossDomain : true;
    axios.defaults.withCredentials = evn && evn.withCredentials ? evn.withCredentials : true;
    axios.defaults.timeout = evn && evn.timeout ? evn.timeout : 15000;
};

const startLoading = (text = '') => {
    loadingInstance = Loading.service({
        lock: true,
        text: text,
        background: 'rgba(255, 255, 255, 0.5)'
    })
};

const endLoading = () => {
    loadingInstance && loadingInstance.close();
};

/**
 * 检查完状态码后需要检查后如果成功了就需要检查后端的状态码处理网络正常时后台语言返回的响应
 * @param {object} res 是后台返回的对象或者自定义的网络异常对象，不是http 响应对象
 * @return {object} 返回后台传过来的数据对象，包含code,message,data等属性，
 **/
function checkCode(res, isMessage) {
    let message = res.message;
    let type = 'error';
    switch (res.code) {
        case 1: message = '操作成功';type = 'success'; break;
        case 0: if (!message) {message = '执行失败';} break;
        case -1: if (!message) {message = '操作部分成功';} break;
        case -2: if (!message) {message = '未登陆';} router.router.push('/login'); return;
        case -3: if (!message) {message = '权限不足';} router.router.push('/index/noPrivilege');break;
        default: if (!message) {message = '网络异常';} break;
    }
    if (type === 'error' || isMessage === true) {
        Message({showClose: true, message: message, type: type})
    }
    return res
}

/**
 *
 * 请求发出后检查返回的状态码,统一捕获正确和错误的状态码，正确就直接返回response,错误就自定义一个返回对象
 * @param {object} response 响应对象
 * @param isSubmit 是否是提交接口
 * @return {object} 响应正常就返回响应数据否则返回错误信息
 */
function checkStatus (res, isMessage) {
    if (res && ((res.status === 200 || res.status === 304))) {
        return checkCode(tools.isString(res.data) ? JSON.parse(res.data) : res.data, isMessage);
    } else {
        if (res && res.status) {
            switch (res.status) {
                case 400: res.message = '请求错误(400)';break;
                case 401: res.message = '未授权，请重新登录(401)';break;
                case 403: res.message = '拒绝访问(403)';break;
                case 404: res.message = '请求出错(404)';break;
                case 408: res.message = '请求超时(408)';break;
                case 500: res.message = '服务器错误(500)';break;
                case 501: res.message = '服务未实现(501)';break;
                case 502: res.message = '网络错误(502)';break;
                case 503: res.message = '服务不可用(503)';break;
                case 504: res.message = '网络超时(504)';break;
                case 505: res.message = 'HTTP版本不受支持(505)';break;
                default:res.message = `连接出错(${res.status})!`;
            }
        } else {
            res.message = '连接服务器失败!'
        }
        Message.error(res.message)
    }
}

const ajax = tools.throttle(async function(method = 'post', url, params, isLoading, isMessage, contentType) {
    isLoading && startLoading();
    return await axios({method: method, url: url, data: contentType ? qs.stringify(params) : JSON.stringify(params),
        headers: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': contentType ? contentType : 'application/json;charset=utf-8;'}
    }).then(res => {
        endLoading();
        return checkStatus(res, isMessage);
    }).catch(() => {
        endLoading();
        Message.error('网络异常');
    })
});

export default {
    /**
     *
     * @param url
     * @param data 数据
     * @param isLoading 是否需要动画,false不需要
     * @returns {Promise<AxiosResponse<any>>}
     */
    /**
     *
     * @param url: 地址
     * @param params: 数据
     * @param isLoading: 是否需要动画,false不需要
     * @param isMessage: 是否显示执行结果提示框
     * @param contentType: 提交类型,默认为: application/json;charset=utf-8
     * @returns {Promise<any | never>}
     */
    post (url, params = {}, isLoading, isMessage, contentType) {
        return ajax('post', url, params, isLoading, isMessage, contentType);
    },

    get (url, params = {}, isLoading, isMessage, contentType) {
        return ajax('get', url, params, isLoading, isMessage, contentType);
    },

    /**
     *
     * @param url
     * @param data
     * @param isLoading
     * @returns {Promise<AxiosResponse<any>>}
     */
    fileUpload (url, params = {}, isLoading, isMessage) {
        isLoading === true && startLoading();
        return axios(
            {method: 'post', url: url, data: params, headers: {'Content-Type': 'multipart/form-data;'}
        }).then((res) => {
            endLoading();
            return checkStatus(res, isMessage)
        }).catch(() => {
            endLoading();
            Message.error('网络异常');
        })
    },

    /**
     * 文件下载
     * @param url
     * @param params: json格式参数
     * @param saveFileName:保存的文件名称
     * @param isLoading
     * @returns {Promise<AxiosResponse<any>>}
     */
    fileDown (url, params = {}, isLoading) {
        if (isLoading === true) {
            startLoading();
        }
        return axios({
            method: 'post',
            url: url,
            data: JSON.stringify(params),
            responseType: 'blob',
            headers: {'Content-Type': 'application/json;charset=utf-8;'}
        }).then((res) => {
            let saveFileName = res.headers['content-disposition'];
            if (saveFileName) {
                let i = saveFileName.lastIndexOf('filename="');
                saveFileName = saveFileName.substring(i + 10);
                saveFileName = saveFileName.substring(0, saveFileName.length - 1);
            }
            let blob = new Blob([res.data], {type: res.headers['content-type']});
            if ('download' in document.createElement('a')) { // 非IE下载
                const link = document.createElement('a');
                link.download = decodeURIComponent(saveFileName);
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(link.href); // 释放URL 对象
                document.body.removeChild(link);
            } else { // IE10+下载
                navigator.msSaveBlob(blob, saveFileName)
            }
            endLoading();
            return res
        }).catch(() => {
            endLoading();
            Message.error('网络异常');
        })
    },
    setEvn
}
