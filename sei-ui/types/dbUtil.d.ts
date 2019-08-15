import { dataSource } from './data-source';
import { pagination } from './pagination';

export interface rule {
    /** 字段名称 */
    name?: string;

    /** 操作符: =,>,>=,<,<= 等 */
    opt?: string;

    /** 具体值 */
    val?: string | number;
}

export interface callBack {
    /** 执行结果 */
    res:object;

    /** 当前操作类型:add,edit */
    action:string;
}
