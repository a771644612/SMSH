<template>
<div class="login-container">
    <div class="signin-form-container">
        <div v-if="$store.getters.isLoading" class="content-mask">
            <img id="loading-image" src="/static/image/loading.svg" alt="Loading...">
        </div>
        <ul>
            <li v-for="msg in tip_messages" 
                :key="msg.id" 
                class="signin-tip"
            >
                {{msg.text}}
            </li>
        </ul>
        <div class="signin-form">
            <div class="input-container">
                <input v-model="username" id="admin-name" type="text" placeholder="管理员ID" />
            </div>
            <div class="input-container">
                <input v-model="password" id="admin-password" type="password" placeholder="密码" />
            </div>
            <div class="checkbox-container">
                <input v-model="remember" id="admin-remember" type="checkbox"/>
                <label for="admin-remember"> 7天内记住我 </label>
            </div>
            <ul>
                <li v-for="msg in error_messages" 
                    :key="msg.id"
                    class="signin-error"
                >
                    {{msg.text}}
                </li>
            </ul>
            <button @click="signin_submit_check" id="admin-signin"> {{text}} </button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            tip_messages: [
                {id: 0, text: '请输入ID和密码以确认管理员身份'}
            ],
            error_messages: [],
            text: '管理员登录',
            username: '',
            password: '',
            remember: false,
            super: false
        };
    },
    mounted(){
        this.$store.commit('setLoadingStatus', false);
    },
    methods: {
        signin_submit_check: function(event) {   
            this.error_messages = [];
            this.username = this.username.trim();
            this.password = this.password.trim();
            if(this.username === '')
            {
                this.error_messages.push({id: 1, text: '没有输入ID!'});
            }
            if(this.password === '')
            {
                this.error_messages.push({id: 2, text: '没有输入密码!'});
            }
            if(this.error_messages.length > 0)
            {
                return;
            }
            this.$http.post(this.$store.state.host + '/adminpannel/login', {
                    'username': this.username,
                    'password': this.password,
                    'remember': this.remember
                }, 
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var result = response.body;
                    if(result['code'] === 401)
                    {
                        this.error_messages.push({id: 402, text: 'ID或密码错误!'});
                        this.password = '';
                    }
                    else if(result['code'] === 200)
                    {
                        this.$store.commit('setUserInfo', result['info']);
                        this.$store.commit('signin');
                        this.$router.push(this.$store.state.host + '/adminpannel/index');
                    }
                }, response => {
                    // error callback
                    this.error_messages.push({id: 500, text: '未知原因导致登录失败!'});
                }
            );
        }
    }
}
</script>

<style scoped>

.login-container {
    width: 100%;
    height: 100%;
    top: 0;
    position: absolute;
    background: #8284a0d1;
    background-image: repeating-linear-gradient(30deg,hsla(0,0%,100%,.1), hsla(0,0%,100%,.1) 15px, transparent 0,transparent 30px);
    min-width: 600px;
}

.signin-form-container {
    position: relative;
    box-shadow: 2px 5px 20px #23151561;
    width: 360px;
    margin-top: 10%;
    margin-left: auto;
    margin-right: auto;
    padding: 60px 40px;
    background-color: white;
    opacity: 0.88;
    border-radius: 6px;
    text-align: center;
}
ul {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-bottom: 30px;
}
li {
    width: 274px;
    margin: auto;
    margin-bottom: 10px;
    padding: 16px 12px;
    line-height: 1.5;
    color: white;
    border-radius: 4px;
    text-align: left;
    font-size: 16px;
    word-wrap: break-word;
}
li.signin-tip {
    background-color: #0099ff;
}
li.signin-error {   
    background-color: #aaaaaa;
}
.signin-form {
    margin-bottom: 30px;
}
.input-container {
    margin: 0;
}
.checkbox-container {
    margin: 10px;
}


#admin-name, #admin-password {
    width: 280px;
    height: 40px;
    margin-bottom: 0;
    padding-left: 10px;
    border: 1px solid gray;
    font-size: 20px;
}
#admin-name {
    border-radius: 4px 4px 0 0;
}
#admin-password {
    border-top: none;
    border-radius: 0 0 4px 4px; 
}
#admin-signin {
    width: 294px;
    height: 50px;
    margin: 0 auto;
    font-size: 20px;
    background-color: lightcoral;
    color: white;
    border: 1px solid;
    border-radius: 4px;
}

.content-mask {
    position: absolute;
    width: 360px;
    height: 60%;
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 10000;
}

#loading-image {
    position: absolute;
    width: 30%;
    top: 15%;
    left: 35%;
}
</style>
