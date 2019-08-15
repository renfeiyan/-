module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
        'indent': [0, 2, 4],
        'quotes': [2, 'single'],
        'semi': [0, 'always'],
        'no-extra-semi': 2, // 禁止不必要的分号
        'no-extra-boolean-cast': 2, // 禁止不必要的布尔转换
        'no-catch-shadow': 2, // 禁止catch子句参数与外部作用域变量同名
        'comma-spacing': [2, {'before': false, 'after': true}], // 控制逗号前后的空格
        'comma-style': [2, 'last'], // 控制逗号在行尾出现
        'brace-style': [2, '1tbs', {'allowSingleLine': true}], // if while function 后面的{必须与if在同一行，java风格
        'camelcase': 1, // 双峰驼命名格式
        'comma-dangle': 2, // 禁止末尾逗号
        'keyword-spacing': 2, // 关键字后面使用空格
        'spaced-comment': 2, // 强制在注释中 // 或 /* 使用一致的空格
        'curly': [2, 'all'], // 强制所有控制语句使用一致的括号风格
        'dot-location': [2, 'property'], // 强制object.key 中 . 的位置应与属性在同一行
        'key-spacing': [2, {'beforeColon': false, 'afterColon': true}], // 对象字面量中冒号的前后空格
        'computed-property-spacing': [2, 'never'], // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
        'no-duplicate-case': 2, // switch中的case标签不能重复
        'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
        'no-func-assign': 2, // 禁止重复的函数声明
        'no-extra-parens': 1, // 禁止非必要的括号
        'no-invalid-regexp': 2, // 禁止无效的正则表达式
        'no-irregular-whitespace': 2, // 不能有不规则的空格
        'no-mixed-spaces-and-tabs': [2, false], // 禁止混用tab和空格
        'no-multi-spaces': 2, // 不能用多余的空格
        'no-multiple-empty-lines': [2, {'max': 2}], // 空行最多不能超过2行
        'no-redeclare': 2, // 禁止重复声明变量
        'no-self-compare': 2, // 不能比较自身
        'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
        'no-trailing-spaces': 2, // 一行结束后面不要有空格
        'no-undef': 2, // 不能有未定义的变量
        'no-undef-init': 2, // 变量初始化时不能直接给它赋值为undefined
        'no-undefined': 0, // 不能使用undefined
        'no-unreachable': 2, // 不能有无法执行的代码
        'no-unused-expressions': 0, // 禁止无用的表达式
        'no-unused-vars': [2, {'vars': 'all', 'args': 'after-used'}], // 不能有声明后未被使用的变量或参数
        'no-use-before-define': 2, // 不允许在变量定义之前使用它们
        'no-useless-call': 2, // 禁止不必要的call和apply
        'no-void': 2, // 禁用void操作符
        'no-var': 0, // 禁用var，用let和const代替
        'array-bracket-spacing': [2, 'never'], // 是否允许非空数组里面有多余的空格
        'arrow-parens': 0, // 箭头函数用小括号括起来
        'arrow-spacing': 2, // =>的前/后括号
        'default-case': 2, // switch语句最后必须有default
        'dot-notation': [0, {'allowKeywords': true}], // 避免不必要的方括号
        'lines-around-comment': 0, // 行前/行后备注
        'object-curly-spacing': [2, 'never'], // 大括号内是否允许不必要的空格
        'operator-linebreak': [2, 'after'], // 换行时运算符在行尾还是行首
        'space-before-blocks': [2, 'always'], // 不以新行开始的块{前面要不要有空格
        'space-before-function-paren': [0, 'always'], // 函数定义时括号前面要不要有空格
        'space-in-parens': [2, 'never'], // 小括号里面要不要有空格
        'vue/jsx-uses-vars': 2, // 定义了的 jsx element 必须使用
        'no-regex-spaces': 2, // 禁止在正则表达式字面量中使用多个空格
        'new-parens': 2, // new时必须加小括号
        'no-empty-function': 2, // 禁止出现空函数
        'no-new-func': 2, // 禁止对 Function 对象使用 new 操作符
        'no-new-wrappers': 2 // 禁止对 String，Number 和 Boolean 使用 new 操作符
        // 'no-shadow': 2, // 禁止 var 声明 与外层作用域的变量同名
        // 'block-spacing': 2 // 强制在单行代码块中使用一致的空格
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
