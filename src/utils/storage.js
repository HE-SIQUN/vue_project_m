//* 将生成本地数据存储的方式用模块化封装起来 */

export const getItem = name => {
        // 获取数据
        const data = window.localStorage.getItem(name)
            // 利用能否判断json格式字符串来实现
        try {
            return JSON.parse(data)

        } catch (err) {
            return data;
        }
    }
    // 存储数据
export const setItem = (name, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)
}
export const removeItem = name => {
    window.localStorage.removeItem(name)
}