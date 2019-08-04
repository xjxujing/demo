import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 自定义类型
const types = {
  SET_IS_AUTHENTICATED: 'SET_IS_AUTHENTICATED',
  SET_USER: 'SET_USER'
}
// 设置状态
const state = {
  isAuthenticated: false, // 默认授权
  user: {}  // 解析token后的信息放在这里
}
// 获取状态
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}
// 更改状态信息
const mutations = {
  [types.SET_IS_AUTHENTICATED](state, isAuthenticated) {
    if (isAuthenticated) state.isAuthenticated = isAuthenticated;
    else state.isAuthenticated = false;
  },
  [types.SET_USER](state, user) {
    if (user) state.user = user;
    else state.user = {};
  }
}
// 调用mutations
const actions = {
  setAuthenticated: ({ commit }, isAuthenticated) => {
    commit(types.SET_IS_AUTHENTICATED, isAuthenticated);
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  },
  clearCurrentState: ({ commit }) => {
    commit(types.SET_IS_AUTHENTICATED, false)
    commit(types.SET_USER, null)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
