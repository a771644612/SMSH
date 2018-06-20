import Vue from 'vue';
import VueResource from 'vue-resource'
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import routes from './routes';
import store from './store'
import App from './App.vue';

import util from './utils.js'


Vue.use(VueResource)
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.use(util);

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  var _this = router.app;
  _this.$store.commit('setLoadingStatus', true);
  if(!_this.$store.state.logged) {
    _this.$http.get(_this.$store.state.host + '/adminpannel/whoami', {emulateJSON: true}
      ).then(response => {
        // success callback
        if(response.body['code'] === 200) {
          _this.$store.commit('setUserInfo', response.body['info']);
          _this.$store.commit('signin');
          _this.$message.success('欢迎回来!');
          if(to.name.requiresSuper && !_this.$store.getters.isSuper) {
            _this.$message.error('需要超级权限才能访问哦');
            //_this.$store.commit('setLoadingStatus', false);
            return next({path: _this.$store.state.host + '/adminpannel/index'});
          }
          //_this.$store.commit('setLoadingStatus', false);
          return (to.name === 'login')? next({path: _this.$store.state.host + '/adminpannel/index'}): next();
        } else if(response.body['code'] === 403){
          //_this.$store.commit('setLoadingStatus', false);
          return (to.name === 'login')? next(): next({path: _this.$store.state.host + '/adminpannel/login'});
        } else {
          _this.$message.error('未知错误');
        }
      }, response => {
        // error callback
        _this.$message.error('未知错误');
        return next(false);
        //_this.$store.commit('signin');
        //_this.$store.commit('setUserInfo', {id:1, isSuper: 1, username: 'a'});
        //_this.$store.commit('setLoadingStatus', false);
        //return (to.name === 'login')? next(): next({path: _this.$store.state.host + '/adminpannel/login'});
      }
    );
  } else if(to.name === 'login'){
    _this.$message.info('您已登录');
    _this.$store.commit('selectPage', 'index');
    //_this.$store.commit('setLoadingStatus', false);
    next({path: _this.$store.state.host + '/adminpannel/index'});
  } else if(to.meta.requiresSuper) { 
    if(_this.$store.getters.isSuper) {
      _this.$store.commit('selectPage', to.name);
      //_this.$store.commit('setLoadingStatus', false);
      next();
    } else {
      _this.$message.error('需要超级权限才能访问哦');
      _this.$store.commit('selectPage', from.name);
      _this.$store.commit('setLoadingStatus', false);
      next(false);
      //next({path: _this.$store.state.host + '/adminpannel/index'});
    }
  } else {
    if(_this.$store.state.isEditing) {
      _this.$store.commit('setEditStatus', false);
      _this.$confirm('当前仍有正在进行的编辑，确定要放弃这些编辑离开此页?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$store.commit('setEditStatus', false);
        _this.$store.commit('setLoadingStatus', true);
        _this.$store.commit('selectPage', to.name);
        next();
      }).catch(() => {
        _this.$message.info('已取消离开');
        _this.$store.commit('selectPage', from.name);
        //_this.$store.commit('setLoadingStatus', false);
      });
    } else {
      _this.$store.commit('selectPage', to.name);
      //_this.$store.commit('setLoadingStatus', false);
      next();
    }
  }
})

var vm = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

