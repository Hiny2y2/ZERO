const state = {
    isLogin: false,
    userInfo: {}
  }
  const getters = {
    isLogin: state=> state.isLogin,
    userInfo: state=> state.userInfo,
  }
  
  const mutations = {
    setLoginStatus (state, val) {
      state.isLogin= val
    },
    setUserInfo (state, val) {
        state.userInfo= val
    }
  

  }
  
  const actions = {
    setLoginStatus (commit, val) {
      // do something async
      commit.commit('setLoginStatus', val)
    },
    setUserInfo (commit, val) {
        // do something async
        commit.commit('setUserInfo', val)
      },
  
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }
  