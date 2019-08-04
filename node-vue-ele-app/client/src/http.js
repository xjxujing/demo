import axios from 'axios'
import { Loading, Message } from 'element-ui';
import router from './router'

let loading;
// 开始加载动画
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(0, 0, 0, .7)' // 注意这里是字符串
    })
}
// 结束加载动画
function endLoading() {
    loading.close()
}


// 请求拦截
axios.interceptors.request.use(config => {
    // 开始加载动画
    startLoading()
    // 设置统一header
    if (localStorage.eleToken) {
        config.headers.Authorization = localStorage.eleToken
    }
    return config
}, error => {
    return Promise.reject(error)
});

// 响应拦截
axios.interceptors.response.use(response => {
    // 结束加载动画
    // console.log(response) // 这里的response和Login.vue中请求成功的返回一样
    endLoading()
    return response
}, error => {
    // console.log(error.response); // 注意直接打印error看不到详细的
    endLoading()
    // 错误提醒
    Message.error(error.response.data)

    // 判断token是否过期
    const { status } = error.response
    if (status == 401) {
        // 错误提示
        Message.error("token失效，请重新登录")
        // 删除token
        localStorage.removeItem("eleToken")
        // 跳转login
        router.push('/login')
    }
    return Promise.reject(error)
})

export default axios