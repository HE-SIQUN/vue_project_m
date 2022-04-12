// postcss的配置文件

module.exports = {
    // 配置要是用的postcss插件
    plugins: {
        // 'autoprefixer': {
        //     // 配置要兼容的环境信息,vue内部已经自动开启了这个功能，所以不需要开启，否则会产生警告
        //     // browsers: ['Android >= 4.0', 'iOS >= 8']
        // },
        'postcss-pxtorem': {
            // 应该设置为设计稿宽度的十分之一
            // 但是vant 的设计为37.5
            // 支持函数的形式来操作这个 属性
            rootValue({ file }) {
                // indexof如果没找到会返回-1
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            // 配置要转换的css 属性，此时所有都需要改
            propList: ['*']
        }
    }
}