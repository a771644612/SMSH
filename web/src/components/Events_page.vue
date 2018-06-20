<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="砍价" name="first">
            </el-tab-pane>
            <el-tab-pane label="轮盘" name="second">
            </el-tab-pane>
            <el-tab-pane label="抽奖" name="third">
            </el-tab-pane>
            <el-tab-pane label="其它" name="fourth">
            </el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentTabComponent"></component>
        </keep-alive>
    </div>
</template>

<script>
import BargainTable from './Event_bargain_table.vue';
import RoundTable from './Event_round_table.vue';
import LotteryTable from './Event_lottery_table.vue';
import OthersTable from './Event_others_table.vue';

export default {
    components: {
        OthersTable,//CheckinTable: () => import('./Event_others_table.vue'),
        BargainTable,//BargainTable: () => import('./Event_bargain_table.vue'),
        RoundTable,//RoundTable: () => import('./Event_round_table.vue'),
        LotteryTable,//LotteryTable: () => import('./Event_lottery_table.vue')
    },
    data() {
        return {
            activeName: 'first',
            currentTabName: 'BargainTable',
        };
    },
    computed: {
        currentTabComponent() {
            return this.currentTabName;
        },
    },
    mounted(){
        this.$store.commit('setLoadingStatus', false);
    },
    methods: {
        handleClick(tab, event) {
            switch(tab.name) {
                case 'first': this.currentTabName = 'BargainTable'; break;
                case 'second': this.currentTabName = 'RoundTable'; break;
                case 'third': this.currentTabName = 'LotteryTable'; break;
                case 'fourth': this.currentTabName = 'OthersTable'; break;
            }
        }
    },
}
</script>

<style scoped>
.el-tabs {
    margin: 10px 20px;
}
</style>
