<template>
    <el-container style="height:100%; min-height:100%; max-height:100%; min-width:800px;">
        <el-header>
            <header-bar/>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <aside-nav-bar/>
            </el-aside>
            <el-main>
                <div stylr="z-index:100;" v-if="$store.getters.isLoading" class="content-mask" >
                    <img id="loading-image" src="/static/image/loading.svg" alt="Loading...">
                </div>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import HeaderBar from './Home_header.vue';
import AsideNavBar from './Home_aside_nav.vue';

export default {
    components: {
        HeaderBar,//AsideNavBar: () => import('./Home_header.vue'),
        AsideNavBar,//HeaderBar: () => import('./Home_aside_nav.vue')
    },/*
    data() {
        return {
            loading: true,
        };
    },
    computed: {
        isLoading() {
            return this.$store.getters.isLoading;
        }
    }*/
}
</script>

<style scoped>

.el-container, .el-main {
    margin: 0;
    padding: 0;
}

.el-header {
    height: 60px;
    margin: 0;
    padding: 0;
    background-color: #262626;
}

.el-aside {
    min-height: 100%;
    margin: 0;
    padding: 0;
    background-color: #333333;
}

.el-main {
    position: relative;
    min-width: 600px;
}

.content-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 10000;
}

#loading-image {
    position: absolute;
    width: 10%;
    top: 45%;
    left: 45%;
}

</style>
