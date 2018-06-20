<template>
    <div class="container">
        <div class="upper-tools">
            <span class="tools-unit">
                <el-button type="success" icon="el-icon-refresh" @click.native="refreshPage" circle></el-button>
            </span>
            <!--<span class="search-area">    
                <el-input v-model="searchStr" maxlength="10" placeholder="输入用户昵称/电话/地址进行检索">
                    <el-button slot="append" type="primary" icon="el-icon-search" @click.native="searchUser"></el-button>
                </el-input>
            </span>-->
        </div>

        <div class="grid-content bg-white">
            <el-row class="row-margin">
                <el-col :span="11" >
                    <div>
                        <span>精确约束：</span>
                        <el-select class="fliter-select" 
                            v-model="whereKeywordType" @change="whereChange" placeholder="选择字段">
                            <el-option v-for="item in whereFliters"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">
                                    {{ item.label }}
                                </span>
                            </el-option>
                        </el-select>
                        <el-input class="fliter-input"
                            v-if="whereKeywordType === 'id'" 
                            v-model="whereKeyword" 
                            :disabled="whereKeywordType === null"
                            placeholder="输入筛选条件">
                        </el-input>
                        <el-select class="fliter-select" 
                            v-if="whereKeywordType === 'addressprovince'"
                            v-model="whereKeyword" placeholder="选择省份">
                            <el-option v-for="item in provinces"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">
                                    {{ item.label }}
                                </span>
                            </el-option>
                        </el-select>
                        <el-input class="fliter-input" 
                            v-if="whereKeywordType === 'addresscity'"
                            v-model="whereKeyword" 
                            placeholder="输入城市">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="11" >
                    <div>
                        <span>模糊检索：</span>
                        <el-select class="fliter-select" v-model="likeKeywordType" @change="likeChange" placeholder="选择字段">
                            <el-option v-for="item in likeFliters"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">
                                    {{ item.label }}
                                </span>
                            </el-option>
                        </el-select>
                        <el-input class="fliter-input" 
                            v-if="likeKeywordType !== null && likeKeywordType !== '-'"
                            v-model="likeKeyword" 
                            placeholder="输入筛选条件">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" icon="el-icon-search" @click.native="searchUser">检索</el-button>
                </el-col>
            </el-row>
        </div>

        <div class="table-wrapper">
            <el-table
                :data="users"
                @sort-change="sortChange"
                border
                stripe
                tooltip-effect="dark"
                style="width:100%"
                max-height="640">
                <el-table-column label="更多操作" type="expand" fixed="left" width="100">
                    <template slot-scope="scope">
                        <div class="inline-tools">
                            <el-dialog 
                                width="800px" 
                                title="评论列表" 
                                top="3vh"
                                :visible.sync="scope.row.showComments"
                                :modal-append-to-body="false">
                                <comment-list from="user" v-bind:id="scope.row.id"/>
                            </el-dialog>
                            <span v-if="!scope.row.isEditing">
                                <span class="tools-unit">
                                    <el-button type="info" icon="el-icon-search" @click="scope.row.showComments=true">
                                        查看评论
                                    </el-button>
                                </span>
                                <span class="tools-unit">
                                    <el-button type="warning" icon="el-icon-edit" @click.native="editCredits(scope.row)">
                                        修改积分
                                    </el-button>
                                </span>
                            </span>
                            <span v-if="scope.row.isEditing">
                                <span class="tools-unit">
                                    <el-button type="danger" icon="el-icon-close" @click.native="recoverCredits(scope.row)" circle></el-button>
                                </span>
                                <span class="tools-unit">
                                    <el-button type="danger" icon="el-icon-minus" @click.native="subCredits(scope.row)" circle></el-button>
                                </span>
                                <span class="tools-unit">
                                    <el-input v-model="deltaCredit" maxlength="10" clearable></el-input>
                                </span>
                                <span class="tools-unit">
                                    <el-button type="success" icon="el-icon-plus" @click.native="addCredits(scope.row)" circle></el-button>
                                </span>
                                <span class="tools-unit">
                                    <el-button type="primary" icon="el-icon-check" @click.native="saveCredits(scope.row)" circle></el-button>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="昵称"
                    prop="name"
                    header-align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="电话号码"
                    prop="tel"
                    header-align="center"
                    align="right"
                    width="120">
                </el-table-column>
                <el-table-column
                    label="收货地址"
                    prop="address"
                    header-align="center">
                </el-table-column>
                <el-table-column
                    label="积分"
                    prop="credits"
                    sortable="custom"
                    header-align="center"
                    align="right"
                    width="120">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            {{scope.row.credits}}
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-input v-model="scope.row.credits" maxlength="10" @change="creditsCheck(scope.row)"></el-input>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="上次登录"
                    prop="lastlogin"
                    sortable="custom"
                    header-align="center"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="上次签到"
                    prop="lastcheck"
                    sortable="custom"
                    header-align="center"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="连续签到天数"
                    prop="checks"
                    sortable="custom"
                    header-align="center"
                    align="right"
                    width="120">
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
                :total="userAmount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import CommentList from './Comment_list.vue';

export default {
    components: {
        CommentList,//CommentList: () => import('./Comment_list.vue')
    },
    data() {
        return {
            loading: false,
            pageNo: 1,
            pageSize: 10,
            userAmount: 0,
            deltaCredit: 1,
            isEditing: null,
            creditsBak: 0,
            orderBy: null,
            orderDesc: 0,
            searchStr: '',
            getUsersTemplate: this.$store.state.host + '/adminpannel/users/by{0}/{1}/{2}/{3}',
            lastWhereType: null,
            whereKeywordType: null,
            whereKeyword: null,
            lastLikeType: null,
            likeKeywordType: null,
            likeKeyword: null,
            lastOrderType: 'id',
            orderKeywordType: null,
            whereFliters: [
                {value: '-', label: '-'},
                {value: 'id',label: 'id'},
                {value: 'addressprovince',label: '省份'},
                {value: 'addresscity',label: '城市'},
            ],
            likeFliters: [
                {value: '-', label: '-'},
                {value: 'addressprovince', label: '省份'},
                {value: 'addresscity', label: '城市'},
                {value: 'address', label: '地址'},
                {value: 'tel', label: '电话'},
                {value: 'name', label: '昵称'},
            ],
            fliter: {
                'keyword': {
                    'addressprovince': null, 
                    'addresscity': null,
                    'address': null, 
                    'tel': null, 
                    'name': null,
                },
                'where': {
                    'id': null, 
                    'addressprovince': null, 
                    'addresscity': null,
                },
                'order': {
                    'id': 1, 
                    'checks': null, 
                    'lastcheck': null, 
                    'lastlogin': null, 
                    'credits': null
                }
            },
            users: [],
            expands: [],
            provinces: [
                {label:'北京', value:'北京'},
                {label:'广东', value:'广东'},
                {label:'山东', value:'山东'},
                {label:'江苏', value:'江苏'},
                {label:'河南', value:'河南'},
                {label:'上海', value:'上海'},
                {label:'河北', value:'河北'},
                {label:'浙江', value:'浙江'},
                {label:'香港', value:'香港'},
                {label:'陕西', value:'陕西'},
                {label:'湖南', value:'湖南'},
                {label:'重庆', value:'重庆'},
                {label:'福建', value:'福建'},
                {label:'天津', value:'天津'},
                {label:'云南', value:'云南'},
                {label:'四川', value:'四川'},
                {label:'广西', value:'广西'},
                {label:'安徽', value:'安徽'},
                {label:'海南', value:'海南'},
                {label:'江西', value:'江西'},
                {label:'湖北', value:'湖北'},
                {label:'山西', value:'山西'},
                {label:'辽宁', value:'辽宁'},
                {label:'台湾', value:'台湾'},
                {label:'黑龙江', value:'黑龙江'},
                {label:'内蒙古', value:'内蒙古'},
                {label:'澳门', value:'澳门'},
                {label:'贵州', value:'贵州'},
                {label:'甘肃', value:'甘肃'},
                {label:'青海', value:'青海'},
                {label:'新疆', value:'新疆'},
                {label:'西藏', value:'西藏'},
                {label:'吉林', value:'吉林'},
                {label:'宁夏', value:'宁夏'}
            ],
        };
    },
    mounted() {
        this.refreshPage();
    },
    methods: {
        refreshPage() {
            this.pageLeaveEnsure((sure) => {
                if(sure) {
                    this.$store.commit('setLoadingStatus', true); 
                    this.getUserAmount();
                    this.getUsersByPage();
                }
            });
        },
        pageLeaveEnsure(callback) {
            if(this.isEditing) {
                this.$confirm('当前仍有正在进行的编辑，确定要放弃这些编辑加载新的一页?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.giveUpEdit({isEditing:false});
                    callback(true);
                }).catch(() => {
                    this.$message.info('已取消');
                    callback(false);
                });
            } else {
                callback(true);
            }
        },
        handleSizeChange(value) {
            this.pageLeaveEnsure((sure) => {
                if(sure) {
                    this.pageNo = this.lastPage = 1;
                    this.lastSize = this.pageSize = value;
                    this.refreshPage();
                } else {
                    this.pageSize = this.lastSize;
                }
            });
        },
        handleCurrentChange(value) {
            this.pageLeaveEnsure((sure) => {
                if(sure) {
                    this.pageNo = this.lastPage = value;
                    this.refreshPage();
                } else {
                    this.pageNo = this.lastPage;
                }
            });
        },
        whereChange(type) {/*
            var where = this.fliter.where;
            if(this.lastWhereType !== null) {
                where[this.lastWhereType] = null;
            }
            if(type === '-') {
                type = null;
            }
            this.lastWhereType = type;*/
        },
        likeChange(type) {/*
            var like = this.fliter.keyword;
            if(this.lastLikeType !== null) {
                like[this.lastLikeType] = null;
            }
            if(type === '-') {
                type = null;
            }
            this.lastLikeType = type;*/
        },
        sortChange(col) {
            var order = this.fliter.order = {};
            /*
            if(this.lastOrderType !== null) {
                order[this.lastOrderType] = null;
            }*/
            if(col.prop !== null) {
                order[col.prop] = col.order === 'ascending'? 1: 0;
                //this.lastOrderType = col.prop;
            } else {
                //order[this.lastOrderType] = null;
                order['id'] = 1;
                //this.lastOrderType = null;
            }
            //this.orderKeywordType = this.lastOrderType;
            this.searchUser();
        },
        searchUser() {
            var key = this.whereKeywordType;
            var value = this.whereKeyword;
            this.fliter.where = {};
            if(key !== null && key !== '-') {
                if(value.length === 0) {
                    this.$message.error('请输入内容');
                    return;
                }
                this.fliter.where[key] = value;
            }
            var key = this.likeKeywordType;
            var value = this.likeKeyword;
            this.fliter.keyword = {};
            if(key !== null && key !== '-') {
                if(value.length === 0) {
                    this.$message.error('请输入内容');
                    return;
                }
                this.fliter.keyword[key] = value;
            }
            this.refreshPage();
        },
        modifyUsers(usersGet) {
            usersGet.forEach((row) => {
                row['isEditing'] = false;
                row['showComments'] = false;
                row['address'] = row['addressprovince'] + row['addresscity'] + row['address'];
                row['credits'] = this.util.toValidNumber(row['credits']);
                row['lastlogin'] = this.util.timestampToStr(row['lastlogin']);
                row['lastcheck'] = this.util.timestampToStr(row['lastcheck']);
            });
        },
        addCredits(row) {
            var result = this.util.toValidNumber(this.deltaCredit, false);
            switch (result) {
                case 'error':
                    this.$message.error('请输入合法的数字');
                    break;
                case 'empty':
                    this.$message.error('还没有输入');
                    break;
                default:
                    this.deltaCredit = result;
                    row.credits += this.deltaCredit;
                    break;
            }
        },
        subCredits(row) {
            var result = this.util.toValidNumber(this.deltaCredit, false);
            switch (result) {
                case 'error':
                    this.$message.error('请输入合法的数字');
                    break;
                case 'empty':
                    this.$message.error('还没有输入');
                    break;
                default:
                    this.deltaCredit = result;
                    row.credits -= this.deltaCredit;
                    break;
            }
        },
        giveUpEdit(row) {
            this.isEditing = false;
            this.$store.commit('setEditStatus', false);
            row.isEditing = false;
        },
        saveCredits(row) {
            if(!this.creditsCheck(row)) {
                return;
            }
            if(row.credits === this.creditsBak) {
                this.giveUpEdit(row);
                this.$message.success('修改成功!');
                this.creditsBak = 0;
                return;
            }
            this.creditsBak = 0;
            this.$store.commit('setLoadingStatus', true); 
            this.postUserCredit(row);
        },
        recoverCredits(row) {
            row.credits = this.creditsBak;
            this.giveUpEdit(row);
        },
        editCredits(row) {
            if(this.isEditing) {
                this.$message.error('请先完成当前的修改');
                return;
            }
            row.isEditing = true;
            this.isEditing = true;
            this.$store.commit('setEditStatus', true);
            this.creditsBak = row.credits;
        },
        creditsCheck(row) {
            var result = this.util.toValidNumber(row.credits, false, true);
            switch (result) {
                case 'error':
                    this.$message.error('请输入合法的非负数');
                    return false;
                case 'empty':
                    this.$message.error('还没有输入');
                    return false;
            }
            return true;
        },
        getUserAmount() {
            this.$http.post(
                this.$store.state.host + '/adminpannel/users/0/0',
                {'keyword': JSON.stringify(this.fliter.keyword),
                'where': JSON.stringify(this.fliter.where),
                'order': JSON.stringify(this.fliter.order)},
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 402: this.$message.error('非法的页码'); break;
                        case 200: {
                            this.userAmount = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        },
        getUserById(uid) {
            this.$http.get(this.$store.state.host + '/adminpannel/user/'+uid,
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 405: this.$message.error('不存在的用户'); break;
                        case 200: {
                            this.users = [response.body['info']];
                            this.userAmount = 1;
                            this.modifyUsers(this.users);
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            );
        },
        postUserCredit(user) {
            this.$http.post(this.$store.state.host + '/adminpannel/user/'+user.id,
                {'credits': user.credits},
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 405: this.$message.error('不存在的用户'); break;
                        case 421: this.$message.error('非法的积分数'); break;
                        case 200: {
                            this.$message.success('修改成功!');
                            this.giveUpEdit(user);
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            )
        },
        getUsersByPage() {
            this.$http.post(
                this.$store.state.host + '/adminpannel/users/'+this.pageNo+'/'+this.pageSize,
                {'keyword': JSON.stringify(this.fliter.keyword),
                'where': JSON.stringify(this.fliter.where),
                'order': JSON.stringify(this.fliter.order)},
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 402: this.$message.error('非法的页码'); break;
                        case 200: {
                            var usersGet = response.body['info'];
                            this.modifyUsers(usersGet);
                            this.users = usersGet;
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            );
        },/*
        searchUser() {
            if(this.searchStr === '') {
                this.$message.error('输入为空');
                return;
            }
            this.$http.get(this.$store.state.host + '/adminpannel/user/search/'+this.searchStr,
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.pageNo = 1;
                    var usersGet = response.body['info'];
                    this.modifyUsers(usersGet);
                    this.users = usersGet;
                },
                this.util.returnFailHandler
            );
        }*/
    }
}
</script>

<style scoped>

.container {
    background-color: #aaccffaa;
    padding: 20px;
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

.fliter-input {
    width: 55%;
    min-width: 300px;
    margin-left: 10px;
}

.fliter-select {
    width: 150px;
}

.table-wrapper {
    background-color: lightcyan;
    padding: 10px;
    width: auto;
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

.tools-unit .el-input {
    width: 100px;
}

.bottom-pagination {
    margin-top: 20px;
    text-align: center;
}

span.search-area {
    float: right;
    width: 50%;
}

</style>
