export default {
    required: {
        test: /\S+/,
        message: '必填,不能为空'
    },
    length: {
        test: /^.{var1,var2}$/,
        message: '长度只能介于{0}至{1}个字符之间'
    },
    email: {
        test: /.+@.+\..+/,
        message: '邮箱格式错误'
    },
	mobile: {
		test: /^1[34578]\d{9}$/,
		message: '手机号码格式不正确'
	},
    url: {
        test: /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[:?\d]*)\S*$/,
        message: 'URL 格式错误'
    },
    data: { /* YYYY-MM-DD格式 */
        test: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,
        message: '日期格式错误'
    },
    dataTime: { /* YYYY-MM-DD hh:mm:ss格式 */
        test: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
        message: '日期时间格式错误'
    },
    time: { /* hh:mm:ss格式 */
        test: /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/,
        message: '时间格式错误'
    },
    english: {
        test: /^[a-zA-Z]+$/,
        message: '只能输入英文'
    },
    chinese: {
        test: /^[\u0391-\uFFE5]+$/,
        message: '只能输入中文'
    },
    int: {
        test: /^[-+]?\d*$/,
        message: '只能输入整数'
    },
    number: {
        test: /^[-+]?\d*$/,
        message: '只能输入数字'
    },
    char: {
        test: /^[a-zA-Z0-9_]+$/,
        message: '只能输入字符'
    },
    zip: {
        test: /^\d{6}$/,
        message: '邮编输入错误'
    },
    ip: {
        test: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,
        message: 'IP地址错误'
    },
    idCard: {
        test: /^\d{15}|\d{}18$/,
        message: '身份证号码错误'
    }
};
