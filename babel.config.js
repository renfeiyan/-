module.exports = {
    presets: ['@vue/app'],
    plugins: [
        ['import', {libraryName: 'sei-ui', 'libraryDirectory': 'src/components'}, 'sei-ui'],
        ['component', {libraryName: 'element-ui', 'styleLibraryName': 'theme-chalk'}, 'element-ui']
    ]
};
