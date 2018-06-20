<template>
    <div class="container">

        <div class="upper-tools">
            <span class="tools-unit">
                <el-button type="success" icon="el-icon-refresh" @click.native="refreshPage" circle></el-button>
            </span>
            <span class="tools-unit">
                <el-button type="primary" icon="el-icon-plus" @click.native="addLottery" circle></el-button>
            </span>
            <span style="width:40%;"></span>
        </div>

        <div class="fliter-wrapper">
                <span >活动状态：</span>
                <span class="tools-unit">
                    <el-button type="warning" icon="el-icon-search" @click.native="handleFliterChange(0)">未开始</el-button>
                </span>
                <span class="tools-unit">
                    <el-button type="success" icon="el-icon-search" @click.native="handleFliterChange(1)">进行中</el-button>
                </span>
                <span class="tools-unit">
                    <el-button type="info" icon="el-icon-search" @click.native="handleFliterChange(2)">已结束</el-button>
                </span>
                <span class="tools-unit">
                    <el-button type="danger" icon="el-icon-search" @click.native="handleFliterChange(-1)">不合法</el-button>
                </span>
                <span class="tools-unit">
                    <el-button type="primary" icon="el-icon-close" @click.native="handleFliterChange(-2)">取消筛选</el-button>
                </span>
        </div>

        <div class="new-lottery-form-wrapper">
            <new-lottery-dialog
                v-show="showNewLotteryForm"
                @hide="givpUpAdd"
                @refreshPage="refreshPage"
                :visiable="showNewLotteryForm">
            </new-lottery-dialog>
        </div>

        <div class="table-wrapper">
            <el-table
                :data="lotteries"
                border
                stripe
                tooltip-effect="dark"
                style="width: 100%;"
                max-height="600">
                <el-table-column
                    label="活动标题"
                    prop="title"
                    header-align="center"
                    align="center"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    label="奖品描述"
                    prop="rewards_info.title"
                    header-align="center"
                    align="center"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    label="消耗积分"
                    prop="credits_need"
                    header-align="center"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    label="剩余数量"
                    prop="book_num"
                    header-align="center"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="状态"
                    prop="state"
                    width="100"
                    align="center"
                    header-align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state === 0? 'warning': (
                                        scope.row.state === 1? 'success': (
                                        scope.row.state === 2? 'info': 
                                        'error'))">
                            {{scope.row.stateName}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="开始时间"
                    prop="start_time"
                    header-align="center"
                    align="center"
                    width="220">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.start_time"
                            type="datetime"
                            placeholder="选择起始日期时间"
                            :disabled="!scope.row.isEditing"
                            :clearable="false"
                            :editable="false"
                            :prefix-icon="scope.row.isEditing? 'el-icon-edit': 'el-icon-date'"
                            style="width:100%;">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                    label="结束时间"
                    prop="end_time"
                    header-align="center"
                    align="center"
                    width="220">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.end_time"
                            type="datetime"
                            placeholder="选择结束日期时间"
                            :disabled="!scope.row.isEditing"
                            :clearable="false"
                            :editable="false"
                            :prefix-icon="scope.row.isEditing? 'el-icon-edit': 'el-icon-date'"
                            style="width:100%;">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                    label="活动描述"
                    prop="introduction"
                    min-width="120"
                    header-align="center">
                </el-table-column>
                <el-table-column
                    label="操作"
                    prop="introduction"
                    header-align="center"
                    align="center"
                    fixed="right"
                    width="120">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            <template v-if="scope.row.state === 2 && !scope.row.open">
                                <el-button type="primary" icon="el-icon-check" @click.native="checkLottery(scope.row)">开奖</el-button>
                            </template>
                            <template v-else>
                                <el-button type="warning" icon="el-icon-edit" @click.native="editLottery(scope.row)" circle></el-button>
                                <el-button type="danger" icon="el-icon-delete" @click.native="deleteLottery(scope.row)" circle></el-button>
                            </template>
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-button type="primary" icon="el-icon-check" @click.native="saveLottery(scope.row)" circle></el-button>
                            <el-button type="danger" icon="el-icon-close" @click.native="recoverLottery(scope.row)" circle></el-button>
                        </span>
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
                :current-page.sync="pageNo"
                :page-size="pageSize"
                :page-sizes="[10, 15, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="lotteryAmount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import newLotteryDialog from './Event_lottery_new_dialog.vue';

export default {
    data () {
        return {
            // TODO: 书籍的展示由书籍id改为书籍信息
            loading: false,
            loadingText: "玩命加载中",
            lotteryAmount: 0,
            maxPage: 0,
            pageNo: 1,
            pageSize: 10,
            fliterStr: '',
            showNewLotteryForm: false,
            multipleSelection: [],
            st: 0,
            ed: 0,
            editing: -1,
            lotteries: [],
        }
    },
    components: {
        newLotteryDialog
    },
    mounted() {
        this.refreshPage();
    },
    watch: {
        isEditing: function(val) {
            if(val){
                this.$store.commit('setEditStatus', true);
            }
            else{
                this.$store.commit('setEditStatus', false);
            }
        }
    },
    computed: {
        isEditing() {
            return this.editing !== -1;
        }
    },
    methods: {
        refreshPage() {
            this.getLotteryAmount();
            this.maxPage = Math.ceil(this.lotteryAmount/this.pageSize);
            this.getLotteryByPage(this.pageNo);
        },
        handleSizeChange(value) {
            this.pageNo = 1;
            this.pageSize = value;
            this.refreshPage();
        },
        handleCurrentChange(value) {
            this.pageNo = value;
            this.refreshPage();
        },
        handleFliterChange(value) {
            switch(value) {
                case 0: this.fliterStr = '/soon'; break;
                case 1: this.fliterStr = '/going'; break;
                case 2: this.fliterStr = '/stopped'; break;
                case -1: this.fliterStr = '/invalid'; break;
                case -2: this.fliterStr = ''; break;
            }
            this.handleCurrentChange(1);
        },
        modifiedLottery(row) {
            row['isEditing'] = false;
            row['id'] = this.util.toValidNumber(row['id']);
            row['credits_need'] = this.util.toValidNumber(row['credits_need']);
            row['book_num'] = this.util.toValidNumber(row.rewards_info['booknum']);
            row['book_id'] = this.util.toValidNumber(row.rewards_info['bookid']);
            row['start_time'] = this.util.toValidNumber(row['start_time'])*1000;
            row['end_time'] = this.util.toValidNumber(row['end_time'])*1000;
            row['open'] = (this.util.toValidNumber(row['state']) === 1 );
            row['state'] = this.util.toValidNumber(row['state_detail']);
            switch(row['state']) {
                case 0: row['stateName'] = '未开始'; break;
                case 1: row['stateName'] = '进行中'; break;
                case 2: row['stateName'] = '已结束'; break;
                default: row['stateName'] = '不合法'; break;
            }
            return row;
        },
        addLottery() {
            if(this.isEditing) {
                this.$message.error('请先完成当前进行中的修改');
                return;
            }
            this.showNewLotteryForm = true;
        },
        givpUpAdd() {
            this.showNewLotteryForm = false;
        },
        editLottery(row) {
            if(this.isEditing) {
                this.$message.error('请先完成当前进行中的修改');
                return;
            }
            this.editing = row.id;
            this.st = row.start_time;
            this.ed = row.end_time;
            row.isEditing = true;
        },
        saveLottery(row) {
            if(row.start_time >= row.end_time) {
                this.$message.error('结束时间应当比开始时间晚');
                return;
            }
            var st = this.st === row.start_time? -1: row.start_time/1000;
            var ed = this.ed === row.end_time? -1: row.end_time/1000;
            this.putLotteryTimeChange(row.id, st, ed);
            this.editing = -1;
            row.isEditing = false;
            this.refreshPage();
        },
        recoverLottery(row) {
            row.start_time = this.st;
            row.end_time = this.ed;
            this.ed = 0;
            this.st = 0;
            this.editing = -1;
            row.isEditing = false;
        },
        deleteLottery(row) {
            if(this.isEditing) {
                this.$message.error('请先完成当前进行中的修改');
                return;
            }
            this.removeLottery(row.id);
        },
        getLotteryAmount() {
            this.$http.get(
                this.$store.state.host + '/adminpannel/lottery' + this.fliterStr + '/amount',
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.lotteryAmount = this.util.toValidNumber(response.body['info']);
                    }
                    else{
                        this.util.returnFailHandler();
                    }
                }, this.util.returnFailHandler
            );
        },
        putLotteryTimeChange(id, st, ed) {
            if(st !== -1) {
                this.$http.put(this.$store.state.host + '/adminpannel/activities/endtime/'+id+'/'+st,
                    {start_time: st},
                    {emulateJSON: true}
                ).then(response =>{
                        // success callback
                        var code = response.body['code'];
                        if(!this.util.sessionCheck(this, code)) {
                            return; 
                        }
                        switch(code) {
                            case 404: this.$message.error('非法的活动id'); break;
                            case 405: this.$message.error('无效或不存在的活动'); break;
                            case 437: this.$message.error('开始时间不应比当前时间早，也不能比结束时间晚'); break;
                            case 200: {
                                this.$message.success('修改开始时间成功!');
                            } break;
                            default: this.util.returnFailHandler(response);
                        } 
                    }, this.util.returnFailHandler
                );
            }
            if(ed !== -1) {
                this.$http.put(this.$store.state.host + '/adminpannel/activities/endtime/'+id+'/'+ed,
                    {end_time: ed},
                    {emulateJSON: true}
                ).then(response =>{
                        // success callback
                        var code = response.body['code'];
                        if(!this.util.sessionCheck(this, code)) {
                            return; 
                        }
                        switch(code) {
                            case 404: this.$message.error('非法的活动id'); break;
                            case 405: this.$message.error('无效或不存在的活动'); break;
                            case 437: this.$message.error('结束时间不应比当前时间或开始时间晚'); break;
                            case 200: {
                                this.$message.success('修改结束时间成功!');
                            } break;
                            default: this.util.returnFailHandler(response);
                        } 
                    }, this.util.returnFailHandler
                );
            }
        },
        checkLottery(row){
            this.$http.get(this.$store.state.host + '/adminpannel/lottery/getById/' + row.id,
                {emulateJSON: true}
            ).then(response => {
                    // success callback，加载整页书籍
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.$message.success('开奖!')
                        this.refreshPage()
                    }
                    else{
                        this.util.returnFailHandler();
                    }
            }, this.util.returnFailHandler
            );
        },
        getLotteryByPage(page) {
            this.$http.get(this.$store.state.host + '/adminpannel/lottery' + this.fliterStr + '/' + page + '/' + this.pageSize,
                {emulateJSON: true}
            ).then(response => {
                    // success callback，加载整页书籍
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.lotteries = [];
                        var lotteriesGet = response.body['info'];
                        lotteriesGet.forEach((lottery) => {
                            this.lotteries.push(this.modifiedLottery(lottery));
                        });
                    }
                    else{
                        this.util.returnFailHandler();
                    }
            }, this.util.returnFailHandler
            );
        },
        removeLottery(id) {
            this.$http.delete(this.$store.state.host + '/adminpannel/Lottery/' + id, 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.$message.success('删除成功');
                        this.refreshPage(); 
                    }
                    else{
                        this.util.returnFailHandler();
                    }
                }, this.util.returnFailHandler
            );
        }
    }
}
</script>

<style scoped>

.container {
    background-color: #aaccffaa;
    padding: 20px;
}

.table-wrapper {
    background-color: lightcyan;
    padding: 10px;
    min-width: 600px;
    width: auto;
}

.fliter-wrapper {
    background-color: white;
    border-radius: 4px;
    min-height: 40px;
    padding: 15px 20px;
    margin: 10px 0;
}

.inline-tools {
    position: relative;
    padding-left: 180px;
}

.upper-tools {
    margin-bottom: 20px;
    padding-top: auto;
}

.tools-unit {
    text-align: center;
    margin-right: 10px;
}

.bottom-pagination {
    margin-top: 20px;
    text-align: center;
}

.short {
    background-color: lightpink;
    color: red;
}

.table-expand {
    font-size: 0;
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

.book-brief {
    font-size: 13px;
    color: #999;
}


</style>
