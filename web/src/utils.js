
const utils = {
    _self: null,
    timestampToStr(timestamp) {
        timestamp = this.toValidNumber(timestamp,false,true);
        if(timestamp === 0 || timestamp === 'empty' || timestamp === 'error') {
            return '还没有过';
        }
        var date = new Date(timestamp * 1000);
        var f=(n)=>{return (n<10)?'0'+n:n;}
        return date.getFullYear() + '-' 
            + f(date.getMonth()+1) + '-'
            + f(date.getDate()) + ' '
            + f(date.getHours()) + ':'
            + f(date.getMinutes()) + ':'
            + f(date.getSeconds());
    },
    toValidNumber(str, emptyAble = true, nonNegative = false) {
        if(nonNegative) {
            if(/^([0-9]+)$/.test(str)) {
                return parseInt(RegExp.$1);
            }
        } else {
            if(/^(\-?[0-9]+)$/.test(str)) {
                return parseInt(RegExp.$1);
            }
            if (str === '-') {
                return emptyAble? 0: 'empty';
            }
        }
        if (str === null || str == undefined || str === '') {
            return emptyAble? 0: 'empty';
        }
        return 'error';
    },
    sessionCheck(_this, code) {
        if(this._self === null) {this._self = _this; console.log('uh');}
        if(code === 403) {
            _this.$alert('请重新登录', '登录失效', {
                confirmButtonText: '确定',
                callback: action => {
                    _this.$store.commit('signout');
                    _this.$router.push('/adminpannel/login');
                }
            });
            return false;
        }
        return true;
    },
    returnFailHandler(response) {
        this._self.$message.error(response.body['code']+':发生未知错误，请联系系统管理员');
    },
    /*
        centsToYuan(cents) {
            var yuan = (cents < 100)? '0.': (Math.floor(cents/100) + '.');
            cents %= 100;
            if(cents < 10)
            {
                yuan += '0';
            }
            yuan += cents;
            return yuan;
        },
        yuanToCents(yuan) {
            if(!(/^([0-9]*)\.?([0-9]*)$/.test(yuan))) {
                return NaN;
            }
            var cents = 0;
            if(RegExp.$2 === "") {
                cents = 0;
            } else {
                cents = parseInt(RegExp.$2);
            }
            if(RegExp.$1 !== "") {
                cents += 100*parseInt(RegExp.$1);
            }
            return cents;
        },*/
}


export default {
    install(Vue, options)
    {
        Vue.prototype.util = utils;
        utils._self = Vue;
    }
}