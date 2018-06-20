<template>
    <div class="container">
        
        <div class="upper-tools">
            <!-- <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <span class="tools-unit">
                        </span>
                    </div>
                </el-col>
            </el-row> -->

            <div class="grid-content bg-white">
                <el-row class="row-margin">
                    <el-col :span="24" >
                        <div>
                            <span >订单状态：</span>
                            <el-checkbox v-model="status_0_checked" label="待发货" border></el-checkbox>
                            <el-checkbox v-model="status_1_checked" label="待收货" border></el-checkbox>
                            <el-checkbox v-model="status_2_checked" label="待评价" border></el-checkbox>
                            <el-checkbox v-model="status_3_checked" label="已评价" border></el-checkbox>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="row-margin">
                    <el-col :span="24" >
                        <div>
                            <span >排序方式：</span>
                            <el-select v-model="keyword" clearable placeholder="选择排序关键字">
                                <el-option
                                    v-for="item in keywords"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.label }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="row-margin">
                    <el-col :span="24" >
                        <el-button type="warning" icon="el-icon-refresh" @click.native="refreshPage">刷新页面</el-button>
                        <el-button v-if="!exporting" type="info" icon="el-icon-document" @click.native="exportData">导出订单</el-button>
                        <el-button v-else type="info" disabled icon="el-icon-loading" >正在导出..</el-button>
                        <el-button type="primary" icon="el-icon-search" @click.native="getOrders">筛选订单</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
        
        <div class="table-wrapper">
            <el-table
                border
                stripe
                :data="orders"
                tooltip-effect="dark"
                style="width:100%"
                max-height="600">
                <el-table-column type="expand" label="更多信息" fixed="left" width="100">
                    <template slot-scope="scope">
                        <el-form  label-position="left" inline class="demo-table-expand">
                            <el-form-item label="订单 ID：">
                                <span>{{ scope.row.order_id }}</span>
                            </el-form-item>
                            <el-form-item label="微信 ID：">
                                <span>{{ scope.row.wx_id }}</span>
                            </el-form-item>
                            <template v-if="scope.row.hasOwnProperty('book_info')">
                                <el-form-item label="书名：">
                                    <span>{{ scope.row.book_info.name }}</span>
                                </el-form-item>
                                <!-- <el-form-item label="书籍剩余量：">
                                    <span>{{ scope.row.book_info.left }}</span>
                                </el-form-item> -->
                            </template>
                            <template v-else-if="scope.row.hasOwnProperty('reward_info')">
                                <el-form-item label="奖品标题：">
                                    <span>{{ scope.row.reward_info.rewards_title }}</span>
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item label="奖品标题：">
                                    <span>奖品已删除</span>
                                </el-form-item>
                            </template>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单时间"
                    align="center"
                    header-align="center">
                    <template slot-scope="scope">
                        {{new Date(scope.row.time* 1000).toLocaleString()}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单类别"
                    align="center"
                    header-align="center">
                    <template slot-scope="scope">
                        {{scope.row.hasOwnProperty('reward_id')? '活动奖品':'积分兑换'}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="收货地址"
                    prop="address"
                    align="center"
                    header-align="center">
                </el-table-column>
                <el-table-column
                    label="订单内容"
                    align="center"
                    header-align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.hasOwnProperty('book_info') ? 'primary' : 'success'" >
                            {{rewards_back_switcher(scope.row)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="运单号"
                    align="center"
                    header-align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.hasOwnProperty('tracking_number')" style="color: #8492a6; font-size: 13px">未填写订单号</span>
                        <span v-else>{{scope.row.tracking_number}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单状态"
                    align="center"
                    header-align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state > 1 ? 'primary' : (scope.row.state == 0 ? 'info' :'success')" >
                            {{order_state_switcher(scope.row.state)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="180"
                    header-align="center">
                    <template slot-scope="scope">
                        <el-button  type="primary" 
                                    :disabled="scope.row.state > 0" 
                                    :icon="scope.row.state > 0 ? 'el-icon-sold-out' : 'el-icon-edit' " 
                                    @click.native="openForm(scope.row)">
                                    {{scope.row.state > 0 ? '发货':'发货'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="bottom-pagination">
            <el-pagination
                fixed
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="index"
                :page-size="pageSize"
                :page-sizes="[10, 15, 25]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="orderAmount">
            </el-pagination>
        </div>

        <el-dialog title="发货" v-if="dialogFormVisible" :visible.sync="dialogFormVisible">
            <el-form :model="shipping_order" label-position="left" label-width="100px" >
                <el-form-item label="订单号：" >
                    <span>{{shipping_order.order_id}}</span>
                </el-form-item>
                <el-form-item label="发送地址：">
                    <span>{{shipping_order.address}}</span>
                </el-form-item>
                <el-form-item label="发送奖品：">
                    <span>{{rewards_back_switcher (shipping_order)}}</span>
                </el-form-item>
                <el-form-item label="运单号：">
                    <el-input v-model="shipping_order.tracking_number" placeholder="请输入运单号（非实物订单可忽略）"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="shipOrder(shipping_order)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            index: 1,
            pageSize: 10,
            orderAmount: 0,

            orders: [],
            status_0_checked:true,
            status_1_checked:true,
            status_2_checked:true,
            status_3_checked:true,
            dialogFormVisible: false,
            filterChanged:false,
            exporting: false,
            shipping_order: {},
            keyword: '',
            
            keywords: [{
                value: 'time',
                label: '订单时间'
            },{
                value: 'address',
                label: '收货地址'
            },{
                value: 'state',
                label: '订单状态'
            },{
                value: 'wx_id',
                label: '微信 ID'
            },{
                value: 'order_id',
                label: '订单号'
            }
            ]
        }
    },
    watch: {
        status_0_checked: function(){
            this.filterChanged = true
        },
        status_1_checked: function(){
            this.filterChanged = true
        },
        status_2_checked: function(){
            this.filterChanged = true
        },
        status_3_checked: function(){
            this.filterChanged = true
        },
        keyword: function(){
            this.filterChanged = true
        },
        filterChanged: function (val) {
            if (val) {
                this.filterChanged = false
                this.index = 1
                //this.getOrders()
            }
        },
    },
    mounted () {
        this.refreshPage()
    },
    methods: {
        getOrderAmount () {
            let info = {
                state_0: this.status_0_checked ? 1 : 0,
                state_1: this.status_1_checked ? 1 : 0,
                state_2: this.status_2_checked ? 1 : 0,
                state_3: this.status_3_checked ? 1 : 0,
                pagesize: 0,
                index: 0
            }
            this.$http.post(this.$store.state.host + '/adminpannel/Orders', info, 
                {emulateJSON: true}
            ).then(response =>{
                // success callback
                if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                    this.orderAmount = this.util.toValidNumber(response.body['info'])
                }
                else{
                    this.$message.error('获取订单总数失败')
                }
            }, this.util.returnFailHandler
            );
        },
        modifiedOrder(order) {
            if(order.hasOwnProperty('name')){
                order['book_info'] = {
                    id: order['book_id'],
                    ISBN: order['ISBN'],
                    name: order['name'],
                    left: order['left'],
                }
            }
            return order;
        },
        getOrders () {
            this.getOrderAmount()
            let info = {
                state_0: this.status_0_checked ? 1 : 0,
                state_1: this.status_1_checked ? 1 : 0,
                state_2: this.status_2_checked ? 1 : 0,
                state_3: this.status_3_checked ? 1 : 0,
                order_by: this.keyword,
                pagesize: this.pageSize,
                index: this.index
            }
            this.$http.post(this.$store.state.host + '/adminpannel/Orders', info, 
                {emulateJSON: true}
            ).then(response =>{
                // success callback
                if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                    this.$message({
                        message: '获取订单信息成功',
                        type: 'success'
                    })
                    this.orders = response.body['info']
                }
                else{
                    this.$message.error('未知错误，请联系系统管理员')
                }
            },this.util.returnFailHandler
            );
        },
        refreshPage() {
            this.status_0_checked = true
            this.status_1_checked = true
            this.status_2_checked = true
            this.status_3_checked = true
            this.dialogFormVisible = false
            this.keyword = ''
            this.shipping_order = {}
            this.getOrders()
        },
        openForm (order) {
            this.dialogFormVisible = true
            this.shipping_order = order
        },
        shipOrder (shipping_order) {
            let info={
                order_id: shipping_order.id,
                tracking_number: shipping_order.tracking_number
            }
            this.$http.post(this.$store.state.host + '/adminpannel/Orders/complete', info, 
                {emulateJSON: true}
            ).then(response =>{
                // success callback
                if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                    this.shipping_order.tracking_number = ''
                    this.dialogFormVisible = false
                    this.$message({
                        message: '发货成功',
                        type: 'success'
                    })
                    this.getOrders()
                    // orders.forEach( order => {
                    //     if (order.id == shipping_order.id){
                    //         order.state++
                    //         order.tracking_number = shipping_order.tracking_number
                    //         return
                    //     }
                    // })
                }
                else if(response.body['code'] === 429){
                    this.$message({
                        message: '该订单需要填写运单号，或该订单奖品已被删除',
                        type: 'warning'
                    })
                }
                else{
                    this.$message.error('未知错误，请联系系统管理员')
                }
            }, this.util.returnFailHandler
            );
        },
        order_state_switcher (state) {
            switch(state){
                case 0:
                return '待发货'
                case 1:
                return '待收货'
                case 2:
                return '待评价'
                case 3:
                return '已评价'
            }
        },
        rewards_type_switcher (rewards_type){
            switch(rewards_type){
                case "0":
                return '书籍'
                case "1":
                return '奖品'
                case "2":
                return '积分'
            }
        },
        rewards_back_switcher (order) {
            if(order.hasOwnProperty('reward_info')){
                switch(order.reward_info.rewards_type){
                    case "1":
                    return '奖品：' + order.reward_info.rewards_back
                    case "2":
                    return '积分：' + order.reward_info.rewards_back
                    case "0":
                    return '书籍：《' + order.reward_info.book_info.name + '》'
                    default :
                    return ''
                }
            }else if(order.hasOwnProperty('reward_id')){
                return '奖品已删除'
            }
            return '书籍：《' + order.book_info.name + '》'
        },
        handleSizeChange(value) {
            this.pageSize = value
            this.getOrders()
        },
        handleCurrentChange(value) {
            this.getOrders()
        },
        exportData () {
            let info = {
                state_0: this.status_0_checked ? 1 : 0,
                state_1: this.status_1_checked ? 1 : 0,
                state_2: this.status_2_checked ? 1 : 0,
                state_3: this.status_3_checked ? 1 : 0,
            }
            this.$http.post(this.$store.state.host + '/adminpannel/Orders/getAll', info, 
                {emulateJSON: true}
            ).then(response =>{
                // success callback
                if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                    this.exporting = true 
                    let allOrders = response.body['info']
                    this.$notify({
                        title: '获取订单信息成功',
                        message: '正在导出，请耐心等待...',
                        type: 'success'
                    });
                    this.json2csv(allOrders)
                }
                else{
                    this.$message.error('获取订单信息失败，请联系系统管理员')
                }
            },this.util.returnFailHandler
            );
        },
        json2csv (orders) {
            let csvContent = 'data:text/csv;charset=utf-8,\ufeff'
            //id,order_id,price,time,state,address,tracking_number,NEW_PROPS,rewards_title,rewards_type,rewards_back,book_id,book_isbn,book_name
            let label = ['id','订单号','消耗积分','时间','订单状态','收货地址','运单号','订单类别','奖品标题','奖品类型','奖品信息','书籍id','书籍ISBN','书籍名']
            let labelString = label.join(',')
            csvContent += labelString + '\n'
            // console.log(csvContent)
            orders.forEach(item => {
                let datastring = ''
                datastring += item.id + ','
                datastring += item.order_id + ','
                datastring += item.price + ','
                datastring += new Date(item.time* 1000).toLocaleString() + ','
                datastring += this.order_state_switcher(item.state) + ','
                datastring += '"' + item.address.replace(/"/g,'""') + '",'
                if(item.hasOwnProperty('tracking_number') && item.tracking_number != null ){
                    datastring += '"' + item.tracking_number.replace(/"/g,'""') + '",'
                }
                else{
                    datastring += ','
                }
                if(item.hasOwnProperty('reward_id') && item.reward_id != -1 ){
                    datastring += '活动奖品,'
                    if(item.reward_info.rewards_title == null){
                        datastring += ','
                    }
                    else{
                        datastring += '"' + item.reward_info.rewards_title.replace(/"/g,'""') + '",'
                    }
                    datastring += this.rewards_type_switcher(item.reward_info.rewards_type) + ','
                    datastring += '"' + this.rewards_back_switcher(item).replace(/"/g,'""') + '",'
                }
                else if(!item.hasOwnProperty('reward_id')){
                    datastring += '积分兑换,,,,'
                }
                else{
                    datastring += '活动奖品,奖品已删除,,,'
                }
                if(item.hasOwnProperty('book_info')){
                    datastring += item.book_info.id + ','
                    datastring += '"' + item.book_info.ISBN.replace(/"/g,'""') + '",'
                    datastring += '"' + item.book_info.name.replace(/"/g,'""') + '"'
                }
                else if((item.hasOwnProperty('reward_info') && item.reward_info.hasOwnProperty('book_info'))){
                    if(item.reward_info.book_info.id===0){
                        datastring += '书籍已删除,书籍已删除,书籍已删除'
                    }
                    else{
                        datastring += item.reward_info.book_info.id + ','
                        datastring += '"' + item.reward_info.book_info.ISBN.replace(/"/g,'""') + '",'
                        datastring += '"' + item.reward_info.book_info.name.replace(/"/g,'""') + '"'
                    }
                }
                else{
                    datastring += ',,'
                }
                csvContent += datastring + '\n'
                // console.log(datastring)
            });
            this.exporting = false
            console.log('exporting..')
            // this.$refs.exportLink.setAttribute('href', encodeURI(csvContent));
            // this.$refs.exportLink.setAttribute('download', 'data.csv');
            var downloadLink = document.createElement('a');
            var url = encodeURI(csvContent);
            downloadLink.href = url;
            downloadLink.download = 'data.csv';
            downloadLink.click();
            window.URL.revokeObjectURL(url);
        }
    }
}
</script>

<style scoped>

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.el-form-item__label {
    color: #99a9bf;
}

.container {
    background-color: #aaccffaa;
    padding: 20px;
}

.table-expand {
    font-size: 0;
}

.bg-white {
    background: white;
}

.grid-content {
    border-radius: 4px;
    min-height: 40px;
    padding:5px 20px;
    margin: 10px 0;
}

.row-margin{
    margin: 1em;
}

.table-expand label {
    width: 90px;
    color: #99a9bf;
}

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 60%;
    padding-left: 80px;
    text-align: left;
}

.table-wrapper {
    background-color: lightcyan;
    padding: 10px;
    width: auto;
}

.upper-tools {
    margin-bottom: 20px;
    padding-top: auto;
}

.tools-unit {
    text-align: center;
    vertical-align: middle;
}

.bottom-pagination {
    margin-top: 20px;
    text-align: center;
}

</style>
