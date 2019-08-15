
import Vue from 'vue';

export declare interface dataSource extends Vue {
    /**
     * 模块编号
     * @default default
     */
    module?:'';

    /**
     * SQL数据源编号,,使用本项可以不设置module值
     * @default default
     */
    source?:'';

    /**
     * 数据库视图名称,使用本项必须设置module值
     * @default default
     */
    view?:'';

    /**
     * 表名称,使用本项必须设置module值
     * @default default
     */
    table?:'';

    /**
     * 是否要求服务器返回主键字段名称
     * @default false
     */
    key?:false;

    /**
     * 要求服务器返回的字段,多个字段逗号分隔,默认拿所有字段
     * @default default
     */
    fields?:'';

    /**
     * 排序,例如按姓名升序排序: 'name asc'
     * @default default
     */
    order?:'';

    /**
     * 服务器SQL过滤条件,格式为json数组
     * [{         //服务器SQL过滤条件
     *    name:''     //字段名称
     *    opt:''      //操作条件,例如>,>=,=,<,<=,Like等
     *    val:''      //条件值
     * }]
     * @default default
     */
    rule?:null;

    /**
     * 在服务器返回的数据中加入额外的json格式数据,格式为json数组,例如:
     * [
     *   {} //json对象
     * ]
     * @default default
     */
    addData?:null;

    /**
     * 是否要求重新从数据库重新拿当前条数据,用于查看和编辑
     * @default false
     */
    request?:false;

    /**
     * 如果将当前数据集存为字段,则配置本项的字典名称,数据将作为字典缓存,使用本项必须配置option,注意:有分页page或刷新refresh的都会强制刷新
     * @default default
     */
    dic?:'';

    /**
     * 是否要求强制刷新并根据dic的配置存为字段,只有在配置了dic的情况下才有用
     * @default false
     */
    refresh?:false;

    /**
     * 将结果数据转换为键值对形式,转换形式为: value ==> {id:value,name:value},用于返回的不是json数组，转换为json数组行,常用于选择框
     * @default default
     */
    map?:null;

    /**
     * 将结果数据转换为树型结构形式,使用本项必须配置option
     * 1:父子都在同一条记录情况,分离成2条记录的形式
     * 2:父子分别为2条记录的情况
     * @default default
     */
    tree?:null;

    /**
     * 选项配置,格式为:
     * {
     *    pid:''      //父字段名称
     *    id:''       //子字段名称
     *    label:''    //要显示的中文内容的字段名称
     * }
     * @default default
     */
    option?:null;

    /**
     * 对结果进行每条数据遍历回调函数
     * @default default
     */
    queryRowEvn?:null;

    /**
     * 点击增加按钮前的回调函数,注意不是保存事件
     * @default default
     */
    beforeAddEvn?:null;

    /**
     * 点击编辑按钮前的回调函数,注意不是保存事件
     * @default default
     */
    beforeEditEvn?:null;

    /**
     * 点击查看按钮前的回调函数,注意不是保存事件
     * @default default
     */
    beforeSeeEvn?:null;

    /**
     * 点击增加按钮后的回调函数,注意不是保存事件,参数为currEditSelection
     * @default default
     */
    afterAddEvn?:null;

    /**
     * 点击编辑按钮后的回调函数,注意不是保存事件,参数为currEditSelection
     * @default default
     */
    afterEditEvn?:null;

    /**
     * 点击查看按钮后的回调函数,注意不是保存事件,参数为currEditSelection
     * @default default
     */
    afterSeeEvn?:null;

    /**
     * add,edit,del 操作前的回调函数, 参数为操作类型和发往服务器的数据,本方法返回false将终止后续操作
     * @default default
     */
    beforeSaveEvn?:null;

    /**
     * 查询前的回调方法, 参数为发往服务器的数据,本方法返回false将终止后续操作
     * @default default
     */
    beforeQueryEvn?:null;

    /**
     * 新增数据前的回调, 参数为发往服务器的数据,本方法返回false将终止后续操作
     * @default default
     */
    beforeAddSaveEvn?:null;

    /**
     * 编辑数据前的回调, 参数为发往服务器的数据,本方法返回false将终止后续操作
     * @default default
     */
    beforeEditSaveEvn?:null;

    /**
     * 删除数据前的回调, 参数为发往服务器的数据,本方法返回false将终止后续操作
     * @default default
     */
    beforeDelSaveEvn?:null;

    /**
     * 查询后的回调, 参数为服务器返回数据
     * @default default
     */
    afterQueryEvn?:null;

    /**
     * 成功新增后的回调, 参数为服务器返回数据
     * @default default
     */
    afterAddSaveEvn?:null;

    /**
     * 成功编辑后的回调, 参数为服务器返回数据
     * @default default
     */
    afterEditSaveEvn?:null;

    /**
     * 成功删除后的回调, 参数为服务器返回数据
     * @default default
     */
    afterDelSaveEvn?:null;

    /**
     * add,edit,del 成功保存后的回调函数, 参数为操作类型和服务器返回数据
     * @default default
     */
    afterSaveEvn?:null;

}
