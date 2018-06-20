<template>
    <div class="container">
        <book-picker v-show="bookPickerDialogVisible" :visiable="bookPickerDialogVisible" @selectBook="handleBookPicker" @hide="bookPickerDialogVisible = false"></book-picker>
        <el-dialog 
            width="800px" 
            size="mini"
            title="新的奖品" 
            :visible.sync="newRewardDialogVisible"
            :before-close="handleDialogClose"
            :modal-append-to-body="false">
            <el-form ref="rewardForm" :model="newReward" :rules="rules" size="small" label-width="200px" :label-position="'right'" status-icon >
                <el-form-item label="奖品名称：" prop="title">
                    <el-input v-model="newReward.title" placeholder="奖品名称"></el-input>
                </el-form-item>
                <el-form-item label="奖品类别：" prop="category">
                    <el-select  v-model="newReward.category" placeholder="奖品类别">
                        <el-option
                            v-for="item in rewardType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中奖权重：" prop="percent">
                    <el-input v-model="newReward.percent" placeholder="中奖率"></el-input>
                </el-form-item>
                <el-form-item label="奖品总数：" prop="amount">
                    <el-input v-model="newReward.amount" placeholder="奖品总数"></el-input>
                </el-form-item>
                <el-form-item  v-if="newReward.category === 0"  prop="name" label="书籍名称：">
                    <el-input v-model="newReward.name" disabled placeholder="书籍名称" class="input-with-select">
                        <el-button slot="append" icon="el-icon-edit" @click="bookPickerDialogVisible = true"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item  v-else-if="newReward.category === 1"  prop="text" label="兑换码：">
                    <el-input v-model="newReward.text" placeholder="优惠券兑换码"></el-input>
                </el-form-item>
                <el-form-item  v-else-if="newReward.category === 2"  prop="credit" label="积分数量：">
                    <el-input v-model="newReward.credit" placeholder="积分数量"></el-input>
                </el-form-item>
                <el-form-item  v-else label="提示信息：">
                    <el-input v-model="newReward.text" placeholder="用户中奖后看到的信息"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="handleDialogClose(()=>{})">取 消</el-button>
                <el-button type="primary" @click="saveReward">确 定</el-button>
            </div>
        </el-dialog>

        <div class="upper-tools">
            <span class="tools-unit">
                <el-button type="success" icon="el-icon-refresh" @click.native="refreshPage" circle></el-button>
            </span>
            <span class="tools-unit">
                <el-button type="primary" icon="el-icon-plus" @click.native="addRound" circle></el-button>
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

        <div class="new-round-form-wrapper">
            <new-round-dialog
                v-show="showNewRoundForm"
                @hide="giveUpRoundAdd"
                @refreshPage="refreshPage"
                :visiable="showNewRoundForm">
            </new-round-dialog>
        </div>

        <div class="table-wrapper">
            <el-table
                :data="rounds"
                border
                stripe
                tooltip-effect="dark"
                style="width: 100%;"
                max-height="600">
                <el-table-column 
                    label="更多操作" 
                    type="expand" 
                    width="100" 
                    fixed="left">
                    <template slot-scope="scope">
                        <div class="grid-content bg-grey">
                            <div style="padding:10px 0;">
                                <el-row :gutter="20">
                                    <el-col style="padding:1em;font-size: x-large;" :span="22" :offset="2">奖品信息：</el-col>
                                </el-row>
                            </div>
                            <el-row v-for="reward in scope.row.rewards" :key="reward.id">
                                <el-col :span="22" :offset="2">
                                    <el-form ref="rewardsForm" :inline="true" :model="reward" :rules="rules" class="demo-form-inline" size="small" >
                                        <el-form-item label="奖品名称：" prop="title">
                                            <el-input disabled v-model="reward.title" placeholder="奖品名称"></el-input>
                                        </el-form-item>
                                        <el-form-item label="奖品类别：" prop="category">
                                            <el-select disabled style="width:120px" v-model="reward.category" placeholder="奖品类别">
                                                <el-option
                                                    v-for="item in rewardType"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="中奖权重：" prop="percent">
                                            <el-input style="width:60px" v-model="reward.percent" disabled placeholder="中奖率"></el-input>
                                        </el-form-item>
                                        <el-form-item label="奖品总数：" prop="amount">
                                            <el-input style="width:80px" v-model="reward.amount" disabled placeholder="奖品总数"></el-input>
                                        </el-form-item>
                                        <el-form-item label-width="100px" v-if="reward.category === 0"  prop="name" label="书籍名称：">
                                            <el-input v-model="reward.name" disabled placeholder="书籍名称"></el-input>
                                        </el-form-item>
                                        <el-form-item label-width="100px" v-else-if="reward.category === 1"  prop="text" label="兑换码：">
                                            <el-input v-model="reward.text" disabled placeholder="优惠券兑换码"></el-input>
                                        </el-form-item>
                                        <el-form-item label-width="100px" v-else-if="reward.category === 2"  prop="credit" label="积分数量：">
                                            <el-input v-model="reward.credit" disabled placeholder="积分数量"></el-input>
                                        </el-form-item>
                                        <el-form-item label-width="100px" v-else label="提示信息：">
                                            <el-input v-model="reward.text" disabled placeholder="用户中奖后看到的信息"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <span>
                                                <el-button type="warning" icon="el-icon-edit" @click.native="editReward(reward, scope.row)" circle></el-button>
                                                <el-button type="danger" icon="el-icon-delete" @click.native="deleteReward(reward)" circle></el-button>
                                            </span>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-row>
                            <el-row v-if="scope.row.rewards.length < 8">
                                <el-col :span="22" :offset="2">
                                    <div style="padding:1em">
                                        <el-button type="primary" icon="el-icon-plus" @click.native="addNewReward(scope.row)" circle></el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="活动标题"
                    prop="title"
                    header-align="center"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column 
                    label="消耗积分"
                    prop="cost"
                    align="center"
                    width="100"
                    header-align="center">
                </el-table-column>
                <el-table-column
                    label="可抽次数"
                    prop="times"
                    header-align="center"
                    align="center"
                    width="100">
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
                            :clearable="false"
                            :editable="false"
                            :prefix-icon="scope.row.isEditing? 'el-icon-edit': 'el-icon-date'"
                            :disabled="!scope.row.isEditing"
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
                    label="简要描述"
                    prop="brief"
                    header-align="center"
                    align="left"
                    min-width="200">
                </el-table-column>
                <el-table-column
                    label="详细描述"
                    prop="details"
                    header-align="center"
                    align="left"
                    min-width="200">
                </el-table-column>
                <el-table-column
                    label="操作"
                    header-align="center"
                    align="center"
                    fixed="right"
                    width="120">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            <el-button type="warning" icon="el-icon-edit" @click.native="editRound(scope.row)" circle></el-button>
                            <el-button type="danger" icon="el-icon-delete" @click.native="deleteRound(scope.row)" circle></el-button>
                        </span>
                        <span v-else>
                            <el-button type="primary" icon="el-icon-check" @click.native="saveRound(scope.row)" circle></el-button>
                            <el-button type="danger" icon="el-icon-close" @click.native="recoverRound(scope.row)" circle></el-button>
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
                :total="roundAmount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import newRoundDialog from './Event_round_new_dialog.vue';
import bookPicker from './Book_picker.vue'

let tempId = 100000000

export default {
    data () {
        var validateNum = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入合法的正整数'));
            } else if(result === 'error' || result < 0) {
                callback(new Error('请输入合法的非负整数'));
            } else{
                callback();
            }
        };
        var validatePercent = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入中奖权重'));
            } else if(result === 'error' || result > 100) {
                callback(new Error('请输入合法的0~100间的整数'));
            } else{
                callback();
            }
        };
        return {
            loading: false,
            loadingText: "玩命加载中",
            roundAmount: 0,
            maxPage: 0,
            pageNo: 1,
            pageSize: 10,
            fliterStr: '',
            editingRowId: 0,
            showNewRoundForm: false,
            newRewardDialogVisible: false,
            bookPickerDialogVisible: false,
            selectedBook: null,
            multipleSelection: [],
            newRound: {},
            tempReward: {},
            newReward: {},
            rounds: [],
            rewardType: [{
                value: 0,
                label: '书籍'
            },{
                value: 1,
                label: '优惠券'
            },{
                value: 2,
                label: '积分'
            },{
                value: 3,
                label: '实物奖品'
            },
            ],
            isEditing: false,
            rules: {
                title: [{ required: true,min: 1, message: '请输入奖品名称', trigger: 'blur' }],
                category: [{ required: true, message: '请选择奖品类型', trigger: 'blur' }],
                percent: [{ required: true, validator: validatePercent, trigger: 'blur'}],
                amount: [{ required: true, validator: validateNum, message: '请输入奖品总数', trigger: 'blur' }],
                name: [{ required: true, message: '请选择书籍', trigger: 'blur' }],
                text: [{ required: true, message: '请输入优惠券兑换码', trigger: 'blur' }],
                credit: [{ required: true, validator: validateNum, trigger: 'blur' }]
            }
        }
    },
    components: {
        newRoundDialog,
        bookPicker
    },
    mounted() {
        this.refreshPage();
        this.$store.commit('setLoadingStatus', false);
    },
    computed: {
        
    },
    methods: {
        refreshPage() {
            this.getRoundAmount();
            this.maxPage = Math.ceil(this.roundAmount/this.pageSize);
            this.getRoundByPage(this.pageNo);
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
        handleBookPicker(book){
            this.selectedBook = book;
            this.newReward.name = book['name'];
            this.newReward['book_id'] = book['id'];
            this.bookPickerDialogVisible = false;
        },
        handleDialogClose(done) {
            this.$confirm(
                '确认关闭？'
            ).then(
                _ => {
                    done();
                    this.giveUpAdd();
                }
            ).catch(
                _ => {

                }
            );
        },
        modifiedRound(row) {
            row['isEditing'] = false;
            row['id'] = this.util.toValidNumber(row['id']);
            row['cost'] = this.util.toValidNumber(row['cost']);
            row['times'] = this.util.toValidNumber(row['times']);
            row['start_time'] = this.util.toValidNumber(row['start_time'])*1000;
            row['end_time'] = this.util.toValidNumber(row['end_time'])*1000;
            row['state'] = this.util.toValidNumber(row['state']);
            switch(row['state']) {
                case 0: row['stateName'] = '未开始'; break;
                case 1: row['stateName'] = '进行中'; break;
                case 2: row['stateName'] = '已结束'; break;
                default: row['stateName'] = '不合法'; break;
            }
            let rewards = row['rewards'];
            row['rewards'] = [];
            rewards.forEach(reward=>{
                row['rewards'].push(this.modifiedReward(reward));
            })
            return row;
        },
        modifiedReward(reward) {
            reward['isEditing'] = false;
            reward['id'] = this.util.toValidNumber(reward['id']);
            reward['category'] = this.util.toValidNumber(reward['category']);
            reward['percent'] = this.util.toValidNumber(reward['percent']);
            reward['amount'] = this.util.toValidNumber(reward['amount']);
            switch(reward['category']) {
                case 0: 
                    reward['categoryName'] = '书籍';
                    break;
                case 1: 
                    reward['categoryName'] = '优惠券'; 
                    break;
                case 2: 
                    reward['categoryName'] = '积分'; 
                    break;
                default: 
                    reward['categoryName'] = '实物奖品'; 
                    break;
            }
            return reward;
        },
        addRound() {
            this.showNewRoundForm = true;
        },
        giveUpRoundAdd() {
            this.showNewRoundForm = false;
        },
        editRound(row) {
            if(this.isEditing){
                this.$message({
                    message: '请先完成之前的编辑操作',
                    type: 'warning'
                });
                return ;
            }
            this.newRound['end_time'] = row.end_time;
            this.newRound['start_time'] = row.start_time;
            row.isEditing = true;
            this.isEditing = true;
            this.$store.commit('setEditStatus', true);
        },
        saveRound(row) {
            if(row.start_time >= row.end_time) {
                this.$message.error('结束时间应当比开始时间晚');
                return;
            }
            var st = this.newRound.start_time === row.start_time? -1: row.start_time/1000;
            var ed = this.newRound.end_time === row.end_time? -1: row.end_time/1000;
            this.putRoundTimeChange(row.id,st,ed);
            this.newRound.start_time = 0;
            this.newRound.end_time = 0;
            row.isEditing = false;
            this.isEditing = false;
            this.$store.commit('setEditStatus', false);
        },
        recoverRound(row) {
            row.start_time = this.newRound.start_time;
            row.end_time = this.newRound.end_time;
            row.isEditing = false;
            this.isEditing = false;
            this.$store.commit('setEditStatus', false);
        },
        deleteRound(row) {
            this.$confirm(
                '确认删除？'
            ).then(
                _ => {
                    this.removeRound(row.id);
                }
            ).catch(
                _ => {

                }
            );
        },
        editReward(reward, row){
            if(this.isEditing){
                this.$message({
                    message: '请先完成之前的编辑操作',
                    type: 'warning'
                });
                return;
            }
            Object.assign(this.newReward, reward);
            this.editingRowId = row.id;
            this.isEditing = true;
            this.newRewardDialogVisible = true;
            this.$store.commit('setEditStatus', true);
        },
        saveReward(){
            this.$refs.rewardForm.validate((valid) => {
            if (valid) {
                let info = {
                    title: this.newReward.title,
                    category: this.newReward.category,
                    percent: this.newReward.percent,
                    amount: this.newReward.amount
                };
                switch(info.category){
                    //TODO: 接入BookPicker
                    case 0: info['back'] = this.newReward.book_id; break;
                    case 1: info['back'] = this.newReward.text; break;
                    case 2: info['back'] = this.newReward.credit; break;
                    default: info['back'] = this.newReward.text; break;
                }
                if(this.newReward.hasOwnProperty('id')){
                    info['id'] = this.newReward.id;
                }
                this.$http.post(this.$store.state.host + '/adminpannel/round/' + this.editingRowId, 
                    info,
                    {emulateJSON: true}
                ).then(response =>{
                        // success callback
                        if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                            this.$message.success('添加成功!');
                            this.newRewardDialogVisible = false;
                            this.refreshPage();
                            this.isEditing = false;
                            this.$store.commit('setEditStatus', false);
                        }
                        else{
                            this.$message.error('添加失败，请检查输入信息');
                        }
                    }, this.util.returnFailHandler
                );
            }})
        },
        deleteReward(reward){
            this.$confirm(
                '确认删除？删除后订单页将无法看到该奖品信息。'
            ).then(
                _ => {
                    this.removeReward(reward.id);
                }
            ).catch(
                _ => {

                }
            );
        },
        addNewReward(row){
            if(this.isEditing){
                this.$message({
                    message: '请先完成之前的编辑操作',
                    type: 'warning'
                });
                return ;
            }
            this.newReward = {
                category: 0,
                title: '',
                name: '',
                text: '',
                credit: 0,
                percent: 0,
                amount: 0,
            }
            this.isEditing = true;
            this.editingRowId = row.id;
            this.newRewardDialogVisible = true;
            this.$store.commit('setEditStatus', true);
        },
        giveUpAdd(){
            this.isEditing = false;
            this.newRewardDialogVisible = false;
            this.$store.commit('setEditStatus', false);
        },
        getRoundAmount() {
            this.$http.get(
                this.$store.state.host + '/adminpannel/rounds' + this.fliterStr + '/amount',
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                        this.roundAmount = this.util.toValidNumber(response.body['info']);
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler
            );
        },
        putRoundTimeChange(id, st, ed) {
            if(st !== -1) {
                this.$http.put(this.$store.state.host + '/adminpannel/activities/endtime/'+id+'/'+st,
                    null,
                    {emulateJSON: true}
                ).then(response =>{
                        // success callback
                        var code = response.body['code'];
                        if(!this.util.sessionCheck(code)) {
                            return; 
                        }
                        switch(code) {
                            case 404: this.$message.error('非法的活动id'); break;
                            case 405: this.$message.error('无效或不存在的活动'); break;
                            case 437: this.$message.error('开始时间不应比当前时间早，也不能比结束时间晚'); break;
                            case 200: {
                                this.$message.success('修改开始时间成功!');
                                this.refreshPage();
                            } break;
                            default: this.util.returnFailHandler();
                        } 
                    }, this.util.returnFailHandler
                );
            }
            if(ed !== -1) {
                this.$http.put(this.$store.state.host + '/adminpannel/activities/endtime/'+id+'/'+ed,
                    null, 
                    {emulateJSON: true}
                ).then(response =>{
                        // success callback
                        var code = response.body['code'];
                        if(!this.util.sessionCheck(code)) {
                            return; 
                        }
                        switch(code) {
                            case 404: this.$message.error('非法的活动id'); break;
                            case 405: this.$message.error('无效或不存在的活动'); break;
                            case 437: this.$message.error('结束时间不应比当前时间或开始时间晚'); break;
                            case 200: {
                                this.$message.success('修改结束时间成功!');
                                this.refreshPage();
                            } break;
                            default: this.util.returnFailHandler();
                        } 
                    }, this.util.returnFailHandler
                );
            }
        },
        getRoundByPage(page) {
            this.$http.get(this.$store.state.host + '/adminpannel/rounds' + this.fliterStr + '/' + page + '/' + this.pageSize,
                {emulateJSON: true}
            ).then(response => {
                    // success callback，加载整页书籍
                    if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                        this.rounds = [];
                        var roundsGet = response.body['info'];
                        roundsGet.forEach((round) => {
                            this.rounds.push(this.modifiedRound(round));
                        });
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler  
            );
        },
        removeReward(id) {
            this.$http.delete(this.$store.state.host + '/adminpannel/reward/' + id, 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                        this.$message.success('删除成功');
                        this.refreshPage();
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler
            );
        },
        removeRound(id) {
            this.$http.delete(this.$store.state.host + '/adminpannel/round/' + id, 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && response.body['code'] === 200){
                        this.$message.success('删除成功');
                        this.refreshPage();
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
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

.bg-grey {
    background: #ececec;
}

.grid-content {
    border-radius: 4px;
    min-height: 40px;
    padding:5px 20px;
    margin: 10px 0;
}

</style>
