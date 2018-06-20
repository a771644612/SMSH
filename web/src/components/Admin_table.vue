<template>
    <div class="container">
        <div class="upper-tools">
            <span class="tools-unit">
                <el-button type="success" icon="el-icon-refresh" @click.native="refreshPage" circle></el-button>
            </span>
            <span class="tools-unit">
                <el-button type="primary" icon="el-icon-plus" @click.native="addAdmin" circle></el-button>
            </span>
        </div>
        <div class="register-form-wrapper">
            <el-dialog 
                width="500px" 
                title="新管理员信息" 
                :visible.sync="showRegisterForm"
                :before-close="handleClose"
                :modal-append-to-body="false">
                <el-form
                    ref="newAdmin"
                    :rules="rules"  
                    :label-position="'top'" 
                    :model="newAdmin"
                    status-icon>
                    <el-form-item prop="username" label="名称" :label-width="'50px'">
                        <el-input 
                            v-model="newAdmin.username" 
                            auto-complete="off" 
                            placeholder="在此输入管理员名"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码" :label-width="'50px'">
                        <el-input 
                            v-model="newAdmin.password" 
                            auto-complete="off" 
                            placeholder="在此输入密码">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password2" label="密码" :label-width="'50px'">
                        <el-input 
                            v-model="newAdmin.password2" 
                            auto-complete="off" 
                            placeholder="在此输入密码">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="giveUpAdd">取 消</el-button>
                    <el-button type="primary" @click="submitAdd">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div class="table-wrapper">
            <el-table
                :data="admins"
                border
                stripe
                tooltip-effect="dark"
                style="width: 100%;"
                max-height="600">
                <el-table-column
                    label="管理员id"
                    prop="id"
                    header-align="center"
                    align="center"
                    min-width="100">
                </el-table-column>
                <el-table-column
                    label="管理员名"
                    prop="username"
                    header-align="center"
                    align="center"
                    min-width="200">
                </el-table-column>
                <el-table-column
                    label="操作"
                    header-align="center"
                    align="center"
                    min-width="100"
                    fixed="right">
                    <template slot-scope="scope">
                        <span>
                            <el-button type="danger" icon="el-icon-delete" @click.native="deleteAdmin(scope.row.id)" circle></el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        var checkUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if(value.indexOf(" ") !== -1) {
                callback(new Error('不要输入空格'));
            } else {
                callback();
            }
        };
        var checkPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if(value.indexOf(" ") !== -1) {
                callback(new Error('不要输入空格'));
            } else {
                if (this.newAdmin.password2 !== '') {
                    this.$refs.newAdmin.validateField('password2');
                }
                callback();
            }
        };
        var checkPassword2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if(value.indexOf(" ") !== -1) {
                callback(new Error('不要输入空格'));
            } else if (value !== this.newAdmin.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            pageNo: 1,
            pageSize: 20,
            adminAmount: 0,
            showRegisterForm: false,
            newAdmin: {
                username: '',
                password: '',
                password2: ''
            },
            admins: [],
            rules: {
                username: [{ 
                    validator: checkUsername, trigger: 'blur' 
                }],
                password: [{
                    validator: checkPassword, trigger: 'blur' 
                }],
                password2: [{
                    validator: checkPassword2, trigger: 'blur' 
                }],
            }
        };
    },
    mounted() {
        this.refreshPage();
    },
    methods: {
        refreshPage() {
            this.$store.commit('setLoadingStatus', true); 
            this.getAdminByPage(this.pageNo);
        },
        addAdmin() {
            this.showRegisterForm = true;
        },
        giveUpAdd() {
            this.showRegisterForm = false;
            this.$refs['newAdmin'].resetFields();
        },
        submitAdd() {
            this.$refs['newAdmin'].validate((valid) => {
                if (valid) {
                    this.postAdmin({'username': this.newAdmin.username, 'password': this.newAdmin.password});
                }
            });
        },
        deleteAdmin(id) {
            this.$confirm('确定删除这个管理员账号?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.commit('setLoadingStatus', true); 
                this.removeAdmin(id);
                this.refreshPage();
            }).catch(() => {
                this.$message.info('已取消删除');          
            });
        },
        handleClose(done) {
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
        getAdminAmount() {
            this.$http.get(this.$store.state.host + '/adminpannel/admins/amount',
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return;
                    }
                    this.adminAmount = response.body['info'];
                }, this.util.returnFailHandler
            );
        },
        postAdmin(admin) {
            this.$http.post(this.$store.state.host + '/adminpannel/admin', 
                admin,
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return;
                    }
                    switch(code) {
                        case 400: this.$message.error('输入为空！'); break;
                        case 412: this.$message.error('已存在的管理员名'); break;
                        case 200: {
                            this.giveUpAdd();
                            this.$message.success('添加成功!');
                            this.refreshPage();
                            return;
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    this.$store.commit('setLoadingStatus', false);
                }, this.util.returnFailHandler
            );
        },
        getAdminByPage(page) {
            this.$http.get(this.$store.state.host + '/adminpannel/admins/page/' + page + '/' + this.pageSize,
                {emulateJSON: true}
            ).then(response => {
                    // success callback，加载整页书籍
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return;
                    }
                    switch(code) {
                        case 402: this.$message.error('页容量过大或非正'); break;
                        case 200: {
                            this.admins = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        },
        removeAdmin(id) {
            this.$http.delete(this.$store.state.host + '/adminpannel/admin/' + id, 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return;
                    }
                    switch(code) {
                        case 404: this.$message.error('不存在的管理员'); break;
                        case 413: this.$message.error('不能删除超级管理员'); break;
                        case 414: this.$message.error('已删除的管理员'); break;
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
}

.upper-tools {
    margin-bottom: 20px;
    padding-top: auto;
}

.tools-unit {
    text-align: center;
    vertical-align: middle;
    margin-right: 10px;
}

.bottom-pagination {
    margin-top: 20px;
    text-align: center;
}
.el-table {
    margin: 0;
}

</style>
