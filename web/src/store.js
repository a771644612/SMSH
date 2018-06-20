import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
      logged: false,
      id: 0,
      super: false,
      username: null,
      selectedPage: 'index',
      isEditing: false,
      loading: true,
      //host: '/'
      host: '/index.php'
    },
    mutations: {
      signin(state) {
        console.log("已登录");
        state.logged = true;
      },
      signout(state) {
        console.log("已登出");
        state.logged = false;
        state.super = false;
        state.id = 0;
        state.username = null;
        state.selectedPage = 'index';
      },
      setSuperStatus(state, status) {
          state.super = status;
      },
      selectPage(state, page){
          state.selectedPage = page;
      },
      setUserInfo(state, user) {
        state.id = user.id;
        state.username = user.username;
        state.super = user.super === 1;
        if(state.super) console.log('super!!!!!!');
      },
      setEditStatus(state, status) {
        state.isEditing = status;
      },
      setLoadingStatus(state, status) {
        state.loading = status;
      }
    },
    getters: {
      isSuper: state => {
        return state.super;
      },
      isLoading: state => {
        return state.loading;
      }
    }
})
export default store

