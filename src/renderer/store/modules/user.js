const state = {
    isLogin: false,
    userInfo: {},
    friendsList: [],
  }
  const getters = {
    isLogin: state=> state.isLogin,
    userInfo: state=> state.userInfo,
    friendsList: state=> state.friendsList,
  }
  
  const mutations = {
    setLoginStatus (state, val) {
      state.isLogin= val
    },
    setUserInfo (state, val) {
        state.userInfo= val
    },
    saveFriends (state, val) {
       state.friendsList= val
    },
    
  

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
    saveFriends (commit, val) {
        // do something async
        commit.commit('saveFriends', val)
    },
  
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }
  