<template>
    <div class="container">
        <!-- <div class="welcome-text">欢迎来到“水木书荟”小程序管理页面</div> -->
        
        <div style="font-size: xx-large;font-weight: 100;margin:20px;">概览:</div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="never" :body-style="cardStyle" class="box-card">
                    <div class="image-container">
                        <div id="activityChart" :style="{width:'100%',height:'100%'}"></div>
                    </div>
                    <div class="data-container">
                        <el-row type="flex">
                            <el-col :span="20">
                                <div class="data-text">
                                    活动总数：&nbsp;
                                    <animated-integer v-model="totalActivityNum" class="data-num"></animated-integer>
                                    &nbsp;&nbsp;个
                                </div>
                                <ul class="data-ul">
                                    <li><div class="small-data-text">
                                        正在进行：&nbsp;
                                        <animated-integer v-model="goingActivityNum" class="small-data-num"></animated-integer>
                                        &nbsp;&nbsp;个
                                    </div></li>
                                    <li><div class="small-data-text">
                                        已经结束：&nbsp;
                                        <animated-integer v-model="stopActivityNum" class="small-data-num"></animated-integer>
                                        &nbsp;&nbsp;个
                                    </div></li>
                                    <li><div class="small-data-text">
                                        即将开始：&nbsp;
                                        <animated-integer v-model="soonActivityNum" class="small-data-num"></animated-integer>
                                        &nbsp;&nbsp;个
                                    </div></li>
                                </ul>
                            </el-col>
                            <el-col :span="4">
                                <div class="info-button">
                                    <router-link :to="$store.state.host + '/adminpannel/events'" @click.native="$store.commit('selectPage', 'events')">
                                        <el-button plain icon="el-icon-arrow-right" >查看详情</el-button>
                                    </router-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" :body-style="cardStyle" class="box-card">
                    <div class="image-container">
                        <div id="orderChart" :style="{width:'100%',height:'100%'}"></div>
                    </div>
                    <div class="data-container">
                        <el-row type="flex">
                            <el-col :span="20">
                                <div class="data-text">
                                    订单总数：&nbsp;
                                    <animated-integer v-model="totalOrderNum" class="data-num"></animated-integer>
                                    &nbsp;&nbsp;单
                                </div>
                                <ul class="data-ul">
                                    <li><div class="small-data-text">
                                        待发货：&nbsp;
                                        <animated-integer v-model="s0OrderNum" style="color:#ff0798e6;font-weight: 600;" class="small-data-num"></animated-integer>
                                        &nbsp;&nbsp;单
                                    </div></li>
                                    <li><div class="small-data-text">
                                        待收货：&nbsp;
                                        <animated-integer v-model="s1OrderNum" class="small-data-num"></animated-integer>
                                        &nbsp;&nbsp;单
                                    </div></li>
                                    <li><div class="small-data-text">
                                        已收货：&nbsp;
                                        <animated-integer v-model="s23OrderNum" class="small-data-num"></animated-integer>
                                        &nbsp;&nbsp;单
                                    </div></li>
                                </ul>
                            </el-col>
                            <el-col :span="4">
                                <div class="info-button">
                                    <router-link :to="$store.state.host + '/adminpannel/orders'" @click.native="$store.commit('selectPage', 'orders')">
                                        <el-button :href="$store.state.host + '/adminpannel/event'" plain icon="el-icon-arrow-right" >查看详情</el-button>
                                    </router-link>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import AnimatedInteger from './Animated_integer'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/pie'

export default {
    data() {
        return {
            cardStyle:{padding:'0px', 'min-height':'460px'},
            totalActivityNum: 0,
            goingActivityNum: 0,
            stopActivityNum: 0,
            soonActivityNum: 0,
            invaildActivityNum: 0,
            totalOrderNum: 0,
            s0OrderNum: 0,
            s1OrderNum: 0,
            s2OrderNum: 0,
            s3OrderNum: 0,
            s23OrderNum: 0,
            activityChartOption: {},
            orderChartOption: {},
        };
    },
    components:{
        AnimatedInteger,
        echarts
    },
    mounted(){
        this.$store.commit('setLoadingStatus', false);
        this.getBookNum()
        // this.initOptions()
        // this.drawCharts()
        window.addEventListener('resize', this.windowResizeHandler)
    },
    methods: {
        getBookNum(){
            this.$http.get(this.$store.state.host + '/adminpannel/pannel/amount',
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    if(this.util.sessionCheck(response.body['code']) && (response.body['code']===200)){
                        let totalAmount = response.body['info'];

                        this.invaildActivityNum = this.util.toValidNumber(totalAmount['invalid_activity'])
                        this.soonActivityNum = this.util.toValidNumber(totalAmount['soon_activity'])
                        this.goingActivityNum = this.util.toValidNumber(totalAmount['going_activity'])
                        this.stopActivityNum = this.util.toValidNumber(totalAmount['stop_activity'])

                        this.s0OrderNum = this.util.toValidNumber(totalAmount['invalid_orders'])
                        this.s1OrderNum = this.util.toValidNumber(totalAmount['valid_orders'])
                        this.s2OrderNum = this.util.toValidNumber(totalAmount['uncomment_orders'])
                        this.s3OrderNum = this.util.toValidNumber(totalAmount['commented_orders'])

                        this.totalActivityNum = this.invaildActivityNum + this.soonActivityNum + this.goingActivityNum + this.stopActivityNum;
                        this.totalOrderNum = this.s0OrderNum + this.s1OrderNum + this.s2OrderNum + this.s3OrderNum;
                        this.s23OrderNum = this.s2OrderNum + this.s3OrderNum;

                        this.initOptions()
                        this.drawCharts()
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler
            );
        },
        initOptions(){
            var data = [{
                    name: '未开始',
                    value: this.stopActivityNum,
                }, {
                    name: '进行中',
                    value: this.goingActivityNum,
                }, {
                    name: '已结束',
                    value: this.stopActivityNum,
                }
            ]
            this.activityChartOption = {
                //color: colors,
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}活动: <br/> {c} ({d}%)"
                },
                series: [{
                    type: 'pie',
                    color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f'],
                    selectedMode: 'single',
                    center: ['50%', '50%'],
                    data: data,
                }]
            };
            var data2 = [{
                    name: '待发货',
                    value: this.s0OrderNum,
                }, {
                    name: '待收货',
                    value: this.s1OrderNum,
                }, {
                    name: '待评价',
                    value: this.s2OrderNum,
                }, {
                    name: '已评价',
                    value: this.s3OrderNum,
                }
            ]
            console.log(data)
            console.log(data2)
            this.orderChartOption = {
                //color: colors,
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}订单: <br/> {c} ({d}%)"
                },
                series: [{
                    type: 'pie',
                    color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f'],
                    selectedMode: 'single',
                    center: ['50%', '50%'],
                    data: data2,
                }]
            };
        },
        drawCharts(){
            let activityChart = echarts.init(document.getElementById('activityChart'))
            activityChart.setOption(this.activityChartOption)
            activityChart.resize()
            let orderChart = echarts.init(document.getElementById('orderChart'))
            orderChart.setOption(this.orderChartOption)
            orderChart.resize()
        },
        windowResizeHandler(){
            this.drawCharts()
        }
    }
}
</script>

<style scoped>
/* ul {
    list-style: none;
}
li {
    background-color: aquamarine;
    border: 1px solid white;
} */
.container{
    padding: 20px;
}

.welcome-text{
    font-size: xx-large;
    font-weight: normal;
    text-align: center; 
    margin: 40px;
}

.data-text{
    font-size: x-large;
    font-weight: lighter;
}

.small-data-text{
    padding-top: 5px;
    font-size: medium;
    font-weight: lighter;
}

.data-num{
    color: #2971ffa6;
    font-size: xx-large;
    font-weight: normal;
}

.small-data-num{
    color: #3e388dcc;;
    font-size: large;
    font-weight: normal;
}

.data-ul{
    color: #002974d8;
    margin: 0;
    padding-left: 20px;
}

.data-container{
    color: #2b75ff;
    position: relative;
    text-align: left;
    min-height: 150px; 
    margin: 0 0 20px 50px;
}

.image-container{
    height: 400px;
}

.box-card{
    text-align: center; 
    cursor: pointer;
    box-shadow: 0 0 16px #d3d3d3;
    transition: all .1s ease-in;
}

.box-card:hover{
    box-shadow: 0 0 16px #beecff;
    transition: all .1s ease-in;
}

.info-button{
    position: absolute;
    right: 30px;
    bottom: 0px;
}

.charts{
    height: 500px;
}
</style>
