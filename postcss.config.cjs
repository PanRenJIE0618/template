module.exports = {
    "plugins": {
        "postcss-pxtorem": {
            rootValue: 768, //配合flexible默认设置为192
            propList: ['*'],
            selectorBlackList: [] // 过滤class名称，不进行rem转换
        }
    }
}
