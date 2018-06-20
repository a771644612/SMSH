<template>
<div class="aside-nav">
    <h2>
        功能菜单
    </h2>
    <ul>
        <router-link 
            v-for="item in navs"
            :key="item.id"
            :class="{selected: selected === item.pageName}" 
            :to="item.href"
            tag="li"
        >
            {{item.text}}
        </router-link>
        <!-- <router-link
            v-if="isSuper"
            :class="{selected: selected === adminNav.pageName}" 
            :to="adminNav.href"
            @click.native="selectPage(adminNav.pageName)"
            tag="li"
        >
            {{adminNav.text}}
        </router-link> -->
    </ul>
</div>
</template>

<script>
export default {
    data() {
        return {
            navs: [
                {id: 0, pageName: 'index', href: this.$store.state.host + '/adminpannel/index', text: '首页'},
                {id: 1, pageName: 'books', href: this.$store.state.host + '/adminpannel/books', text: '书籍管理'},
                {id: 2, pageName: 'events', href: this.$store.state.host + '/adminpannel/events', text: '活动管理'},
                {id: 3, pageName: 'orders', href: this.$store.state.host + '/adminpannel/orders', text: '订单管理'},
                {id: 4, pageName: 'users', href: this.$store.state.host + '/adminpannel/users', text: '用户管理'},
                {id: 5, pageName: 'admins', href: this.$store.state.host + '/adminpannel/admins', text: '超级管理'},
            ],
            //showAdminNav: false,
            //adminNav: {id: 5, pageName: 'admins', href: this.$store.state.host + '/adminpannel/admins', text: '超级管理'},
        };
    },
    mounted() {
        this.$store.commit('selectPage', this.$route.name);
    },
    watch: {
        /*isSuper(value) {
            this.showAdminNav = value;
        }*/
    },
    methods: {
        /*
        selectPage(page) {
            this.$store.commit('selectPage', page);
        }*/
    },
    computed: {
        selected() {
            return this.$store.state.selectedPage;
        },/*
        isSuper() {
            return this.$store.getters.isSuper;
        }*/
    }
}
</script>

<style scoped>
div.aside-nav {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #333333;
    z-index: 10;
}
h2 {
    margin: 0;
    padding: 10px;
    padding-top: 30px; 
    color: #f0f0f0;
    text-align: center;
}
ul {
    padding: 0;
    width: 100%;
}
li {
    width: 100%;
    height: 30px;
    margin: 0;
    padding: 10px 0;
    list-style: none;
    color: #bbbbbb;
    font-size: 20px;
    text-decoration: none;
    text-align: center;
}
li:hover {
    background-color: #444444;
    color: #ffffff;
}
li.selected {
    color: dodgerblue;
}
li.selected:hover {
    color: deepskyblue;
}
li:active {
    color:lightgreen;
}
</style>
