export interface envAttribute {
    /** 代理前缀,常设置为'/api' */
    baseURL?: string;

    /** 是否跨域 */
    crossDomain?: boolean;

    /** 是否跨域时带签名 */
    withCredentials?: boolean;

    /** ajax请求超时时间 */
    timeout?: number;
}

export declare module http {
    /**
     * 设置环境变量,常用于main.js中设置代理,格式如下:
     * {
     *     baseURL: '/api',
     *     crossDomain: true,   //是否跨域
     *     withCredentials: true,    //是否跨域时带签名
     *     timeout: 5000    //ajax请求超时时间
     * }
     *
     */
    export function setEvn(env: envAttribute): void;

    /**
     * ajax的post方式提交
     * @param {String} url: url地址
     * @param {object} params: json格式参数
     * @param {boolean} isLoading: 是否需要动画,false不需要,默认为false
     * @param {boolean} isMessage: 是否显示执行结果提示框,默认为 false 不显示
     * @param {string} contentType: 提交类型,默认为 application/json;charset=utf-8;
     */
    export function post(url: String,   /* url地址 */
                         params: object,    /* json格式参数 */
                         isLoading: boolean,    /* 是否需要动画,false不需要,默认为false */
                         isMessage: boolean,    /* 是否显示执行结果提示框,默认为 false 不显示 */
                         contentType: string    /* 提交类型,默认为 application/json;charset=utf-8; */
    ): void;

    /**
     * ajax的get方式提交
     * @param {String} url: url地址
     * @param {object} params: json格式参数
     * @param {boolean} isLoading: 是否需要动画,false不需要,默认为false
     * @param {boolean} isMessage: 是否显示执行结果提示框,默认为 false 不显示
     * @param {string} contentType: 提交类型,默认为 application/json;charset=utf-8;
     */
    export function get(url: String,   /* url地址 */
                        params: object,    /* json格式参数 */
                        isLoading: boolean,    /* 是否需要动画,false不需要,默认为false */
                        isMessage: boolean,    /* 是否显示执行结果提示框,默认为 false 不显示 */
                        contentType: string    /* 提交类型,默认为 application/json;charset=utf-8; */
    ): void;

    /**
     * 文件上传
     * @param {String} url: url地址
     * @param {object} params: json格式参数
     * @param {boolean} isLoading: 是否需要动画,false不需要,默认为false
     * @param {boolean} isMessage: 是否显示执行结果提示框,默认为 false 不显示
     */
    export function fileUpload(url: String,   /* url地址 */
                               params: object,    /* data数据*/
                               isLoading: boolean,    /* 是否需要动画,false不需要,默认为false */
                               isMessage: boolean,    /* 是否显示执行结果提示框,默认为 false 不显示 */
    ): void;

    /**
     * 文件下载
     * @param {String} url: url地址
     * @param {object} params: json格式参数
     * @param {boolean} isLoading: 是否需要动画,false不需要,默认为false
     * @param {boolean} isMessage: 是否显示执行结果提示框,默认为 false 不显示
     */
    export function fileDown(url: String,   /* url地址 */
                             params: object,    /* json格式参数 */
                             isLoading: boolean,    /* 是否需要动画,false不需要,默认为false */
                             isMessage: boolean,    /* 是否显示执行结果提示框,默认为 false 不显示 */
    ): void;

}
