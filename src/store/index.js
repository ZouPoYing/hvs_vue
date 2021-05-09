import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      userid: '',
      username: '',
      name: '',
      password: '',
      telephone: '',
      email: '',
      usertype: '',
      audit: '',
      date: '',
      sex: ''
    },
    userType: [
      { value: 0, name: '管理员'  },
      { value: 1, name: '病人'  },
      { value: 2, name: '医生'  }
    ],
    whether: [
      { value: 0, name: '是' },
      { value: 1, name: '否' }
    ]
  },
  mutations: {
    getUserId(state,userid) {
      state.user.userid = userid
    },
    getName(state,name) {
      state.user.name = name
    },
    clearUserCache(state) {
      state.user.userid = '',
      state.user.username = '',
      state.user.name = '',
      state.user.password = '',
      state.user.telephone = '',
      state.user.email = '',
      state.user.usertype = '',
      state.user.audit = '',
      state.user.date = ''
    }
  },
  actions: {

  },
  getters: {
    getUserType: (state)=> (code)=>{
      if(code!=null || code!=undefined) {
        let arr = state.userType.filter(item=> item.value ==  parseInt(code));
        return arr[0].text;
      } else {
        return '-';
      }
    },
    getWhether: (state)=> (code)=>{
      if(code!=null || code!=undefined) {
        let arr = state.whether.filter(item=> item.value ==  parseInt(code));
        return arr[0].text;
      } else {
        return '-';
      }
    }
  },
  modules: {

  }
})

export default store
