<template>
    <div class="header">
        <span class="header-logo header-unit">
            <img width="60px" height="60px" src="../../static/image/icon64_nobg.png"/>
        </span>
        <span class="header-no-use header-unit">

        </span>
        <span class="signout-button header-unit">
            <router-link 
                class="signout-button"
                :to="$store.state.host + '/adminpannel/logout'"
                @click.native="signout"
                tag="li">
                登出
            </router-link>
        </span>
        <span class="userinfo header-unit">
            你好,{{this.$store.state.username}}
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    mounted() {

    },
    methods: {
        signout() {
            this.$store.commit('signout');
            this.$http.get(this.$store.state.host + '/adminpannel/logout',
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                }, response => {
                    // error callback
                    this.$message.error('未知错误');
                    // this.$store.commit('signin');
                }
            );
            this.$router.push(this.$store.state.host + '/adminpannel/login');
        }
    }
}
</script>

<style scoped>
div.header {
    width: 100%;
    height: 100%;
    margin: 0;
    background-color: #262626;
    z-index: 10;
}
.header-unit {
    float: left;
    height: 100%;
}
.header-logo {
    margin-left: 68px;
}
/* .header-no-use {
    width: 60%;
} */

span.signout-button {
    float: right;
    color: white;
}
li.signout-button {
    height: 100%;
    padding: 0 24px;
    list-style: none;
    color: #bbbbbb;
    font-size: 24px;
    text-decoration: none;
    text-align: center;
    line-height: 60px;
    border-radius: 12px;
}

li.signout-button:hover {
    background-color: #444444;
    color: #ffffff;
}

li.signout-button:active {
    color:lightgreen;
}

span.userinfo {
    float: right;
    height: 100%;
    padding: 0 24px;
    list-style: none;
    color: #bbbbbb;
    font-size: 24px;
    text-decoration: none;
    text-align: center;
    line-height: 60px;
    border-radius: 12px;
}

</style>
