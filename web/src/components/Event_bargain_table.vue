<template>
    <div class="container">

        <div class="upper-tools">
            <span class="tools-unit">
                <el-button type="success" icon="el-icon-refresh" @click.native="refreshPage" circle></el-button>
            </span>
            <span class="tools-unit">
                <el-button type="primary" icon="el-icon-plus" @click.native="addBargain" circle></el-button>
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

        <div class="new-bargain-form-wrapper">
            <new-bargain-dialog
                v-show="showNewBargainForm"
                @hide="givpUpAdd"
                @refreshPage="refreshPage"
                :visiable="showNewBargainForm">
            </new-bargain-dialog>
        </div>

        <div class="table-wrapper">
            <el-table
                :data="bargains"
                border
                stripe
                tooltip-effect="dark"
                style="width: 100%;"
                max-height="600">
                <el-table-column
                    label="活动标题"
                    prop="bargain_title"
                    header-align="center"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column 
                    label="书籍"
                    width="60"
                    header-align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-end"
                            width="300"
                            trigger="hover">
                            <div class="book-info-wrapper">
                                <el-card :body-style="{ padding: '0px' }">
                                    <img :src="scope.row.cover" width="300" height="300"/>
                                    <div style="padding: 14px;">
                                        <span>{{scope.row.book_title}}</span>
                                        <div class="bottom clearfix">
                                            <span class="book-brief">
                                                {{scope.row.brief}}
                                            </span>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <el-button slot="reference" icon="el-icon-search" circle></el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    label="起价"
                    prop="original_price"
                    header-align="center"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="当前价格"
                    prop="current_price"
                    header-align="center"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="剩余图书"
                    prop="books_left"
                    header-align="center"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    label="剩余次数"
                    prop="times_left"
                    header-align="center"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    label="参与人数"
                    prop="users_count"
                    header-align="center"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="状态"
                    prop="state"
                    width="80"
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
                            :disabled="scope.row.state !== 0 || !scope.row.isEditing"
                            :clearable="false"
                            :editable="false"
                            :prefix-icon="scope.row.state === 0 && scope.row.isEditing? 'el-icon-edit': 'el-icon-date'"
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
                    header-align="center"
                    align="left"
                    min-width="200">
                </el-table-column>
                <el-table-column
                    label="操作"
                    header-align="center"
                    fixed="right"
                    width="120">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="!scope.row.isEditing">
                                <el-button type="warning" icon="el-icon-edit" @click.native="editBargain(scope.row)" circle>
                                </el-button>
                            </span>
                            <span v-if="!scope.row.isEditing">
                                <el-button type="danger" icon="el-icon-delete" @click.native="deleteBargain(scope.row)" circle>
                                </el-button>
                            </span>
                            <span v-if="scope.row.isEditing">
                                <el-button type="primary" icon="el-icon-check" @click.native="saveBargain(scope.row)" circle>
                                </el-button>
                            </span>
                            <span v-if="scope.row.isEditing">
                                <el-button type="danger" icon="el-icon-close" @click.native="recoverBargain(scope.row)" circle>
                                </el-button>
                            </span>
                        </div>
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
                :total="bargainAmount">
            </el-pagination>
        </div>
        

    </div>
</template>

<script>
import newBargainDialog from './Event_bargain_new_dialog.vue';

export default {
    components: {
        newBargainDialog, // newBargainDialog: () => import('./Event_bargain_new_dialog.vue')
    },
    data () {
        return {
            loading: false,
            loadingText: "玩命加载中",
            bargainAmount: 0,
            maxPage: 0,
            pageNo: 1,
            pageSize: 10,
            fliterStr: '',
            showNewBargainForm: false,
            multipleSelection: [],
            st: 0,
            ed: 0,
            editing: -1,
            bargains: [{state:1,isEditing: false,start_time:0,end_time:10}],
        }
    },
    mounted() {
        this.refreshPage();
    },
    computed: {
        isEditing() {
            return this.editing !== -1;
        }
    },
    methods: {
        refreshPage() {
            this.pageLeaveEnsure((sure) => {
                if(sure) {
                    this.$store.commit('setLoadingStatus', true); 
                    this.getBargainAmount();
                    this.getBargainByPage(this.pageNo);
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
        modifiedBargain(row) {
            row['isEditing'] = false;
            row['id'] = this.util.toValidNumber(row['id']);
            row['times_left'] = this.util.toValidNumber(row['times_left']);
            row['books_left'] = this.util.toValidNumber(row['books_left']);
            row['start_time'] = this.util.toValidNumber(row['start_time'])*1000;
            row['end_time'] = this.util.toValidNumber(row['end_time'])*1000;
            row['state'] = this.util.toValidNumber(row['state']);
            switch(row['state']) {
                case 0: row['stateName'] = '未开始'; break;
                case 1: row['stateName'] = '进行中'; break;
                case 2: row['stateName'] = '已结束'; break;
                default: row['stateName'] = '不合法'; break;
            }
            return row;
        },
        addBargain() {
            if(this.isEditing) {
                this.$message.error('请先完成当前进行中的修改');
                return;
            }
            this.showNewBargainForm = true;
        },
        givpUpAdd() {
            this.showNewBargainForm = false;
        },
        givpUpEdit(row) {
            this.st = 0;
            this.ed = 0;
            this.editing = -1;
            this.$store.commit('setEditStatus', false);
            row.isEditing = false;
        },
        editBargain(row) {
            if(this.isEditing) {
                this.$message.error('请先完成当前进行中的修改');
                return;
            }
            this.editing = row.id;
            this.st = row.start_time;
            this.ed = row.end_time;
            row.isEditing = true;
            this.$store.commit('setEditStatus', true);
        },
        saveBargain(row) {
            if(row.start_time >= row.end_time) {
                this.$message.error('结束时间应当比开始时间晚');
                return;
            }
            var st = this.st === row.start_time? -1: row.start_time/1000;
            var ed = this.ed === row.end_time? -1: row.end_time/1000;
            this.$store.commit('setLoadingStatus', true);
            this.putBargainTimeChange(row.id, st, ed);
            this.givpUpEdit(row);
            this.refreshPage();
        },
        recoverBargain(row) {
            row.start_time = this.st;
            row.end_time = this.ed;
            this.givpUpEdit(row);
        },
        deleteBargain(row) {
            if(this.isEditing) {
                this.$message.error('请先完成当前进行中的修改');
                return;
            }
            this.$store.commit('setLoadingStatus', true); 
            this.removeBargain(row.id);
        },
        getBargainAmount() {
            this.$http.get(
                this.$store.state.host + '/adminpannel/bargains' + this.fliterStr + '/amount',
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 200: {
                            this.bargainAmount = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        },
        putBargainTimeChange(id, st, ed) {
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
        getBargainByPage(page) {
            this.$http.get(this.$store.state.host + '/adminpannel/bargains' + this.fliterStr + '/' + page + '/' + this.pageSize,
                {emulateJSON: true}
            ).then(response => {
                    // success callback，加载整页书籍
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 402: this.$message.error('非法的页码'); break;
                        case 200: {
                            this.bargains = [];
                            var bargainsGet = response.body['info'];
                            bargainsGet.forEach((bargain) => {
                                this.bargains.push(this.modifiedBargain(bargain));
                            });
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            );
        },
        removeBargain(id) {
            this.$http.delete(this.$store.state.host + '/adminpannel/bargain/' + id, 
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 404: this.$message.error('非法的活动id'); break;
                        case 405: this.$message.error('不存在的活动'); break;
                        case 200: {
                            this.$message.success('删除成功');
                            this.refreshPage();
                            return;
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
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
